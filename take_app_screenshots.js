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
  
  // Dismiss popup via JS
  await page.evaluate(() => {
    // Find and click "Maybe later" or remove all modals
    const allDivs = document.querySelectorAll('div');
    for (const div of allDivs) {
      if (div.style.position === 'fixed' || getComputedStyle(div).position === 'fixed') {
        if (div.textContent.includes('Welcome') || div.textContent.includes('Maybe later')) {
          div.remove();
        }
      }
    }
    // Also remove install banner
    const banners = document.querySelectorAll('[class*="fixed"]');
    banners.forEach(b => {
      if (b.textContent.includes('Install')) b.remove();
    });
  });
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/app/ss1_home.png', fullPage: false });
  console.log('Screenshot 1 done');
  
  // Click Me tab
  const meTab = await page.$('text=Me');
  if (meTab) {
    await meTab.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: '/app/ss2_profile.png', fullPage: false });
  console.log('Screenshot 2 done');
  
  // Click Post tab
  const postTab = await page.$('text=Post');
  if (postTab) {
    await postTab.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: '/app/ss3_post.png', fullPage: false });
  console.log('Screenshot 3 done');
  
  // Go back home and scroll
  const homeTab = await page.$('text=Home');
  if (homeTab) {
    await homeTab.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: '/app/ss4_home2.png', fullPage: false });
  console.log('Screenshot 4 done');
  
  await browser.close();
})();
