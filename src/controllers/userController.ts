import { Response } from 'express';
import { getUserFavorites } from 'helpers/getUserFavorites';
import { AuthenticatedRequest } from 'types/request';
import { UserModel } from 'models/userModel';
import { error as logError } from 'helpers/logger';

export const getFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ error: 'Требуется идентификатор пользователя userId' });
      return;
    }
    const results = await getUserFavorites(userId);
    res.status(200).json(results);
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError('Ошибка при получении избранного:', err.message);
    } else {
      logError('Неизвестная ошибка при получении избранного:', err);
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404).json({ error: 'Пользователь не найден' });
    return;
  }
  res.status(200).json({
    username: user.username,
    email: user.email || '',
    telegram: user.telegram || '',
    notify: user.notify,
  });
};

export const updateMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { email, telegram, notify } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return;
    }

    if (email !== undefined) user.email = email;
    if (telegram !== undefined) user.telegram = telegram;
    if (notify !== undefined) user.notify = notify;

    await user.save();

    res.status(200).json({ message: 'Профиль обновлён' });
  } catch (err: unknown) {
    // Обработка ошибки дублирования уникального значения
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: number }).code === 11000
    ) {
      const mongoError = err as {
        code: number;
        keyPattern?: Record<string, unknown>;
      };

      if (mongoError.keyPattern) {
        const field = Object.keys(mongoError.keyPattern)[0];
        const message =
          field === 'email'
            ? 'Этот email уже используется другим пользователем'
            : field === 'telegram'
              ? 'Этот Telegram уже используется другим пользователем'
              : 'Дублирование уникального значения';

        res.status(400).json({ error: message });
        return;
      }
    }

    if (err instanceof Error) {
      logError('Ошибка при обновлении профиля:', err.message);
    } else {
      logError('Неизвестная ошибка при обновлении профиля:', err);
    }

    res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
};
