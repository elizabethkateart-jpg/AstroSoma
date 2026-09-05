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
await page.screenshot({ path: 'docs/revisiones/onboarding-1-situacion.png' });

await clickText('ruptura');
await waitForButton('Pecho');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-2-zona.png' });

await clickText('Pecho');
await waitForButton('madrugada');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-3-momento.png' });

await clickText('madrugada');
await waitForButton('Continuar');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-4-reconocimiento1.png' });

await clickText('Continuar');
await waitForButton('Dejar de contactar');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-5-meta.png' });

await clickText('Dejar de contactar');
await waitForButton('Continuar');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'docs/revisiones/onboarding-6-reconocimiento2.png' });

await clickText('Continuar');
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'docs/revisiones/onboarding-7-loading.png' });

await new Promise(r => setTimeout(r, 3200));
await page.screenshot({ path: 'docs/revisiones/onboarding-8-resultado.png' });

await browser.close();
console.log('done');
