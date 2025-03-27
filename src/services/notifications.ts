export const sendNotificationToUser = (userId: string, shows: string[]) => {
    console.log(`Уведомление отправлено пользователю ${userId} о сериалах: ${shows.join(", ")}`);
};