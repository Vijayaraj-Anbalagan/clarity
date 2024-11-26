import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

export async function scrapeWebsite(startingUrl: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const visitedUrls = new Set<string>();
    const urlQueue: string[] = [startingUrl];

    const resultsDir = path.join(process.cwd(), 'public', 'scrapedData');
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir);
    }

    const getCoreDomain = (url: string) => {
        const { hostname } = new URL(url);
        const parts = hostname.split('.');
        return parts.slice(-2).join('.');
    };

    const coreDomain = getCoreDomain(startingUrl);

    async function scrapePage(url: string) {
        if (visitedUrls.has(url)) return null;
        visitedUrls.add(url);

        console.log(`Scraping: ${url}`);
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            const pageData = await page.evaluate(() => {
                const title = document.querySelector('title')?.innerText || 'No Title';
                const bodyText = document.body.innerText || 'No Content';
                const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'No Description';
                const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || 'No Keywords';
        

                return { title, bodyText , metaDescription, metaKeywords };
            });

            const fileName = `${url.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
            const filePath = path.join(resultsDir, fileName);

            fs.writeFileSync(filePath, JSON.stringify({ url, ...pageData }, null, 2));

            const links = await page.evaluate(() => {
                const anchorTags = Array.from(document.querySelectorAll('a'));
                return anchorTags
                    .map((a) => a.href)
                    .filter(
                        (href) =>
                            href.startsWith('http') &&
                            !href.includes('mailto:') &&
                            !href.includes('#')
                    );
            });

            links.forEach((link) => {
                if (!visitedUrls.has(link) && getCoreDomain(link) === coreDomain) {
                    urlQueue.push(link);
                }
            });

            return pageData;
        } catch (error) {
            console.error(`Failed to scrape ${url}:`, error);
            return null;
        }
    }

    while (urlQueue.length > 0) {
        const nextUrl = urlQueue.shift();
        if (!nextUrl) continue;

        await scrapePage(nextUrl);
    }

    await browser.close();
    console.log('Scraping complete. Data saved in the "public/scrapedData" folder.');
}