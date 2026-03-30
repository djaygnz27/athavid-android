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

  // --- SS1: Home Feed ---
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (getComputedStyle(el).position === 'fixed') el.remove();
    });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/app/good_ss1_home.png', clip: { x: 0, y: 0, width: 780, height: 780 } });
  console.log('SS1 home done');

  // --- SS2: Profile/Me tab ---
  await page.evaluate(() => {
    document.querySelectorAll('nav button, nav a, [class*="tab"] button, [class*="bottom"] button').forEach(t => {
      if (t.textContent.trim().includes('Me')) t.click();
    });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/good_ss2_profile.png', clip: { x: 0, y: 0, width: 780, height: 780 } });
  console.log('SS2 profile done');

  // --- SS3: Post/Upload tab ---
  await page.evaluate(() => {
    document.querySelectorAll('nav button, nav a, [class*="tab"] button, [class*="bottom"] button').forEach(t => {
      if (t.textContent.trim().includes('Post') || t.innerHTML.includes('➕') || t.innerHTML.includes('+')) t.click();
    });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/good_ss3_post.png', clip: { x: 0, y: 0, width: 780, height: 780 } });
  console.log('SS3 post done');

  // --- SS4: Log In ---
  await page.evaluate(() => {
    document.querySelectorAll('button, a').forEach(b => {
      if (b.textContent.includes('Log In') || b.textContent.includes('Sign In') || b.textContent.includes('Login')) b.click();
    });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/good_ss4_login.png', clip: { x: 0, y: 0, width: 780, height: 780 } });
  console.log('SS4 login done');

  await browser.close();
})();
