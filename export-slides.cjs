// Exporta cada diapositiva de un pitch HTML como PNG en alta resolución (sin capturas manuales).
// Uso: node export-slides.cjs [archivo.html] [escala]   p. ej. node export-slides.cjs pitch-bachata-studio-1-6.html 3
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const file = path.resolve(process.argv[2] || 'pitch-bachata-studio-1-6.html');
const scale = Number(process.argv[3] || 3); // 3 → 3840×2160 (4K)
const outDir = path.resolve('export', path.basename(file, '.html'));

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: scale });
  await page.goto('file:///' + file.replace(/\\/g, '/'));
  await page.addStyleTag({ content: '.stage{transform:none!important}.nav,.chrome,.rehearsal{display:none!important}*{transition:none!important;animation:none!important}' });
  await page.evaluate(() => document.fonts.ready);

  const total = await page.locator('.slide').count();
  for (let n = 0; n < total; n++) {
    await page.keyboard.press(n === 0 ? 'Home' : 'ArrowRight');
    await page.waitForTimeout(300);
    const out = path.join(outDir, `slide-${String(n + 1).padStart(2, '0')}.png`);
    await page.locator('#stage').screenshot({ path: out });
    console.log('OK', out);
  }
  await browser.close();
})();
