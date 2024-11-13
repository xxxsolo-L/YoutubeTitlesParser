/*
import * as puppeteer from 'puppeteer';

async function fetchTitles(url: string): Promise<string[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await new Promise(r => setTimeout(r, 20000)); // Ждём 10 секунд

    await autoScroll(page);  // Прокручиваем страницу вниз
    const titles = await page.evaluate(() => {
        const elements = document.querySelectorAll('h3.style-scope.ytd-playlist-video-renderer');
        return Array.from(elements).map(element => {
            const titleElement = element.querySelector('a#video-title');
            return titleElement?.textContent?.trim() ?? '';
        }).filter(Boolean);
    });
    await browser.close();
    return titles;
}

async function autoScroll(page: puppeteer.Page) {
    let previousHeight = 0;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);
    let scrollAttempts = 0;

    console.log("Начало прокрутки");

    // Цикл для полной прокрутки до самого конца
    while (scrollAttempts < 20 && previousHeight !== currentHeight) {
        console.log(`Итерация ${scrollAttempts + 1}`);

        // Прокрутка до конца страницы
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise(r => setTimeout(r, 4000)); // Увеличенное время ожидания до 4 секунд

        // Обновляем высоту после прокрутки
        previousHeight = currentHeight;
        currentHeight = await page.evaluate(() => document.body.scrollHeight);

        console.log(`Высота страницы: previousHeight=${previousHeight}, currentHeight=${currentHeight}`);

        scrollAttempts++;
    }

    console.log("Цикл завершен: достигнут конец страницы или максимальное количество прокруток");
}
const url = 'https://www.youtube.com/playlist?list=PLnHJACx3NwAep5koWkniVHw8PK7dWCO21';
fetchTitles(url).then(titles => {
    const numberedTitles = titles.map((title, index) => `${index + 1}. ${title}`);
    console.log(numberedTitles);
});
*/
