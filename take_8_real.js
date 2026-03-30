const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 540, height: 960 }, // exact 9:16
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Nexus 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const save = async (path) => {
    await page.waitForTimeout(2000);
    await page.screenshot({ path, fullPage: false });
    console.log('Saved: ' + path);
  };

  // 1 — Home feed top
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await save('/app/r_1_home_top.png');

  // 2 — Scroll down a bit on feed
  await page.mouse.wheel(0, 400);
  await save('/app/r_2_home_mid.png');

  // 3 — Scroll further
  await page.mouse.wheel(0, 800);
  await save('/app/r_3_home_bottom.png');

  // 4 — Me / Profile tab
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Me') || b.textContent.includes('👤')) b.click();
    });
  });
  await save('/app/r_4_profile.png');

  // 5 — Login modal (click Log In button)
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Log In') || b.textContent.includes('Login') || b.textContent.includes('Sign In')) b.click();
    });
  });
  await save('/app/r_5_login_modal.png');

  // 6 — Sign Up modal (switch to sign up)
  await page.evaluate(() => {
    document.querySelectorAll('button, span, a').forEach(b => {
      if (b.textContent.includes('Sign Up') || b.textContent.includes('Register') || b.textContent.includes('Create')) b.click();
    });
  });
  await save('/app/r_6_signup_modal.png');

  // 7 — Post/Upload tab (shows upload UI or prompts login)
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Post') || b.textContent.includes('➕')) b.click();
    });
  });
  await save('/app/r_7_post.png');

  // 8 — Install tab
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Install') || b.textContent.includes('📲')) b.click();
    });
  });
  await save('/app/r_8_install.png');

  await browser.close();
  console.log('All 8 done!');
})();
