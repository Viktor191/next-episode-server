import dotenv from 'dotenv';
import express, {
    Request,
    Response,
    NextFunction,
    Application
} from 'express';
import { MongoClient, ObjectId, Collection } from 'mongodb';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// Загружаем переменные окружения из .env
dotenv.config();

// Создание приложения Express
const app: Application = express();
const port = process.env.PORT || 3000;

// Проверяем, что MONGO_URI определён в .env
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error('MONGO_URI не задан в .env');
}

// Создаём клиента MongoDB
const client = new MongoClient(mongoUri);

// Интерфейс пользователя, хранимого в коллекции "users"
interface User {
    _id?: ObjectId;
    username: string;
    password: string;
}

// Интерфейс для произвольных данных (name, age)
interface SomeData {
    _id?: ObjectId;
    name: string;
    age: number;
}

// Глобальные переменные для коллекций
let usersCollection: Collection<User>;
let dataCollection: Collection<SomeData>;

// Подключаемся к базе данных
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB!');
        const database = client.db('testbase');
        // Коллекция для пользователей
        usersCollection = database.collection<User>('users');
        // Коллекция для произвольных данных
        dataCollection = database.collection<SomeData>('someData');
    } catch (err: any) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
}

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Интерфейс полезной нагрузки в токене (payload)
interface TokenPayload extends JwtPayload {
    userId: string;
    username: string;
}

// Расширяем Request, чтобы добавить user
interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

// Middleware для проверки JWT-токена
function authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Нет токена' });
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Нет токена' });
        return;
    }

    // Проверяем валидность токена
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(403).json({ error: 'Неверный или истёкший токен' });
            return;
        }

        // Сохраняем расшифрованный payload в req.user
        req.user = decoded as TokenPayload;
        next();
    });
}

// Подключаем middleware
app.use(cors());
app.use(express.json());

// Маршрут: регистрация
app.post(
    '/register',
    async (req: Request<{}, {}, { username: string; password: string }>, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: 'Введите логин и пароль' });
                return;
            }

            // Проверка существующего пользователя
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
                return;
            }

            // Хэшируем пароль
            const hashedPassword = await bcryptjs.hash(password, 10);

            // Сохраняем пользователя в базе
            const result = await usersCollection.insertOne({
                username,
                password: hashedPassword
            });

            res.status(201).json({
                message: 'Пользователь зарегистрирован',
                userId: result.insertedId
            });
        } catch (err: any) {
            console.error('Ошибка регистрации:', err.message);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
);

// Маршрут: авторизация
app.post(
    '/login',
    async (req: Request<{}, {}, { username: string; password: string }>, res: Response) => {
        try {
            const { username, password } = req.body;

            // Ищем пользователя по имени
            const user = await usersCollection.findOne({ username });
            if (!user) {
                res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
                return;
            }

            // Сравниваем хэши паролей
            const isPasswordValid = await bcryptjs.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
                return;
            }

            // Генерируем JWT-токен
            const token = jwt.sign(
                { userId: user._id?.toString(), username: user.username },
                JWT_SECRET,
                { expiresIn: '10h' }
            );

            res.status(200).json({ message: 'Успешная авторизация', token });
        } catch (err: any) {
            console.error('Ошибка авторизации:', err.message);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
);

// Защищённый маршрут (пример)
app.get('/protected', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Неавторизованный доступ' });
            return;
        }

        res.status(200).json({ message: 'Доступ открыт', user: req.user });
    } catch (error: any) {
        console.error('Ошибка при доступе к защищённому маршруту:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавление данных (именно { name, age })
app.post('/add', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, age } = req.body;

        if (!name || !age) {
            res.status(400).json({ error: 'Имя и возраст обязательны' });
            return;
        }

        // Сохраняем данные в коллекцию "someData"
        const result = await dataCollection.insertOne({
            name: String(name),
            age: Number(age)
        });

        res.status(201).json({ message: 'Данные добавлены', id: result.insertedId });
    } catch (err: any) {
        console.error('Ошибка при добавлении данных:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Стартуем сервер, после успешного подключения к MongoDB
connectToMongoDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});