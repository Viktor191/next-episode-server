import {sendMail} from "helpers/mailService";
import {UserModel} from "models/userModel";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";


// Отправляет пользователю уведомление о новых сезонах и логирует в консоль

export const sendNotificationToUser = async (
    userId: string,
    shows: string[]
): Promise<void> => {

    const user = await UserModel.findById(userId);

    if (!user?.email || user.notify === false) {
        console.warn(
            `User ${userId} email: ${user?.email} notify: ${user?.notify}.`
        );
        return;
    }

    const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; color: #333;">
    <h2 style="color: #ee8b05;">📢 Новинки в вашем избранном!</h2>

    <p>У вас есть обновления в любимых сериалах и фильмах:</p>

    <ul style="padding-left: 20px; margin-top: 16px; margin-bottom: 16px;">
      ${shows.map(show => `
        <li style="margin-bottom: 8px;">
          <span style="font-weight: bold;">${show}</span>
        </li>
      `).join('')}
    </ul>

    <p style="margin-top: 24px;">
      🔗 <a href="${CLIENT_URL}/upcoming" style="color: #ee8b05; text-decoration: none;">
        Перейти к списку новинок
      </a>
    </p>

    <hr style="margin-top: 32px; margin-bottom: 16px; border: none; border-top: 1px solid #ccc;" />

    <p style="font-size: 12px; color: #888;">
      Это автоматическое уведомление. Вы можете отключить уведомления в настройках своего профиля.
    </p>
  </div>
`;

    console.log(`Уведомление отправлено пользователю ${userId} о сериалах: ${shows.join(", ")}`);
    try {
        await sendMail({
            to: user.email,
            subject: "Новинки в ваших сериалах и фильмах!",
            html,
        });
        console.log(`Email notification sent to ${user.email}`);
    } catch (err: any) {
        console.error(
            `Failed to send notification email to ${user.email}:`,
            err
        );
    }
};