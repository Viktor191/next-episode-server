import { Response } from 'express';
import { tmdbApiClient } from 'helpers/tmdbApiClient';
import { unwrapObject } from 'helpers/unwrapObject';
import { ShowModel } from 'models/showModel';
import { AuthenticatedRequest } from 'types/request';
import { formatShowData } from 'helpers/formatShow';
import { info, warn, error as logError } from 'helpers/logger';

// Поиск фильма по имени
export const getMovieByName = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const name = req.params.name;
    if (!name) {
      res.status(400).json({ error: 'Введите название фильма' });
      return;
    }

    const response = await tmdbApiClient.get('/search/movie', {
      params: { query: name, language: 'ru-RU' },
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      res.status(200).json([]);
      return;
    }

    const simplifiedResults = results.map((data: unknown) => ({
      ...formatShowData(data),
      media_type: 'movie',
    }));

    res.status(200).json(simplifiedResults);
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError('Ошибка при поиске фильма:', err.message);
    } else {
      logError('Неизвестная ошибка при поиске фильма:', err);
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Поиск сериала по имени
export const getTvByName = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const name = req.params.name;
    if (!name) {
      res.status(400).json({ error: 'Введите название сериала' });
      return;
    }

    const response = await tmdbApiClient.get('/search/tv', {
      params: { query: name, language: 'ru-RU' },
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      res.status(200).json([]);
      return;
    }

    const simplifiedResults = results.map((data: unknown) => ({
      ...formatShowData(data),
      media_type: 'tv',
    }));

    res.status(200).json(simplifiedResults);
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError('Ошибка при поиске сериала:', err.message);
    } else {
      logError('Неизвестная ошибка при поиске сериала:', err);
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получить фильм по TMDB ID
export const getMovieByDbID = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const dbID = req.params.dbID;
    if (!dbID) {
      res.status(400).json({ message: 'Пожалуйста, укажите TMDB ID' });
      return;
    }

    const response = await tmdbApiClient.get(`/movie/${dbID}`, {
      params: { language: 'ru-RU' },
    });

    const movieData = response.data;
    if (movieData) {
      const simplifiedResult = {
        ...formatShowData(movieData),
        media_type: 'movie',
      };
      res.status(200).json(simplifiedResult);
      return;
    }

    res.status(404).json({ message: '❌ Фильм с указанным TMDB ID не найден' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError(`Ошибка при получении фильма с ID ${req.params.dbID}:`, err.message);
    } else {
      logError(`Неизвестная ошибка при получении фильма с ID ${req.params.dbID}:`, err);
    }
    res.status(500).json({ message: '❌ Внутренняя ошибка сервера при получении фильма' });
  }
};

// Получить сериал по TMDB ID
export const getTvByDbID = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const dbID = req.params.dbID;
    if (!dbID) {
      res.status(400).json({ message: 'Пожалуйста, укажите TMDB ID' });
      return;
    }

    const response = await tmdbApiClient.get(`/tv/${dbID}`, {
      params: { language: 'ru-RU' },
    });

    const tvData = response.data;
    if (tvData) {
      const simplifiedResult = {
        ...formatShowData(tvData),
        media_type: 'tv',
      };
      res.status(200).json(simplifiedResult);
      return;
    }

    res.status(404).json({
      message: '❌ Сериал с указанным TMDB ID не найден',
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError(`Ошибка при получении сериала с ID ${req.params.dbID}:`, err.message);
    } else {
      logError(`Неизвестная ошибка при получении сериала с ID ${req.params.dbID}:`, err);
    }
    res.status(500).json({ message: '❌ Внутренняя ошибка сервера при получении сериала' });
  }
};

// Получить по IMDb ID
export const getMovieByImdbID = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const imdbID = req.params.imdbID;
    if (!imdbID) {
      res.status(400).json({ message: 'Требуется указать IMDb ID' });
      return;
    }

    const response = await tmdbApiClient.get(`/find/${imdbID}`, {
      params: { external_source: 'imdb_id', language: 'ru-RU' },
    });

    const firstResult = unwrapObject(response.data);
    if (!firstResult) {
      res.status(404).json({ message: 'По указанному IMDb ID ничего не найдено' });
      return;
    }

    const simplifiedResult = formatShowData(firstResult);
    res.status(200).json(simplifiedResult);
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError('Ошибка при получении данных по IMDb ID:', err.message);
    } else {
      logError('Неизвестная ошибка при получении данных по IMDb ID:', err);
    }
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

// Добавить в избранное
export const addToFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.body;
    const userId = req.user?.userId;
    const { dbID } = req.params;
    if (!dbID || !type) {
      res.status(400).json({ error: 'Пожалуйста, укажите id и тип (tv или movie)' });
      return;
    }

    let lastNotifiedSeason = 0;
    if (type === 'tv') {
      try {
        const response = await tmdbApiClient.get(`/tv/${dbID}`, {
          params: { language: 'ru-RU' },
        });
        const seasons = response.data.seasons;
        lastNotifiedSeason = seasons.at(-1)?.season_number ?? 0;
      } catch (ignore: unknown) {
        warn('Ошибка при получении данных о сезонах:', ignore);
      }
    }

    const existingShow = await ShowModel.findOne({
      tmdbId: dbID,
      type,
      userId,
    });
    if (existingShow) {
      res.status(400).json({ error: 'Уже есть в избранном' });
      return;
    }

    await new ShowModel({
      tmdbId: dbID,
      type,
      userId,
      isNotified: false,
      lastNotifiedSeason,
    }).save();

    info(`Добавлено в избранное: ${dbID} (${type})`);
    res.status(201).json({ message: 'Успешно добавлено в избранное' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError('Ошибка при добавлении в избранное:', err.message);
    } else {
      logError('Неизвестная ошибка при добавлении в избранное:', err);
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Удалить из избранного
export const deleteFromFavorites = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: `Пожалуйста, укажите id: ${userId} / ${id}` });
      return;
    }

    await ShowModel.deleteOne({ tmdbId: id, userId });
    res.status(200).json({ message: 'Успешно удалено из избранного' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError('Ошибка при удалении из избранного:', err.message);
    } else {
      logError('Неизвестная ошибка при удалении из избранного:', err);
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Предстоящие фильмы
export const getUpcomingMovies = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;

    const response = await tmdbApiClient.get('/movie/upcoming', {
      params: {
        language: 'ru-RU',
        page,
      },
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      res.status(404).json({ error: '❌ Предстоящие фильмы не найдены' });
      return;
    }

    const simplifiedResults = results.map(formatShowData);
    res.status(200).json(simplifiedResults);
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError('Ошибка при получении предстоящих фильмов:', err.message);
    } else {
      logError('Неизвестная ошибка при получении предстоящих фильмов:', err);
    }
    res.status(500).json({ error: '❌ Ошибка сервера при получении предстоящих фильмов' });
  }
};
