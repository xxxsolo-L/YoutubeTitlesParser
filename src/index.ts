import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun } from 'docx';

async function fetchTitles(url: string): Promise<string[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await new Promise(r => setTimeout(r, 20000)); // Ждем 20 секунд

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

    // Цикл для полной прокрутки страницы
    while (scrollAttempts < 20 && previousHeight !== currentHeight) {
        console.log(`Итерация ${scrollAttempts + 1}`);

        // Прокрутка до конца страницы
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise(r => setTimeout(r, 4000)); // Увеличенная задержка

        // Обновляем высоту после прокрутки
        previousHeight = currentHeight;
        currentHeight = await page.evaluate(() => document.body.scrollHeight);

        console.log(`Высота страницы: previousHeight=${previousHeight}, currentHeight=${currentHeight}`);

        scrollAttempts++;
    }

    console.log("Цикл завершен: достигнут конец страницы или максимальное количество прокруток");
}

async function saveTitlesToDocx(titles: string[]) {
    // Исправляем: передаем пустой объект как параметр
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: titles.map((title, index) => {
                    return new Paragraph({
                        children: [
                            new TextRun(`${index + 1}. ${title}`)
                        ],
                    });
                }),
            },
        ],
    });

    // Сохраняем документ в файл
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("titles.docx", buffer);
    console.log("Документ успешно сохранен как titles.docx");
}

// URL для получения заголовков
const url = 'https://www.youtube.com/playlist?list=PLnHJACx3NwAep5koWkniVHw8PK7dWCO21';

fetchTitles(url).then(titles => {
    // Сохраняем полученные заголовки в .docx файл
    saveTitlesToDocx(titles);
});
