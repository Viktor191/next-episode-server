import dotenv from 'dotenv';
import express, {Application} from 'express';
import cors from 'cors';
import routes from './routes';
import mongoose from 'mongoose';
import './cron/checkNewSeasons';
import helmet from 'helmet';
import {info, error as logError} from 'helpers/logger';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error('MONGO_URI не задан в .env');
}

mongoose
    .connect(mongoUri, {})
    .then(() => {
        info('Подключено к MongoDB');
    })
    .catch((err: unknown) => {
        if (err instanceof Error) {
            logError('Ошибка подключения к MongoDB:', err.message);
        } else {
            logError('Неизвестная ошибка подключения к MongoDB:', err);
        }
    });

app.use(cors());
app.use(express.json());
app.use(
    helmet({
        contentSecurityPolicy: false, // CSP отключён для dev
    })
);

app.use('/api', routes);

app.listen(port, () => {
    info(`Сервер запущен http://localhost:${port}`);
});