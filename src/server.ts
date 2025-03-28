import dotenv from 'dotenv';
import express, {Application} from 'express';
import cors from 'cors';
import routes from "./routes";
import mongoose from "mongoose";
import "./cron/checkNewSeasons";
import helmet from 'helmet';

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
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    });

app.use(cors());
app.use(express.json());
app.use(
    helmet({
        contentSecurityPolicy: false, // ⛔ CSP отключён для dev
    })
);

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});