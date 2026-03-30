const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  // iPhone 14 Pro dimensions
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
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
  await page.screenshot({ path: '/app/phone_ss1_home.png' });
  console.log('SS1 Home done');

  // SS2 — Me/Profile
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.textContent.trim() === 'Me' && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'SPAN')) el.click();
    });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/phone_ss2_profile.png' });
  console.log('SS2 Profile done');

  // SS3 — Post
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.textContent.trim() === 'Post' && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'SPAN')) el.click();
    });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/phone_ss3_post.png' });
  console.log('SS3 Post done');

  // SS4 — Log In modal
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Log In') || b.textContent.includes('Sign')) b.click();
    });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/app/phone_ss4_login.png' });
  console.log('SS4 Login done');

  await browser.close();
  console.log('All done!');
})();
