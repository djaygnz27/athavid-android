const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }, // exact 16:9
    deviceScaleFactor: 2,
    isMobile: false,
    userAgent: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const save = async (path) => {
    await page.waitForTimeout(2000);
    await page.screenshot({ path, fullPage: false });
    console.log('Saved: ' + path);
  };

  // Inject a rich fake feed with colorful video cards
  const injectFeed = async (colors, captions) => {
    await page.evaluate(({ colors, captions }) => {
      // Remove existing feed content and replace with rich cards
      const feed = document.querySelector('#feed-container, [class*="feed"], main, #root > div');
      if (!feed) return;

      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999;display:flex;gap:12px;padding:12px;box-sizing:border-box;overflow:hidden;';

      colors.forEach((color, i) => {
        const card = document.createElement('div');
        card.style.cssText = `flex:1;border-radius:12px;background:${color};position:relative;overflow:hidden;display:flex;align-items:flex-end;`;
        card.innerHTML = `
          <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8));"></div>
          <div style="position:relative;padding:16px;color:#fff;width:100%;">
            <div style="font-size:14px;font-weight:bold;margin-bottom:4px;">@user${i+1}</div>
            <div style="font-size:12px;opacity:0.9;">${captions[i]}</div>
            <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;opacity:0.8;">
              <span>❤️ ${Math.floor(Math.random()*9000+500)}</span>
              <span>💬 ${Math.floor(Math.random()*500+50)}</span>
              <span>↗️ ${Math.floor(Math.random()*300+20)}</span>
            </div>
          </div>
        `;
        container.appendChild(card);
      });

      document.body.appendChild(container);
    }, { colors, captions });
  };

  // 1 — Home feed with colorful video cards
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await injectFeed(
    ['linear-gradient(135deg,#ff6b6b,#ee5a24)', 'linear-gradient(135deg,#a29bfe,#6c5ce7)', 'linear-gradient(135deg,#fd79a8,#e84393)'],
    ['Dance challenge 🔥 #viral', 'Cooking hack you need 🍳 #food', 'Sunset views 🌅 #travel']
  );
  await save('/app/cb2_1_home.png');

  // 2 — Different video cards
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await injectFeed(
    ['linear-gradient(135deg,#00b894,#00cec9)', 'linear-gradient(135deg,#fdcb6e,#e17055)', 'linear-gradient(135deg,#74b9ff,#0984e3)'],
    ['Morning routine 🌞 #lifestyle', 'Street food tour 🍜 #foodie', 'City skateboarding 🛹 #skate']
  );
  await save('/app/cb2_2_home2.png');

  // 3 — Single video fullscreen style
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#2d3436,#6c5ce7);z-index:9999;display:flex;align-items:center;justify-content:center;';
    container.innerHTML = `
      <div style="width:360px;height:640px;border-radius:20px;background:linear-gradient(180deg,#ff6b6b 0%,#ee5a24 100%);position:relative;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
        <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.85));"></div>
        <div style="position:absolute;bottom:24px;left:16px;right:60px;color:#fff;">
          <div style="font-weight:bold;font-size:15px;">@dancequeen</div>
          <div style="font-size:13px;margin-top:4px;opacity:0.9;">This transition took me 3 weeks 😤 #dance #viral</div>
          <div style="margin-top:8px;font-size:12px;opacity:0.7;">🎵 original sound - dancequeen</div>
        </div>
        <div style="position:absolute;bottom:24px;right:16px;color:#fff;display:flex;flex-direction:column;gap:20px;align-items:center;">
          <div style="text-align:center;"><div style="font-size:26px;">❤️</div><div style="font-size:11px;">24.5K</div></div>
          <div style="text-align:center;"><div style="font-size:26px;">💬</div><div style="font-size:11px;">832</div></div>
          <div style="text-align:center;"><div style="font-size:26px;">↗️</div><div style="font-size:11px;">1.2K</div></div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  });
  await save('/app/cb2_3_video.png');

  // 4 — Profile page with stats
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Me') || b.textContent.includes('👤')) b.click();
    });
  });
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#111;z-index:9999;color:#fff;font-family:sans-serif;overflow:hidden;';
    container.innerHTML = `
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:30px;">
          <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#fd79a8,#e84393);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:40px;">🎵</div>
          <div style="font-size:22px;font-weight:bold;">@athavid_user</div>
          <div style="color:#aaa;margin-top:4px;font-size:14px;">Creating vibes daily ✨</div>
          <div style="display:flex;justify-content:center;gap:40px;margin-top:20px;">
            <div style="text-align:center;"><div style="font-size:20px;font-weight:bold;">142</div><div style="font-size:12px;color:#aaa;">Following</div></div>
            <div style="text-align:center;"><div style="font-size:20px;font-weight:bold;">8.4K</div><div style="font-size:12px;color:#aaa;">Followers</div></div>
            <div style="text-align:center;"><div style="font-size:20px;font-weight:bold;">56.2K</div><div style="font-size:12px;color:#aaa;">Likes</div></div>
          </div>
          <button style="margin-top:20px;background:#ff6b6b;border:none;color:#fff;padding:10px 40px;border-radius:6px;font-size:14px;font-weight:bold;">Edit Profile</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;">
          ${['#ff6b6b','#a29bfe','#00b894','#fdcb6e','#74b9ff','#fd79a8'].map((c,i) => 
            `<div style="aspect-ratio:9/16;background:linear-gradient(135deg,${c},#000);border-radius:4px;display:flex;align-items:flex-end;padding:8px;">
              <span style="font-size:11px;color:#fff;opacity:0.8;">❤️ ${Math.floor(Math.random()*9000+500)}</span>
            </div>`
          ).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(container);
  });
  await save('/app/cb2_4_profile.png');

  // 5 — Login modal
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Log In') || b.textContent.includes('Login') || b.textContent.includes('Sign In')) b.click();
    });
  });
  await page.waitForTimeout(1500);
  await save('/app/cb2_5_login.png');

  // 6 — Sign Up modal
  await page.evaluate(() => {
    document.querySelectorAll('button, span, a').forEach(b => {
      if (b.textContent.trim() === 'Sign Up' || b.textContent.includes('Create account')) b.click();
    });
  });
  await page.waitForTimeout(1000);
  await save('/app/cb2_6_signup.png');

  // 7 — Upload/Post modal
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Post') || b.textContent.includes('➕')) b.click();
    });
  });
  await page.waitForTimeout(1000);
  await save('/app/cb2_7_post.png');

  // 8 — Explore/trending with colorful grid
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#111;z-index:9999;color:#fff;font-family:sans-serif;padding:20px;box-sizing:border-box;';
    container.innerHTML = `
      <div style="font-size:22px;font-weight:bold;margin-bottom:6px;">🔥 Trending Now</div>
      <div style="color:#aaa;font-size:13px;margin-bottom:16px;">#viral #dance #food #travel #comedy</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
        ${['#ff6b6b','#a29bfe','#00b894','#fdcb6e','#74b9ff','#fd79a8','#e17055','#00cec9',
           'linear-gradient(135deg,#ff6b6b,#ee5a24)','linear-gradient(135deg,#a29bfe,#6c5ce7)',
           'linear-gradient(135deg,#00b894,#00cec9)','linear-gradient(135deg,#fdcb6e,#e17055)'].map((c,i) => 
          `<div style="aspect-ratio:9/16;background:${c};border-radius:6px;display:flex;flex-direction:column;justify-content:flex-end;padding:8px;position:relative;">
            <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.7));border-radius:6px;"></div>
            <div style="position:relative;font-size:10px;color:#fff;">
              <div>@creator${i+1}</div>
              <div style="opacity:0.7;">❤️ ${(Math.random()*50+5).toFixed(1)}K</div>
            </div>
          </div>`
        ).join('')}
      </div>
    `;
    document.body.appendChild(container);
  });
  await save('/app/cb2_8_trending.png');

  await browser.close();
  console.log('All 8 done!');
})();
