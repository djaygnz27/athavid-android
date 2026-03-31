const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 }, // 8:5
    deviceScaleFactor: 2,
    isMobile: false,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Android XR) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const save = async (path) => {
    await page.waitForTimeout(1800);
    await page.screenshot({ path, fullPage: false });
    console.log('Saved: ' + path);
  };

  // ── SCREEN 1: Immersive Video Feed ──
  await page.goto('https://athavid-vercel.vercel.app', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.body.innerHTML = `
    <div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;display:flex;flex-direction:column;">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:linear-gradient(180deg,rgba(0,0,0,0.9),transparent);position:absolute;top:0;left:0;right:0;z-index:10;">
        <div style="color:#ff6b6b;font-size:26px;font-weight:900;letter-spacing:-1px;">AthaVid</div>
        <div style="display:flex;gap:24px;color:#fff;font-size:14px;">
          <span style="opacity:0.7;">Following</span>
          <span style="font-weight:bold;border-bottom:2px solid #ff6b6b;padding-bottom:2px;">For You</span>
          <span style="opacity:0.7;">Explore</span>
        </div>
        <div style="display:flex;gap:12px;align-items:center;">
          <div style="background:rgba(255,255,255,0.1);border-radius:20px;padding:6px 16px;color:#fff;font-size:13px;">🔍 Search</div>
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#a29bfe);display:flex;align-items:center;justify-content:center;color:#fff;">J</div>
        </div>
      </div>
      <!-- Main video cards -->
      <div style="display:flex;gap:0;height:100%;">
        <!-- Big center video -->
        <div style="flex:2;background:linear-gradient(160deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%);position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(255,107,107,0.3),transparent 60%);"></div>
          <div style="position:absolute;bottom:80px;left:40px;right:100px;color:#fff;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#ee5a24);display:flex;align-items:center;justify-content:center;font-size:18px;">🎵</div>
              <div><div style="font-weight:bold;font-size:15px;">@dancequeen</div><div style="font-size:12px;opacity:0.7;">2.1M followers</div></div>
              <button style="margin-left:12px;background:#ff6b6b;border:none;color:#fff;padding:5px 16px;border-radius:4px;font-size:12px;font-weight:bold;">Follow</button>
            </div>
            <div style="font-size:15px;line-height:1.5;">This transition took me 3 weeks to perfect 😤 so worth it!! #dance #viral #fyp</div>
            <div style="margin-top:8px;font-size:12px;opacity:0.6;">🎵 original sound · dancequeen</div>
          </div>
          <div style="position:absolute;bottom:80px;right:24px;display:flex;flex-direction:column;gap:20px;align-items:center;color:#fff;">
            <div style="text-align:center;"><div style="font-size:28px;">❤️</div><div style="font-size:12px;">24.5K</div></div>
            <div style="text-align:center;"><div style="font-size:28px;">💬</div><div style="font-size:12px;">832</div></div>
            <div style="text-align:center;"><div style="font-size:28px;">↗️</div><div style="font-size:12px;">1.2K</div></div>
            <div style="text-align:center;"><div style="font-size:28px;">🔖</div><div style="font-size:12px;">4.8K</div></div>
          </div>
          <!-- Play button overlay -->
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;">▶️</div>
        </div>
        <!-- Side feed -->
        <div style="flex:1;display:flex;flex-direction:column;gap:4px;padding:4px;background:#111;">
          ${[
            {c:'linear-gradient(135deg,#a29bfe,#6c5ce7)',u:'@foodiepro',cap:'Secret ramen recipe 🍜'},
            {c:'linear-gradient(135deg,#00b894,#00cec9)',u:'@traveler99',cap:'Hidden beach in Bali 🌊'},
            {c:'linear-gradient(135deg,#fdcb6e,#e17055)',u:'@comedy_king',cap:'When Monday hits 😂'},
          ].map(v=>`
            <div style="flex:1;background:${v.c};border-radius:8px;position:relative;overflow:hidden;cursor:pointer;">
              <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.7));"></div>
              <div style="position:absolute;bottom:8px;left:8px;color:#fff;">
                <div style="font-size:11px;font-weight:bold;">${v.u}</div>
                <div style="font-size:10px;opacity:0.8;">${v.cap}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
      <!-- Bottom nav -->
      <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.9);display:flex;justify-content:space-around;padding:12px 0 20px;border-top:1px solid rgba(255,255,255,0.1);">
        <div style="color:#ff6b6b;text-align:center;font-size:11px;"><div style="font-size:22px;">🏠</div>Home</div>
        <div style="color:#777;text-align:center;font-size:11px;"><div style="font-size:22px;">🔍</div>Explore</div>
        <div style="color:#777;text-align:center;font-size:11px;"><div style="font-size:22px;">➕</div>Post</div>
        <div style="color:#777;text-align:center;font-size:11px;"><div style="font-size:22px;">👤</div>Me</div>
      </div>
    </div>`;
  });
  await save('/app/xr_1_feed.png');

  // ── SCREEN 2: Explore / Trending ──
  await page.evaluate(() => {
    document.body.innerHTML = `
    <div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;">
      <div style="padding:20px 32px 12px;display:flex;align-items:center;justify-content:space-between;">
        <div style="color:#ff6b6b;font-size:26px;font-weight:900;">AthaVid</div>
        <div style="background:rgba(255,255,255,0.08);border-radius:24px;padding:10px 24px;color:#aaa;font-size:14px;width:320px;">🔍 Search videos, sounds, users...</div>
        <div style="color:#fff;font-size:13px;opacity:0.6;">🔔 &nbsp; ✉️</div>
      </div>
      <div style="padding:0 32px;">
        <div style="color:#fff;font-size:20px;font-weight:bold;margin-bottom:4px;">🔥 Trending Now</div>
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
          ${['#viral','#dance','#food','#travel','#comedy','#fitness','#music','#pets'].map((tag,i)=>
            `<span style="background:${i===0?'#ff6b6b':'rgba(255,255,255,0.1)'};color:#fff;padding:5px 14px;border-radius:16px;font-size:12px;">${tag}</span>`
          ).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;height:calc(100vh - 180px);">
          ${[
            {c:'linear-gradient(135deg,#ff6b6b,#ee5a24)',u:'@dancequeen',l:'24.5K'},
            {c:'linear-gradient(135deg,#a29bfe,#6c5ce7)',u:'@foodiepro',l:'18.2K'},
            {c:'linear-gradient(135deg,#00b894,#00cec9)',u:'@traveler99',l:'31.7K'},
            {c:'linear-gradient(135deg,#fdcb6e,#e17055)',u:'@comedy_k',l:'9.8K'},
            {c:'linear-gradient(135deg,#fd79a8,#e84393)',u:'@makeup_q',l:'44.1K'},
            {c:'linear-gradient(135deg,#74b9ff,#0984e3)',u:'@skater_x',l:'12.3K'},
            {c:'linear-gradient(135deg,#55efc4,#00b894)',u:'@fitlife',l:'7.6K'},
            {c:'linear-gradient(135deg,#fab1a0,#e17055)',u:'@chefmike',l:'28.9K'},
            {c:'linear-gradient(135deg,#dfe6e9,#636e72)',u:'@cityvibes',l:'5.4K'},
            {c:'linear-gradient(135deg,#6c5ce7,#a29bfe)',u:'@djbeats',l:'16.7K'},
          ].map(v=>`
            <div style="background:${v.c};border-radius:8px;position:relative;overflow:hidden;">
              <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.75));"></div>
              <div style="position:absolute;bottom:8px;left:8px;color:#fff;">
                <div style="font-size:11px;font-weight:bold;">${v.u}</div>
                <div style="font-size:10px;opacity:0.8;">❤️ ${v.l}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
  });
  await save('/app/xr_2_explore.png');

  // ── SCREEN 3: User Profile ──
  await page.evaluate(() => {
    document.body.innerHTML = `
    <div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;">
      <!-- Banner -->
      <div style="height:200px;background:linear-gradient(135deg,#6c5ce7,#a29bfe,#fd79a8);position:relative;">
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.3);"></div>
        <div style="position:absolute;top:16px;left:24px;font-size:22px;font-weight:900;color:#fff;">AthaVid</div>
      </div>
      <!-- Profile info -->
      <div style="padding:0 40px;margin-top:-50px;position:relative;display:flex;gap:32px;align-items:flex-end;">
        <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:4px solid #0a0a0a;display:flex;align-items:center;justify-content:center;font-size:42px;flex-shrink:0;">🎵</div>
        <div style="padding-bottom:8px;">
          <div style="font-size:22px;font-weight:bold;">@dancequeen</div>
          <div style="color:#aaa;font-size:13px;margin-top:2px;">Creating vibes daily ✨ | NJ based | DMs open 💌</div>
          <div style="display:flex;gap:32px;margin-top:12px;">
            <div><span style="font-weight:bold;font-size:16px;">142</span> <span style="color:#aaa;font-size:12px;">Following</span></div>
            <div><span style="font-weight:bold;font-size:16px;">8.4K</span> <span style="color:#aaa;font-size:12px;">Followers</span></div>
            <div><span style="font-weight:bold;font-size:16px;">56.2K</span> <span style="color:#aaa;font-size:12px;">Likes</span></div>
          </div>
        </div>
        <div style="margin-left:auto;padding-bottom:8px;display:flex;gap:10px;">
          <button style="background:#ff6b6b;border:none;color:#fff;padding:10px 28px;border-radius:6px;font-size:14px;font-weight:bold;">Follow</button>
          <button style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:10px 20px;border-radius:6px;font-size:14px;">Message</button>
        </div>
      </div>
      <!-- Videos grid -->
      <div style="padding:20px 40px 0;display:grid;grid-template-columns:repeat(6,1fr);gap:6px;height:calc(100vh - 310px);">
        ${[
          {c:'linear-gradient(135deg,#ff6b6b,#ee5a24)',l:'24.5K'},
          {c:'linear-gradient(135deg,#a29bfe,#6c5ce7)',l:'18.2K'},
          {c:'linear-gradient(135deg,#00b894,#00cec9)',l:'31.7K'},
          {c:'linear-gradient(135deg,#fdcb6e,#e17055)',l:'9.8K'},
          {c:'linear-gradient(135deg,#fd79a8,#e84393)',l:'44.1K'},
          {c:'linear-gradient(135deg,#74b9ff,#0984e3)',l:'12.3K'},
        ].map(v=>`
          <div style="background:${v.c};border-radius:8px;position:relative;overflow:hidden;">
            <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 60%,rgba(0,0,0,0.7));"></div>
            <div style="position:absolute;bottom:6px;left:8px;font-size:11px;color:#fff;">❤️ ${v.l}</div>
          </div>`).join('')}
      </div>
    </div>`;
  });
  await save('/app/xr_3_profile.png');

  // ── SCREEN 4: Upload / Post ──
  await page.evaluate(() => {
    document.body.innerHTML = `
    <div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;">
      <!-- Left: preview -->
      <div style="flex:1;background:linear-gradient(135deg,#1a1a2e,#16213e);display:flex;align-items:center;justify-content:center;position:relative;">
        <div style="width:240px;height:420px;background:linear-gradient(160deg,#fd79a8,#a29bfe);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:64px;box-shadow:0 20px 60px rgba(0,0,0,0.5);">🎬</div>
        <div style="position:absolute;bottom:32px;color:#aaa;font-size:13px;">Preview</div>
      </div>
      <!-- Right: form -->
      <div style="flex:1.2;padding:48px 48px;display:flex;flex-direction:column;gap:20px;overflow-y:auto;">
        <div style="font-size:24px;font-weight:bold;">Upload Video</div>
        <div>
          <div style="font-size:12px;color:#aaa;margin-bottom:6px;">Caption</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:12px;font-size:14px;color:#ddd;">My amazing dance tutorial 🕺 #dance #tutorial #fyp</div>
        </div>
        <div>
          <div style="font-size:12px;color:#aaa;margin-bottom:6px;">Hashtags</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${['#dance','#tutorial','#fyp','#viral'].map(t=>`<span style="background:rgba(255,107,107,0.2);border:1px solid rgba(255,107,107,0.4);color:#ff6b6b;padding:4px 12px;border-radius:16px;font-size:12px;">${t}</span>`).join('')}
          </div>
        </div>
        <div>
          <div style="font-size:12px;color:#aaa;margin-bottom:6px;">Sound</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:12px;font-size:14px;color:#ddd;display:flex;align-items:center;gap:10px;">🎵 <span>Original Sound</span></div>
        </div>
        <div>
          <div style="font-size:12px;color:#aaa;margin-bottom:6px;">Who can watch</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:12px;font-size:14px;color:#ddd;display:flex;justify-content:space-between;align-items:center;">🌍 Everyone <span style="color:#aaa;">▼</span></div>
        </div>
        <div style="display:flex;gap:12px;margin-top:8px;">
          <button style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:14px;border-radius:8px;font-size:15px;">Save Draft</button>
          <button style="flex:1;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:none;color:#fff;padding:14px;border-radius:8px;font-size:15px;font-weight:bold;">Post Now 🚀</button>
        </div>
      </div>
    </div>`;
  });
  await save('/app/xr_4_upload.png');

  await browser.close();
  console.log('All 4 XR screenshots done!');
})();
