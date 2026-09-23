import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 500));

const hero = await page.$('#hero');
await hero.screenshot({ path: 'docs/revisiones/ornamentos-hero.png' });

// Scroll gradual para disparar whileInView de framer-motion (igual que el script de landing completo)
await page.evaluate(async () => {
  const step = 300;
  const total = document.body.scrollHeight;
  for (let y = 0; y < total; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
});
await new Promise((r) => setTimeout(r, 500));

const secciones = await page.$$('section');
let contraste = null;
for (const s of secciones) {
  const texto = await s.evaluate((el) => el.textContent || '');
  if (texto.includes('Mismo tránsito, otro tono')) { contraste = s; break; }
}
if (contraste) {
  await contraste.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await new Promise((r) => setTimeout(r, 600));
  await contraste.screenshot({ path: 'docs/revisiones/ornamentos-contraste.png' });
} else {
  console.log('No se encontró la sección "La diferencia"');
}

await browser.close();
console.log('OK');
