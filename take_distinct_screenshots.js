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
  await page.waitForTimeout(2500);

  // Dismiss all fixed overlays
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      const s = getComputedStyle(el);
      if (s.position === 'fixed') el.remove();
    });
  });
  await page.waitForTimeout(800);

  // SS1 — Home feed (top)
  await page.screenshot({ path: '/app/new_ss1_home.png' });
  console.log('SS1 home done');

  // SS2 — Me / Profile tab
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('nav button, nav a, [class*="nav"] button, [class*="nav"] a');
    tabs.forEach(t => { if (t.textContent.includes('Me') || t.textContent.includes('👤')) t.click(); });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/new_ss2_profile.png' });
  console.log('SS2 profile done');

  // SS3 — Post / Upload tab
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('nav button, nav a, [class*="nav"] button, [class*="nav"] a');
    tabs.forEach(t => { if (t.textContent.includes('Post') || t.textContent.includes('➕') || t.textContent.includes('+')) t.click(); });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/new_ss3_post.png' });
  console.log('SS3 post done');

  // SS4 — Log In screen
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button, a');
    btns.forEach(b => { if (b.textContent.includes('Log In') || b.textContent.includes('Login') || b.textContent.includes('Sign')) b.click(); });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/new_ss4_login.png' });
  console.log('SS4 login done');

  await browser.close();
})();
