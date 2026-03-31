const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  // 16:9 landscape at 1920x1080 — well within 720-7680px both sides
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    isMobile: false,
  });
  const page = await context.newPage();

  const save = async (path) => {
    await page.waitForTimeout(800);
    await page.screenshot({ path, fullPage: false });
    console.log('Saved: ' + path);
  };

  // ── SCREEN 1: Immersive Video Feed ──
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;">
  <div style="width:1920px;height:1080px;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;display:flex;flex-direction:column;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 40px;background:rgba(0,0,0,0.85);border-bottom:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;font-size:28px;font-weight:900;letter-spacing:-1px;">AthaVid</div>
      <div style="display:flex;gap:28px;color:#fff;font-size:15px;">
        <span style="opacity:0.6;">Following</span>
        <span style="font-weight:bold;border-bottom:2px solid #ff6b6b;padding-bottom:3px;">For You</span>
        <span style="opacity:0.6;">Explore</span>
      </div>
      <div style="display:flex;gap:14px;align-items:center;">
        <div style="background:rgba(255,255,255,0.1);border-radius:24px;padding:8px 20px;color:#aaa;font-size:13px;">🔍 Search</div>
        <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#a29bfe);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;">J</div>
      </div>
    </div>
    <div style="display:flex;flex:1;gap:4px;padding:4px;overflow:hidden;">
      <div style="flex:2.2;background:linear-gradient(160deg,#1a1a2e,#0f3460);position:relative;border-radius:8px;overflow:hidden;">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(255,107,107,0.3),transparent 60%);"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;">▶️</div>
        <div style="position:absolute;bottom:70px;left:40px;right:100px;color:#fff;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#ee5a24);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🎵</div>
            <div><div style="font-weight:bold;font-size:16px;">@dancequeen</div><div style="font-size:13px;opacity:0.6;">2.1M followers</div></div>
            <button style="margin-left:10px;background:#ff6b6b;border:none;color:#fff;padding:6px 18px;border-radius:5px;font-size:13px;font-weight:bold;">Follow</button>
          </div>
          <div style="font-size:15px;line-height:1.6;">This transition took me 3 weeks to perfect 😤 #dance #viral #fyp</div>
          <div style="margin-top:8px;font-size:12px;opacity:0.5;">🎵 original sound · dancequeen</div>
        </div>
        <div style="position:absolute;bottom:70px;right:28px;display:flex;flex-direction:column;gap:22px;align-items:center;color:#fff;">
          <div style="text-align:center;"><div style="font-size:28px;">❤️</div><div style="font-size:12px;">24.5K</div></div>
          <div style="text-align:center;"><div style="font-size:28px;">💬</div><div style="font-size:12px;">832</div></div>
          <div style="text-align:center;"><div style="font-size:28px;">↗️</div><div style="font-size:12px;">1.2K</div></div>
          <div style="text-align:center;"><div style="font-size:28px;">🔖</div><div style="font-size:12px;">4.8K</div></div>
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
        ${[
          {c:'linear-gradient(135deg,#a29bfe,#6c5ce7)',u:'@foodiepro',cap:'Secret ramen recipe 🍜'},
          {c:'linear-gradient(135deg,#00b894,#00cec9)',u:'@traveler99',cap:'Hidden beach in Bali 🌊'},
          {c:'linear-gradient(135deg,#fdcb6e,#e17055)',u:'@comedy_king',cap:'When Monday hits 😂'},
        ].map(v=>`
          <div style="flex:1;background:${v.c};border-radius:8px;position:relative;overflow:hidden;">
            <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.75));"></div>
            <div style="position:absolute;bottom:10px;left:12px;color:#fff;">
              <div style="font-size:13px;font-weight:bold;">${v.u}</div>
              <div style="font-size:11px;opacity:0.8;">${v.cap}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div style="background:rgba(0,0,0,0.9);display:flex;justify-content:space-around;padding:10px 0 14px;border-top:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;text-align:center;font-size:11px;"><div style="font-size:22px;">🏠</div>Home</div>
      <div style="color:#555;text-align:center;font-size:11px;"><div style="font-size:22px;">🔍</div>Explore</div>
      <div style="color:#555;text-align:center;font-size:11px;"><div style="font-size:22px;">➕</div>Post</div>
      <div style="color:#555;text-align:center;font-size:11px;"><div style="font-size:22px;">👤</div>Me</div>
    </div>
  </div>
  </body></html>`);
  await save('/app/xr2_1_feed.png');

  // ── SCREEN 2: Explore/Trending ──
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;">
  <div style="width:1920px;height:1080px;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;">
    <div style="padding:18px 40px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;font-size:28px;font-weight:900;">AthaVid</div>
      <div style="background:rgba(255,255,255,0.08);border-radius:24px;padding:10px 28px;color:#aaa;font-size:14px;width:360px;">🔍 Search videos, sounds, users...</div>
      <div style="font-size:22px;opacity:0.6;">🔔 &nbsp; ✉️</div>
    </div>
    <div style="padding:16px 40px 0;">
      <div style="font-size:22px;font-weight:bold;margin-bottom:8px;">🔥 Trending Now</div>
      <div style="display:flex;gap:10px;margin-bottom:16px;">
        ${['#viral','#dance','#food','#travel','#comedy','#fitness','#music','#pets'].map((t,i)=>
          `<span style="background:${i===0?'#ff6b6b':'rgba(255,255,255,0.1)'};color:#fff;padding:6px 16px;border-radius:20px;font-size:13px;">${t}</span>`
        ).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:8px;height:calc(1080px - 180px);">
        ${[
          {c:'linear-gradient(135deg,#ff6b6b,#ee5a24)',u:'@dancequeen',l:'24.5K'},
          {c:'linear-gradient(135deg,#a29bfe,#6c5ce7)',u:'@foodiepro',l:'18.2K'},
          {c:'linear-gradient(135deg,#00b894,#00cec9)',u:'@traveler99',l:'31.7K'},
          {c:'linear-gradient(135deg,#fdcb6e,#e17055)',u:'@comedy_k',l:'9.8K'},
          {c:'linear-gradient(135deg,#fd79a8,#e84393)',u:'@makeup_q',l:'44.1K'},
          {c:'linear-gradient(135deg,#74b9ff,#0984e3)',u:'@skater_x',l:'12.3K'},
          {c:'linear-gradient(135deg,#55efc4,#00b894)',u:'@fitlife',l:'7.6K'},
          {c:'linear-gradient(135deg,#fab1a0,#e17055)',u:'@chefmike',l:'28.9K'},
        ].map(v=>`
          <div style="background:${v.c};border-radius:10px;position:relative;overflow:hidden;">
            <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.75));"></div>
            <div style="position:absolute;bottom:10px;left:10px;color:#fff;">
              <div style="font-size:12px;font-weight:bold;">${v.u}</div>
              <div style="font-size:11px;opacity:0.8;">❤️ ${v.l}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>
  </body></html>`);
  await save('/app/xr2_2_explore.png');

  // ── SCREEN 3: User Profile ──
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;">
  <div style="width:1920px;height:1080px;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;">
    <div style="height:200px;background:linear-gradient(135deg,#6c5ce7,#a29bfe,#fd79a8);position:relative;">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.25);"></div>
      <div style="position:absolute;top:18px;left:28px;font-size:26px;font-weight:900;">AthaVid</div>
    </div>
    <div style="padding:0 48px;margin-top:-50px;position:relative;display:flex;gap:32px;align-items:flex-end;">
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
    <div style="padding:20px 48px 0;display:grid;grid-template-columns:repeat(8,1fr);gap:6px;height:calc(1080px - 320px);">
      ${[
        {c:'linear-gradient(135deg,#ff6b6b,#ee5a24)',l:'24.5K'},
        {c:'linear-gradient(135deg,#a29bfe,#6c5ce7)',l:'18.2K'},
        {c:'linear-gradient(135deg,#00b894,#00cec9)',l:'31.7K'},
        {c:'linear-gradient(135deg,#fdcb6e,#e17055)',l:'9.8K'},
        {c:'linear-gradient(135deg,#fd79a8,#e84393)',l:'44.1K'},
        {c:'linear-gradient(135deg,#74b9ff,#0984e3)',l:'12.3K'},
        {c:'linear-gradient(135deg,#55efc4,#00b894)',l:'7.6K'},
        {c:'linear-gradient(135deg,#fab1a0,#e17055)',l:'28.9K'},
      ].map(v=>`
        <div style="background:${v.c};border-radius:8px;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 60%,rgba(0,0,0,0.7));"></div>
          <div style="position:absolute;bottom:8px;left:10px;font-size:12px;color:#fff;">❤️ ${v.l}</div>
        </div>`).join('')}
    </div>
  </div>
  </body></html>`);
  await save('/app/xr2_3_profile.png');

  // ── SCREEN 4: Upload/Post ──
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;">
  <div style="width:1920px;height:1080px;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;">
    <div style="flex:1;background:linear-gradient(135deg,#1a1a2e,#16213e);display:flex;align-items:center;justify-content:center;position:relative;">
      <div style="width:260px;height:460px;background:linear-gradient(160deg,#fd79a8,#a29bfe);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:72px;box-shadow:0 24px 64px rgba(0,0,0,0.6);">🎬</div>
      <div style="position:absolute;bottom:32px;color:#555;font-size:14px;">Video Preview</div>
    </div>
    <div style="flex:1.3;padding:52px;display:flex;flex-direction:column;gap:22px;background:#111;">
      <div style="font-size:26px;font-weight:bold;">Upload Your Video</div>
      <div>
        <div style="font-size:13px;color:#aaa;margin-bottom:8px;">Caption</div>
        <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:14px;font-size:15px;color:#ddd;line-height:1.5;">My amazing dance tutorial 🕺 #dance #tutorial #fyp</div>
      </div>
      <div>
        <div style="font-size:13px;color:#aaa;margin-bottom:8px;">Hashtags</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          ${['#dance','#tutorial','#fyp','#viral','#trending'].map(t=>`<span style="background:rgba(255,107,107,0.15);border:1px solid rgba(255,107,107,0.4);color:#ff6b6b;padding:6px 14px;border-radius:20px;font-size:13px;">${t}</span>`).join('')}
        </div>
      </div>
      <div>
        <div style="font-size:13px;color:#aaa;margin-bottom:8px;">Sound</div>
        <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:14px;font-size:15px;color:#ddd;display:flex;align-items:center;gap:12px;">🎵 <span>Original Sound — dancequeen</span></div>
      </div>
      <div>
        <div style="font-size:13px;color:#aaa;margin-bottom:8px;">Who can watch</div>
        <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:14px;font-size:15px;color:#ddd;display:flex;justify-content:space-between;align-items:center;">🌍 Everyone <span style="color:#aaa;font-size:12px;">▼</span></div>
      </div>
      <div style="display:flex;gap:14px;margin-top:6px;">
        <button style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#fff;padding:16px;border-radius:10px;font-size:15px;">Save Draft</button>
        <button style="flex:1;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:none;color:#fff;padding:16px;border-radius:10px;font-size:16px;font-weight:bold;">Post Now 🚀</button>
      </div>
    </div>
  </div>
  </body></html>`);
  await save('/app/xr2_4_upload.png');

  await browser.close();
  console.log('All 4 XR v2 done!');
})();
