import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1700, height: 1200, deviceScaleFactor: 2 });
await page.goto('file://' + process.cwd() + '/vista-previa-app.html', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 500));
const telefonos = await page.$$('.telefono');
const nombres = ['hoy', 'onboarding', 'paywall', 'mecanismo', 'duelo'];
for (let i = 0; i < telefonos.length; i++) {
  await telefonos[i].screenshot({ path: `public/mockups/${nombres[i]}.png` });
}
console.log('frames:', telefonos.length);
await browser.close();
