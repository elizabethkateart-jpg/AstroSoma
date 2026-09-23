import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto('http://localhost:3000/app/diario', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'docs/revisiones/app-diario-375.png', fullPage: true });

await page.goto('http://localhost:3000/app/diario/nueva', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'docs/revisiones/app-diario-nueva-375.png' });

await browser.close();
console.log('OK');
