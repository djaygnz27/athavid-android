const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  // Phone dimensions: 1080x1920
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2.77 });

  // Screenshot 1: Welcome/Home screen
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: '/app/sachi_ss1_welcome.png', fullPage: false });
  console.log('✅ SS1: Welcome screen');

  // Dismiss welcome popup
  try {
    await page.click('button.btn-welcome-skip, button[onclick*="dismissWelcome"]');
    await new Promise(r => setTimeout(r, 1000));
  } catch(e) {
    // try clicking "Maybe later"
    const btns = await page.$$('button');
    for (const btn of btns) {
      const txt = await btn.evaluate(el => el.textContent);
      if (txt.includes('later') || txt.includes('browse')) { await btn.click(); break; }
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // Screenshot 2: Feed / Home
  await page.screenshot({ path: '/app/sachi_ss2_feed.png', fullPage: false });
  console.log('✅ SS2: Feed screen');

  // Screenshot 3: Login modal
  try {
    const btns = await page.$$('button');
    for (const btn of btns) {
      const txt = await btn.evaluate(el => el.textContent);
      if (txt.includes('Log in') || txt.includes('Log In')) { await btn.click(); break; }
    }
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: '/app/sachi_ss3_login.png', fullPage: false });
    console.log('✅ SS3: Login screen');
    // Close modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));
  } catch(e) { console.log('SS3 skipped:', e.message); }

  // Screenshot 4: Upload tab
  try {
    // Click Post button in nav
    const navBtns = await page.$$('button');
    for (const btn of navBtns) {
      const txt = await btn.evaluate(el => el.textContent);
      if (txt.includes('Post')) { await btn.click(); break; }
    }
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: '/app/sachi_ss4_upload.png', fullPage: false });
    console.log('✅ SS4: Upload screen');
    await page.keyboard.press('Escape');
  } catch(e) { console.log('SS4 skipped:', e.message); }

  await browser.close();
  console.log('Done!');
})();
