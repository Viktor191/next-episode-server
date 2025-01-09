import { Router, Request, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authenticateToken';
import { Show } from '../models/models';

const router = Router();

// Create: POST (Добавление новой записи)
router.post('/add', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { title, ids } = req.body;

        if (!title || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ error: 'Необходимо указать название шоу и массив идентификаторов.' });
            return;
        }

        const newShow = new Show({ title, ids });
        await newShow.save();

        res.status(201).json({ message: 'Шоу добавлено', id: newShow._id });
    } catch (error: any) {
        console.error('Ошибка при добавлении шоу:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение всех шоу
router.get('/all', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const shows = await Show.find();
        res.status(200).json(shows);
    } catch (error: any) {
        console.error('Ошибка при получении шоу:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение одного шоу по ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const show = await Show.findById(id);
        if (!show) {
            res.status(404).json({ error: 'Шоу не найдено' });
            return;
        }

        res.status(200).json(show);
    } catch (error: any) {
        console.error('Ошибка при получении шоу:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновление шоу по ID
router.put('/update/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, ids } = req.body;

        if (!title && !ids) {
            res.status(400).json({ error: 'Не указаны данные для обновления.' });
            return;
        }

        const updatedShow = await Show.findByIdAndUpdate(
            id,
            { title, ids },
            { new: true, runValidators: true } // Возвращает обновлённый документ и выполняет валидацию
        );

        if (!updatedShow) {
            res.status(404).json({ error: 'Шоу не найдено для обновления' });
            return;
        }

        res.status(200).json({ message: 'Шоу обновлено', data: updatedShow });
    } catch (error: any) {
        console.error('Ошибка при обновлении шоу:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удаление шоу по ID
router.delete('/delete/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const deletedShow = await Show.findByIdAndDelete(id);
        if (!deletedShow) {
            res.status(404).json({ error: 'Шоу не найдено для удаления' });
            return;
        }

        res.status(200).json({ message: 'Шоу удалено', data: deletedShow });
    } catch (error: any) {
        console.error('Ошибка при удалении шоу:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;