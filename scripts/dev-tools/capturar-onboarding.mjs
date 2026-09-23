import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto('http://localhost:3000/onboarding', { waitUntil: 'networkidle0' });

async function waitForButton(txt, timeout = 4000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const found = await page.evaluate((t) => {
      return Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes(t));
    }, txt);
    if (found) return true;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('timeout waiting for button: ' + txt);
}

async function clickText(txt) {
  await waitForButton(txt);
  await page.evaluate((t) => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes(t));
    btn.click();
  }, txt);
}

await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'docs/revisiones/onboarding-01-frecuencia.png' });

await clickText('a diario');
await waitForButton('ruptura');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-02-situacion.png' });

await clickText('ruptura');
await waitForButton('Pecho');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-03-zona.png' });

await clickText('Pecho');
await waitForButton('madrugada');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-04-momento.png' });

await clickText('madrugada');
await waitForButton('probé otras');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-05-experiencia.png' });

await clickText('probé otras');
await waitForButton('Continuar');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-06-reconocimiento1.png' });

await clickText('Continuar');
await waitForButton('Dejar de contactar');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-07-meta.png' });

await clickText('Dejar de contactar');
await waitForButton('Continuar');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-08-reconocimiento2.png' });

await clickText('Continuar');
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'docs/revisiones/onboarding-09-loading.png' });

await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: 'docs/revisiones/onboarding-10-resultado.png' });

await browser.close();
console.log('done');
