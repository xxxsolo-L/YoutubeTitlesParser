"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
async function fetchTitles(url) {
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        // Прокрутка страницы вниз для загрузки всех видео
        await autoScroll(page);
        // Получение заголовков
        const titles = await page.evaluate(() => {
            const elements = document.querySelectorAll('h3.style-scope.ytd-playlist-video-renderer');
            const result = [];
            elements.forEach((element) => {
                const titleElement = element.querySelector('a#video-title');
                const title = titleElement && titleElement.textContent ? titleElement.textContent.trim() : '';
                if (title)
                    result.push(title);
            });
            return result;
        });
        return titles;
    }
    catch (error) {
        console.error('Error fetching titles:', error);
        return [];
    }
    finally {
        await browser.close();
    }
}
// Функция автоматической прокрутки страницы
async function autoScroll(page) {
    let previousHeight = 0;
    let currentHeight = 0;
    let videoCount = 0;
    let scrolls = 0;
    while (scrolls < 20) { // Ограничение на количество прокруток
        previousHeight = currentHeight;
        currentHeight = await page.evaluate(() => document.body.scrollHeight);
        // Прокручиваем страницу
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        // Получаем текущее количество видео на странице
        const newVideoCount = await page.$$eval('h3.style-scope.ytd-playlist-video-renderer', (videos) => videos.length);
        // Если количество видео не увеличилось, значит мы дошли до конца
        if (newVideoCount === videoCount) {
            break;
        }
        videoCount = newVideoCount;
        // Даем время для подгрузки новых элементов
        await page.waitForTimeout(3000); // Используем waitForTimeout вместо устаревшего waitFor
        scrolls++;
    }
}
// Использование функции с нумерацией
const url = 'https://www.youtube.com/playlist?list=PLnHJACx3NwAep5koWkniVHw8PK7dWCO21';
fetchTitles(url).then(titles => {
    const numberedTitles = titles.map((title, index) => `${index + 1}. ${title}`);
    console.log(numberedTitles);
});
