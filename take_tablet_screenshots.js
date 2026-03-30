const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  // 7-inch tablet dimensions (Nexus 7 style)
  const context = await browser.newContext({
    viewport: { width: 600, height: 1024 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Nexus 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  // SS1 — Home Feed
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (getComputedStyle(el).position === 'fixed') el.remove();
    });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/app/tab_ss1_home.png' });
  console.log('Tab SS1 Home done');

  // SS2 — Profile/Me
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.textContent.trim() === 'Me' && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'SPAN')) el.click();
    });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/tab_ss2_profile.png' });
  console.log('Tab SS2 Profile done');

  // SS3 — Post/Upload
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.textContent.trim() === 'Post' && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'SPAN')) el.click();
    });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/tab_ss3_post.png' });
  console.log('Tab SS3 Post done');

  // SS4 — Login
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Log In') || b.textContent.includes('Sign')) b.click();
    });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/tab_ss4_login.png' });
  console.log('Tab SS4 Login done');

  await browser.close();
  console.log('All tablet screenshots done!');
})();
