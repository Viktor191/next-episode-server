import cron from "node-cron";
import {checkForNewSeasons} from "../services/checkNewSeasonsService";

// CRON-задача: проверка каждый день в 8 утра
cron.schedule("0 8 * * *", () => {
    checkForNewSeasons();
});

console.log("🕒 CRON-задача для проверки новых сезонов запущена!");

// "*/1 * * * *" для тестов раз в минуту,
// "0 8 * * *" а в восемь утра