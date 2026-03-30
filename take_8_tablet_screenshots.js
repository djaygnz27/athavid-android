const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 600, height: 1067 }, // exact 9:16
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Nexus 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const snap = async (path) => {
    await page.waitForTimeout(2500);
    await page.screenshot({ path });
    console.log(`Saved: ${path}`);
  };

  // 1 — Home feed
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await snap('/app/t8_1_home.png');

  // 2 — Scroll down on home feed
  await page.evaluate(() => window.scrollBy(0, 500));
  await snap('/app/t8_2_home_scroll.png');

  // 3 — Profile/Me tab
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.textContent.trim() === 'Me' && ['BUTTON','A','SPAN','DIV'].includes(el.tagName)) el.click();
    });
  });
  await snap('/app/t8_3_profile.png');

  // 4 — Post/Upload tab
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.textContent.trim() === 'Post' && ['BUTTON','A','SPAN','DIV'].includes(el.tagName)) el.click();
    });
  });
  await snap('/app/t8_4_post.png');

  // 5 — Explore/Discover tab
  await page.evaluate(() => {
    ['Explore','Discover','Search','🔍'].forEach(kw => {
      document.querySelectorAll('*').forEach(el => {
        if (el.textContent.trim() === kw && ['BUTTON','A','SPAN','DIV'].includes(el.tagName)) el.click();
      });
    });
  });
  await snap('/app/t8_5_explore.png');

  // 6 — Inbox/Notifications tab
  await page.evaluate(() => {
    ['Inbox','Notifications','🔔','Alerts'].forEach(kw => {
      document.querySelectorAll('*').forEach(el => {
        if (el.textContent.trim() === kw && ['BUTTON','A','SPAN','DIV'].includes(el.tagName)) el.click();
      });
    });
  });
  await snap('/app/t8_6_inbox.png');

  // 7 — Login screen
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Log In') || b.textContent.includes('Sign In')) b.click();
    });
  });
  await snap('/app/t8_7_login.png');

  // 8 — Back to home fresh
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollBy(0, 1000));
  await snap('/app/t8_8_home2.png');

  await browser.close();
  console.log('All 8 done!');
})();
