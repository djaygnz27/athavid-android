const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const page = await context.newPage();
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' && (el.textContent.includes('Welcome') || el.textContent.includes('Install AthaVid'))) {
        el.remove();
      }
    });
  });
  await page.waitForTimeout(1000);
  // Scroll down on the feed
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/app/ss4_feed2.png', fullPage: false });
  console.log('Screenshot 4 done');
  await browser.close();
})();
