import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 500));

await page.evaluate(async () => {
  const step = 300;
  const total = document.body.scrollHeight;
  for (let y = 0; y < total; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 400));

const objetivos = [
  { texto: 'Cómo funciona', archivo: 'ornamentos-solucion.png' },
  { texto: 'Garantía', archivo: 'ornamentos-garantia.png', porAria: true },
  { texto: 'Planes y precios', archivo: 'ornamentos-oferta.png', porAria: true },
  { texto: 'Empieza hoy', archivo: 'ornamentos-cta-final.png', porAria: true },
];

for (const o of objetivos) {
  let el = null;
  if (o.porAria) {
    el = await page.$(`[aria-label="${o.texto}"]`);
  }
  if (!el) {
    const secciones = await page.$$('section');
    for (const s of secciones) {
      const aria = await s.evaluate((n) => n.getAttribute('aria-label') || '');
      if (aria === o.texto) { el = s; break; }
    }
  }
  if (!el) { console.log('No encontrado:', o.texto); continue; }
  await el.evaluate((n) => n.scrollIntoView({ block: 'center' }));
  await new Promise((r) => setTimeout(r, 500));
  await el.screenshot({ path: `docs/revisiones/${o.archivo}` });
}

await browser.close();
console.log('OK');
