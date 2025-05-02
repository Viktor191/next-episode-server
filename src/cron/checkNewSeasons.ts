import cron from "node-cron";
import {checkForNewSeasons} from "../services/checkNewSeasonsService";
import {checkForNewMovies} from "services/checkForNewMovies";
import {info} from "helpers/logger";

cron.schedule("0 8 * * *", () => {
    info("🕗 CRON: проверка новых сезонов запущена");
    checkForNewSeasons();
});

cron.schedule("0 8 * * *", () => {
    info("🕗 CRON: проверка новых фильмов запущена");
    checkForNewMovies();
});

info("CRON-задача для проверки новых сезонов и фильмов запущена!");

// "*/1 * * * *" для тестов раз в минуту,
// "0 8 * * *" а в восемь утра