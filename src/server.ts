import dotenv from "dotenv";
import express, { Request, Response, Application } from "express";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import routes from "./routes";
import mongoose from "mongoose";
import { authenticateToken } from "middlewares/authenticateToken";

interface TokenPayload extends JwtPayload {
  userId: string;
  username: string;
}

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const app: Application = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

/*
app.post(
  "/login",
  async (
    req: Request<{}, {}, { username: string; password: string }>,
    res: Response
  ) => {
    try {
      const { username, password } = req.body;

      const user = await usersCollection.findOne({ username });
      if (!user) {
        res.status(400).json({ error: "Неверное имя пользователя или пароль" });
        return;
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ error: "Неверное имя пользователя или пароль" });
        return;
      }

      const token = jwt.sign(
        { userId: user._id?.toString(), username: user.username },
        JWT_SECRET,
        { expiresIn: "10h" }
      );

      res.status(200).json({ message: "Успешная авторизация", token });
    } catch (err: any) {
      console.error("Ошибка авторизации:", err.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
);

app.get("/protected", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "Доступ открыт" });
});

app.post("/add", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, age } = req.body;

    if (!name || !age) {
      res.status(400).json({ error: "Имя и возраст обязательны" });
      return;
    }

    const result = await dataCollection.insertOne({
      name: String(name),
      age: Number(age),
    });

    res
      .status(201)
      .json({ message: "Данные добавлены", id: result.insertedId });
  } catch (err: any) {
    console.error("Ошибка при добавлении данных:", err.message);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
*/
mongoose
  .connect(process.env.MONGO_URI as string, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
