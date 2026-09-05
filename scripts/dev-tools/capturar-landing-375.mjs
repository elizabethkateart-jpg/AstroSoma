import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 500));
// Forzar carga de imágenes lazy (el carrusel horizontal no las trae con un scroll vertical)
await page.evaluate(async () => {
  const imgs = Array.from(document.querySelectorAll('img'));
  imgs.forEach((img) => { img.loading = 'eager'; });
  await Promise.all(imgs.map((img) => img.complete ? Promise.resolve() : new Promise((res) => { img.onload = res; img.onerror = res; })));
});
await page.evaluate(async () => {
  const step = 400;
  const total = document.body.scrollHeight;
  for (let y = 0; y < total; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 500));
const imgs = await page.evaluate(() => Array.from(document.querySelectorAll('img')).map(i => ({src: i.src, naturalWidth: i.naturalWidth})));
console.log('IMGs:', JSON.stringify(imgs));
await page.screenshot({ path: 'docs/revisiones/landing-375.png', fullPage: true });
await browser.close();
