import {sendMail} from "helpers/mailService";
import {UserModel} from "models/userModel";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";


// Отправляет пользователю уведомление о новых сезонах и логирует в консоль

export const sendNotificationToUser = async (
    userId: string,
    shows: string[]
): Promise<void> => {
    console.log(
        `Уведомление отправлено пользователю ${userId} о сериалах: ${shows.join(", ")}`
    );

    const user = await UserModel.findById(userId);
    if (!user?.email) {
        console.warn(
            `User ${userId} has no email, skipping sending notification email.`
        );
        return;
    }

    const html = `
    <h2>Новые сезоны в ваших сериалах</h2>
    <ul>
      ${shows.map((s) => `<li>${s}</li>`).join("\n      ")}
    </ul>
    <p><a href="${CLIENT_URL}/upcoming">Смотреть расписание</a></p>
  `;
    console.log(`Уведомление отправлено пользователю ${userId} о сериалах: ${shows.join(", ")}`);
    try {
        await sendMail({
            to: user.email,
            subject: "Есть новые сезоны у ваших сериалов!",
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