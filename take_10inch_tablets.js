const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 800, height: 1280 }, // exact 10:16 = 5:8, close to 9:16
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel Tablet) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const save = async (path) => {
    await page.waitForTimeout(2500);
    await page.screenshot({ path, fullPage: false });
    console.log('Saved: ' + path);
  };

  // 1 — Home feed top
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await save('/app/t10_1_home_top.png');

  // 2 — Scroll mid
  await page.mouse.wheel(0, 500);
  await save('/app/t10_2_home_mid.png');

  // 3 — Scroll further
  await page.mouse.wheel(0, 1000);
  await save('/app/t10_3_home_bottom.png');

  // 4 — Profile/Me tab
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Me') || b.textContent.includes('👤')) b.click();
    });
  });
  await save('/app/t10_4_profile.png');

  // 5 — Login modal
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Log In') || b.textContent.includes('Login') || b.textContent.includes('Sign In')) b.click();
    });
  });
  await save('/app/t10_5_login.png');

  // 6 — Sign Up modal
  await page.evaluate(() => {
    document.querySelectorAll('button, span, a').forEach(b => {
      if (b.textContent.includes('Sign Up') || b.textContent.includes('Register') || b.textContent.includes('Create')) b.click();
    });
  });
  await save('/app/t10_6_signup.png');

  // 7 — Post/Upload
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Post') || b.textContent.includes('➕')) b.click();
    });
  });
  await save('/app/t10_7_post.png');

  // 8 — Install tab
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Install') || b.textContent.includes('📲')) b.click();
    });
  });
  await save('/app/t10_8_install.png');

  await browser.close();
  console.log('All 8 done!');
})();
