import { tmdbApiClient } from 'helpers/tmdbApiClient';
import { ShowModel } from 'models/showModel';
import { sendNotificationToUser } from 'services/notifications';
import { info, warn, error as logError } from 'helpers/logger';

export const checkForNewSeasons = async (): Promise<void> => {
  info('Запуск проверки новых сезонов...');

  try {
    const favoriteShows = await ShowModel.find({ type: 'tv' });
    const tmdbIds = Array.from(new Set(favoriteShows.map(s => s.tmdbId)));

    for (const tmdbId of tmdbIds) {
      let showName = '';
      let seasons: Array<{ season_number: number; air_date?: string }> = [];

      try {
        const resp = await tmdbApiClient.get(`/tv/${tmdbId}?language=ru-RU`);
        showName = resp.data.name || resp.data.original_name;
        seasons = resp.data.seasons;
      } catch (err: unknown) {
        if (err instanceof Error) {
          warn(`Не удалось получить данные для TMDB ID ${tmdbId}:`, err.message);
        } else {
          warn(`Неизвестная ошибка при получении данных для TMDB ID ${tmdbId}:`, err);
        }
        continue;
      }

      if (!seasons.length) continue;

      const latest = seasons[seasons.length - 1];
      const latestNum = latest.season_number;
      const airDate = latest.air_date ? new Date(latest.air_date) : null;
      const today = new Date();

      await ShowModel.updateMany(
        { tmdbId, lastNotifiedSeason: { $lt: latestNum } },
        { $set: { lastNotifiedSeason: latestNum, isNotified: false } },
      );

      if (airDate && airDate <= today) {
        const toNotify = await ShowModel.find({
          tmdbId,
          lastNotifiedSeason: latestNum,
          isNotified: false,
        });

        info(
          `К уведомлению подготовлены ${toNotify.length} записей для ${showName} (сезон ${latestNum})`,
        );

        const userNotifications: Record<string, string[]> = {};
        for (const show of toNotify) {
          userNotifications[show.userId] ??= [];
          userNotifications[show.userId].push(`${showName} (сезон ${latestNum})`);
        }

        for (const [userId, shows] of Object.entries(userNotifications)) {
          try {
            await sendNotificationToUser(userId, shows);
            await ShowModel.updateMany({ tmdbId, userId }, { $set: { isNotified: true } });
          } catch (err: unknown) {
            if (err instanceof Error) {
              logError(`Ошибка при отправке уведомления пользователю ${userId}:`, err.message);
            } else {
              logError(`Неизвестная ошибка при отправке уведомления пользователю ${userId}:`, err);
            }
          }
        }
      }
    }

    info('Проверка новых сезонов завершена!');
  } catch (err: unknown) {
    if (err instanceof Error) {
      logError('Общая ошибка при проверке новых сезонов:', err.message);
    } else {
      logError('Неизвестная общая ошибка при проверке новых сезонов:', err);
    }
  }
};
