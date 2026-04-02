const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const screens = [
    { url: 'https://sachistream.com', name: 'home', wait: 3000 },
    { url: 'https://sachistream.com/#explore', name: 'explore', wait: 3000 },
    { url: 'https://sachistream.com/#profile', name: 'profile', wait: 3000 },
  ];

  for (const s of screens) {
    await page.goto(s.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(s.wait);
    await page.screenshot({ path: `/app/real_${s.name}.png`, fullPage: false });
    console.log(`Captured ${s.name}`);
  }

  await browser.close();
})();
