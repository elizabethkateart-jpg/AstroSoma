import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

await page.goto('http://localhost:3000/entrar', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'docs/revisiones/entrar-1-email.png' });

await page.type('#email-entrar', 'camila@ejemplo.com');
await page.click('button[type="submit"]');
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: 'docs/revisiones/entrar-2-codigo.png' });

await page.goto('http://localhost:3000/entrar/ayuda', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'docs/revisiones/entrar-3-ayuda.png' });

await browser.close();
console.log('OK');
