const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

async function scrapeTwitter(ticker, twitterAccounts, intervalMinutes) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let mentionCount = Array(ticker.length).fill(0);

    for (const account of twitterAccounts) {
        await page.goto(account, { waitUntil: 'networkidle2' });
        const tweets = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('article div[lang]')).map(tweet => tweet.innerText);
        });

        for (let i = 0; i < ticker.length; i++) {
            tweets.forEach(tweet => {
                if (tweet.includes(ticker[i])) {
                    mentionCount[i]++;
                }
            });
        }
    }

    await browser.close();
    for (let i = 0; i < ticker.length; i++) {
        console.log(`'${ticker[i]}' was mentioned '${mentionCount[i]}' times in the last '${intervalMinutes}' minutes.`);
    }
}

const ticker = ['$TSLA', '$SOFI', '$APPL']; // Change this to the ticker you want to search for
const twitterAccounts = [
    'https://twitter.com/Mr_Derivatives',
    'https://twitter.com/warrior_0719',
    'https://twitter.com/ChartingProdigy',
    'https://twitter.com/allstarcharts',
    'https://twitter.com/yuriymatso',
    'https://twitter.com/TriggerTrades',
    'https://twitter.com/AdamMancini4',
    'https://twitter.com/CordovaTrades',
    'https://twitter.com/Barchart',
    'https://twitter.com/RoyLMattox'
]; // Change this to the accounts you want to search for

const intervalMinutes = 15; // Change this to the desired interval

// Run the scraper immediately
scrapeTwitter(ticker, twitterAccounts, intervalMinutes);

// Schedule the scraper to run every X minutes
schedule.scheduleJob(`*/${intervalMinutes} * * * *`, () => scrapeTwitter(ticker, twitterAccounts, intervalMinutes));
