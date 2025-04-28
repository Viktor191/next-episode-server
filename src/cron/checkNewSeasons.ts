import cron from "node-cron";
import {checkForNewSeasons} from "../services/checkNewSeasonsService";
import {checkForNewMovies} from "services/checkForNewMovies";

// CRON-задача: проверка каждый день в 8 утра
cron.schedule("0 8 * * *", () => {
    console.log("🕗 CRON: проверка новых сезонов запущена");
    checkForNewSeasons();
});

// CRON-задача: каждый день в 8 утра – проверка фильмов
cron.schedule("0 8 * * *", () => {
    console.log("🕗 CRON: проверка новых фильмов запущена");
    checkForNewMovies();
});

console.log("🕒 CRON-задача для проверки новых сезонов и фильмов запущена!");

// "*/1 * * * *" для тестов раз в минуту,
// "0 8 * * *" а в восемь утра