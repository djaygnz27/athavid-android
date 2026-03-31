const { chromium } = require('playwright');

const SCREENS = [
  // ── PHONE: 1080x1920 (9:16) ──
  { file: 'ph_1_feed.png',    vw: 390, vh: 844,  dpr: 2.77 },
  { file: 'ph_2_explore.png', vw: 390, vh: 844,  dpr: 2.77 },
  { file: 'ph_3_profile.png', vw: 390, vh: 844,  dpr: 2.77 },
  { file: 'ph_4_upload.png',  vw: 390, vh: 844,  dpr: 2.77 },
  { file: 'ph_5_login.png',   vw: 390, vh: 844,  dpr: 2.77 },
  { file: 'ph_6_signup.png',  vw: 390, vh: 844,  dpr: 2.77 },
  { file: 'ph_7_trending.png',vw: 390, vh: 844,  dpr: 2.77 },
  { file: 'ph_8_comments.png',vw: 390, vh: 844,  dpr: 2.77 },
  // ── 7-INCH TABLET: 1200x1920 ──
  { file: 't7_1_feed.png',    vw: 600, vh: 960,  dpr: 2 },
  { file: 't7_2_explore.png', vw: 600, vh: 960,  dpr: 2 },
  { file: 't7_3_profile.png', vw: 600, vh: 960,  dpr: 2 },
  { file: 't7_4_upload.png',  vw: 600, vh: 960,  dpr: 2 },
  { file: 't7_5_login.png',   vw: 600, vh: 960,  dpr: 2 },
  { file: 't7_6_signup.png',  vw: 600, vh: 960,  dpr: 2 },
  { file: 't7_7_trending.png',vw: 600, vh: 960,  dpr: 2 },
  { file: 't7_8_comments.png',vw: 600, vh: 960,  dpr: 2 },
  // ── 10-INCH TABLET: 1600x2560 ──
  { file: 't10_new_1_feed.png',    vw: 800, vh: 1280, dpr: 2 },
  { file: 't10_new_2_explore.png', vw: 800, vh: 1280, dpr: 2 },
  { file: 't10_new_3_profile.png', vw: 800, vh: 1280, dpr: 2 },
  { file: 't10_new_4_upload.png',  vw: 800, vh: 1280, dpr: 2 },
  { file: 't10_new_5_login.png',   vw: 800, vh: 1280, dpr: 2 },
  { file: 't10_new_6_signup.png',  vw: 800, vh: 1280, dpr: 2 },
  { file: 't10_new_7_trending.png',vw: 800, vh: 1280, dpr: 2 },
  { file: 't10_new_8_comments.png',vw: 800, vh: 1280, dpr: 2 },
];

const HTMLS = [
  // 1 - Feed
  (wide) => `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;display:flex;flex-direction:column;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 20px;background:rgba(0,0,0,0.9);border-bottom:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;font-size:22px;font-weight:900;">AthaVid</div>
      <div style="display:flex;gap:20px;color:#fff;font-size:13px;">
        <span style="opacity:0.6;">Following</span><span style="font-weight:bold;border-bottom:2px solid #ff6b6b;padding-bottom:2px;">For You</span>
      </div>
      <div style="font-size:18px;opacity:0.6;">🔍</div>
    </div>
    <div style="flex:1;background:linear-gradient(160deg,#1a1a2e,#0f3460);position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(255,107,107,0.3),transparent 60%);"></div>
      <div style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);font-size:56px;">▶️</div>
      <div style="position:absolute;bottom:80px;left:16px;right:60px;color:#fff;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#ee5a24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🎵</div>
          <div><div style="font-weight:bold;font-size:14px;">@dancequeen</div><div style="font-size:11px;opacity:0.6;">2.1M followers</div></div>
          <button style="margin-left:6px;background:#ff6b6b;border:none;color:#fff;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:bold;">Follow</button>
        </div>
        <div style="font-size:13px;line-height:1.5;">This transition took me 3 weeks 😤 #dance #viral #fyp</div>
        <div style="margin-top:6px;font-size:11px;opacity:0.5;">🎵 original sound</div>
      </div>
      <div style="position:absolute;bottom:80px;right:12px;display:flex;flex-direction:column;gap:18px;align-items:center;color:#fff;">
        <div style="text-align:center;"><div style="font-size:26px;">❤️</div><div style="font-size:11px;">24.5K</div></div>
        <div style="text-align:center;"><div style="font-size:26px;">💬</div><div style="font-size:11px;">832</div></div>
        <div style="text-align:center;"><div style="font-size:26px;">↗️</div><div style="font-size:11px;">1.2K</div></div>
      </div>
    </div>
    <div style="background:rgba(0,0,0,0.95);display:flex;justify-content:space-around;padding:10px 0 16px;border-top:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;text-align:center;font-size:10px;"><div style="font-size:22px;">🏠</div>Home</div>
      <div style="color:#555;text-align:center;font-size:10px;"><div style="font-size:22px;">🔍</div>Explore</div>
      <div style="color:#555;text-align:center;font-size:10px;"><div style="font-size:22px;">➕</div>Post</div>
      <div style="color:#555;text-align:center;font-size:10px;"><div style="font-size:22px;">👤</div>Me</div>
    </div>
  </div>`,

  // 2 - Explore
  (wide) => `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;">
    <div style="padding:14px 16px 10px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;font-size:20px;font-weight:900;">AthaVid</div>
      <div style="flex:1;background:rgba(255,255,255,0.08);border-radius:20px;padding:8px 16px;color:#aaa;font-size:12px;">🔍 Search videos, sounds...</div>
    </div>
    <div style="padding:12px 14px 0;">
      <div style="font-size:17px;font-weight:bold;margin-bottom:8px;">🔥 Trending</div>
      <div style="display:flex;gap:6px;margin-bottom:12px;overflow:hidden;">
        ${['#viral','#dance','#food','#travel','#comedy'].map((t,i)=>
          `<span style="background:${i===0?'#ff6b6b':'rgba(255,255,255,0.1)'};color:#fff;padding:4px 12px;border-radius:16px;font-size:11px;white-space:nowrap;">${t}</span>`
        ).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(${wide?4:3},1fr);gap:4px;height:calc(100vh - 160px);">
        ${[
          {c:'linear-gradient(135deg,#ff6b6b,#ee5a24)',u:'@dance',l:'24.5K'},
          {c:'linear-gradient(135deg,#a29bfe,#6c5ce7)',u:'@food',l:'18K'},
          {c:'linear-gradient(135deg,#00b894,#00cec9)',u:'@travel',l:'31K'},
          {c:'linear-gradient(135deg,#fdcb6e,#e17055)',u:'@comedy',l:'9.8K'},
          {c:'linear-gradient(135deg,#fd79a8,#e84393)',u:'@beauty',l:'44K'},
          {c:'linear-gradient(135deg,#74b9ff,#0984e3)',u:'@skate',l:'12K'},
          {c:'linear-gradient(135deg,#55efc4,#00b894)',u:'@fit',l:'7.6K'},
          {c:'linear-gradient(135deg,#fab1a0,#e17055)',u:'@chef',l:'28K'},
          {c:'linear-gradient(135deg,#6c5ce7,#a29bfe)',u:'@dj',l:'16K'},
        ].slice(0, wide?8:9).map(v=>`
          <div style="background:${v.c};border-radius:6px;position:relative;overflow:hidden;">
            <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.7));"></div>
            <div style="position:absolute;bottom:6px;left:6px;color:#fff;font-size:10px;">
              <div style="font-weight:bold;">${v.u}</div><div style="opacity:0.8;">❤️${v.l}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>`,

  // 3 - Profile
  (wide) => `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;">
    <div style="height:160px;background:linear-gradient(135deg,#6c5ce7,#a29bfe,#fd79a8);position:relative;">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.2);"></div>
      <div style="position:absolute;top:14px;left:16px;font-size:20px;font-weight:900;">AthaVid</div>
    </div>
    <div style="padding:0 16px;margin-top:-44px;position:relative;">
      <div style="width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:4px solid #0a0a0a;display:flex;align-items:center;justify-content:center;font-size:36px;">🎵</div>
      <div style="margin-top:8px;font-size:18px;font-weight:bold;">@dancequeen</div>
      <div style="color:#aaa;font-size:12px;margin-top:2px;">Creating vibes daily ✨ | NJ based</div>
      <div style="display:flex;gap:24px;margin-top:10px;">
        <div><span style="font-weight:bold;font-size:15px;">142</span> <span style="color:#aaa;font-size:11px;">Following</span></div>
        <div><span style="font-weight:bold;font-size:15px;">8.4K</span> <span style="color:#aaa;font-size:11px;">Followers</span></div>
        <div><span style="font-weight:bold;font-size:15px;">56.2K</span> <span style="color:#aaa;font-size:11px;">Likes</span></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button style="flex:1;background:#ff6b6b;border:none;color:#fff;padding:10px;border-radius:6px;font-size:13px;font-weight:bold;">Follow</button>
        <button style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:10px;border-radius:6px;font-size:13px;">Message</button>
      </div>
    </div>
    <div style="padding:14px 16px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:3px;height:calc(100vh - 380px);">
      ${[
        {c:'linear-gradient(135deg,#ff6b6b,#ee5a24)',l:'24.5K'},
        {c:'linear-gradient(135deg,#a29bfe,#6c5ce7)',l:'18.2K'},
        {c:'linear-gradient(135deg,#00b894,#00cec9)',l:'31.7K'},
        {c:'linear-gradient(135deg,#fdcb6e,#e17055)',l:'9.8K'},
        {c:'linear-gradient(135deg,#fd79a8,#e84393)',l:'44.1K'},
        {c:'linear-gradient(135deg,#74b9ff,#0984e3)',l:'12.3K'},
      ].map(v=>`
        <div style="background:${v.c};border-radius:4px;position:relative;overflow:hidden;aspect-ratio:9/16;">
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 60%,rgba(0,0,0,0.7));"></div>
          <div style="position:absolute;bottom:5px;left:6px;font-size:10px;color:#fff;">❤️${v.l}</div>
        </div>`).join('')}
    </div>
  </div>`,

  // 4 - Upload
  (wide) => `<div style="width:100vw;height:100vh;background:#111;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;flex-direction:column;">
    <div style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:12px;">
      <div style="color:#ff6b6b;font-size:20px;font-weight:900;">AthaVid</div>
      <div style="font-size:16px;font-weight:bold;">Upload Video</div>
    </div>
    <div style="flex:1;display:flex;flex-direction:${wide?'row':'column'};gap:16px;padding:16px;overflow:hidden;">
      <div style="${wide?'flex:1':'height:200px'};background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
        <div style="font-size:52px;">🎬</div>
        <div style="font-size:12px;color:#555;">Tap to select video</div>
      </div>
      <div style="${wide?'flex:1':'flex:1'};display:flex;flex-direction:column;gap:14px;overflow:hidden;">
        <div>
          <div style="font-size:11px;color:#aaa;margin-bottom:6px;">Caption</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:10px;font-size:13px;color:#ddd;">My amazing dance tutorial 🕺 #dance #fyp</div>
        </div>
        <div>
          <div style="font-size:11px;color:#aaa;margin-bottom:6px;">Hashtags</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${['#dance','#tutorial','#fyp','#viral'].map(t=>`<span style="background:rgba(255,107,107,0.15);border:1px solid rgba(255,107,107,0.4);color:#ff6b6b;padding:4px 10px;border-radius:14px;font-size:11px;">${t}</span>`).join('')}
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:#aaa;margin-bottom:6px;">Sound</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:10px;font-size:13px;color:#ddd;">🎵 Original Sound</div>
        </div>
        <div style="display:flex;gap:10px;margin-top:auto;">
          <button style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:12px;border-radius:8px;font-size:13px;">Save Draft</button>
          <button style="flex:1;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:none;color:#fff;padding:12px;border-radius:8px;font-size:14px;font-weight:bold;">Post Now 🚀</button>
        </div>
      </div>
    </div>
  </div>`,

  // 5 - Login
  (wide) => `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;align-items:center;justify-content:center;">
    <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);position:absolute;inset:0;opacity:0.6;"></div>
    <div style="position:relative;background:#1a1a1a;border-radius:16px;padding:36px 28px;width:${wide?'380px':'85%'};border:1px solid rgba(255,255,255,0.1);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="color:#ff6b6b;font-size:32px;font-weight:900;margin-bottom:4px;">AthaVid</div>
        <div style="color:#aaa;font-size:13px;">Welcome back! 👋</div>
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-size:12px;color:#aaa;margin-bottom:6px;">Email</div>
        <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.2);border-radius:8px;padding:12px;font-size:14px;color:#ddd;">you@example.com</div>
      </div>
      <div style="margin-bottom:20px;">
        <div style="font-size:12px;color:#aaa;margin-bottom:6px;">Password</div>
        <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.2);border-radius:8px;padding:12px;font-size:14px;color:#555;">••••••••</div>
      </div>
      <button style="width:100%;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:none;color:#fff;padding:14px;border-radius:8px;font-size:15px;font-weight:bold;margin-bottom:14px;">Log In</button>
      <div style="text-align:center;font-size:12px;color:#aaa;">Don't have an account? <span style="color:#ff6b6b;">Sign Up</span></div>
    </div>
  </div>`,

  // 6 - Sign Up
  (wide) => `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;align-items:center;justify-content:center;">
    <div style="background:linear-gradient(135deg,#6c5ce7,#a29bfe);position:absolute;inset:0;opacity:0.15;"></div>
    <div style="position:relative;background:#1a1a1a;border-radius:16px;padding:32px 28px;width:${wide?'380px':'85%'};border:1px solid rgba(255,255,255,0.1);">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="color:#ff6b6b;font-size:30px;font-weight:900;margin-bottom:4px;">AthaVid</div>
        <div style="color:#aaa;font-size:13px;">Create your account ✨</div>
      </div>
      ${['Username','Email','Password','Date of Birth'].map(f=>`
        <div style="margin-bottom:12px;">
          <div style="font-size:11px;color:#aaa;margin-bottom:5px;">${f}</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:11px;font-size:13px;color:#555;">Enter ${f.toLowerCase()}...</div>
        </div>`).join('')}
      <button style="width:100%;background:linear-gradient(135deg,#a29bfe,#6c5ce7);border:none;color:#fff;padding:13px;border-radius:8px;font-size:14px;font-weight:bold;margin-top:4px;margin-bottom:12px;">Create Account</button>
      <div style="text-align:center;font-size:12px;color:#aaa;">Already have an account? <span style="color:#ff6b6b;">Log In</span></div>
    </div>
  </div>`,

  // 7 - Trending
  (wide) => `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;">
    <div style="padding:14px 16px 10px;border-bottom:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;font-size:20px;font-weight:900;margin-bottom:10px;">AthaVid</div>
      <div style="background:rgba(255,255,255,0.08);border-radius:20px;padding:8px 16px;color:#aaa;font-size:12px;">🔍 Discover trending videos...</div>
    </div>
    <div style="padding:12px 14px;">
      <div style="font-size:16px;font-weight:bold;margin-bottom:10px;">🎵 Trending Sounds</div>
      ${[
        {c:'#ff6b6b',t:'Levitating Remix',a:'DJ Mix',v:'2.1M'},
        {c:'#a29bfe',t:'Original Dance Beat',a:'@beatmaker',v:'1.4M'},
        {c:'#00b894',t:'Summer Vibes 2026',a:'Various',v:'980K'},
      ].map(s=>`
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;background:rgba(255,255,255,0.05);border-radius:10px;padding:10px;">
          <div style="width:44px;height:44px;border-radius:8px;background:${s.c};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🎵</div>
          <div style="flex:1;"><div style="font-size:13px;font-weight:bold;">${s.t}</div><div style="font-size:11px;color:#aaa;">${s.a} · ${s.v} videos</div></div>
          <button style="background:rgba(255,107,107,0.2);border:1px solid rgba(255,107,107,0.4);color:#ff6b6b;padding:5px 12px;border-radius:16px;font-size:11px;">Use</button>
        </div>`).join('')}
      <div style="font-size:16px;font-weight:bold;margin:14px 0 10px;">👥 Suggested Creators</div>
      ${[
        {e:'🎵',u:'@dancequeen',f:'2.1M followers',c:'#ff6b6b'},
        {e:'🍳',u:'@chefmike',f:'890K followers',c:'#fdcb6e'},
        {e:'🌊',u:'@traveler99',f:'1.3M followers',c:'#00b894'},
      ].map(c=>`
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;background:rgba(255,255,255,0.05);border-radius:10px;padding:10px;">
          <div style="width:44px;height:44px;border-radius:50%;background:${c.c};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${c.e}</div>
          <div style="flex:1;"><div style="font-size:13px;font-weight:bold;">${c.u}</div><div style="font-size:11px;color:#aaa;">${c.f}</div></div>
          <button style="background:#ff6b6b;border:none;color:#fff;padding:5px 14px;border-radius:16px;font-size:11px;font-weight:bold;">Follow</button>
        </div>`).join('')}
    </div>
  </div>`,

  // 8 - Comments
  (wide) => `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;flex-direction:column;">
    <div style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:10px;">
      <div style="font-size:18px;opacity:0.6;">←</div>
      <div style="color:#ff6b6b;font-size:20px;font-weight:900;">AthaVid</div>
      <div style="font-size:15px;font-weight:bold;margin-left:4px;">Comments</div>
    </div>
    <div style="flex:1;overflow:hidden;padding:12px 16px;display:flex;flex-direction:column;gap:14px;">
      ${[
        {e:'😍',u:'@user_alex',t:'This is EVERYTHING!! The way you nailed that transition 🔥🔥',l:'1.2K',time:'2h'},
        {e:'🎵',u:'@music_fan',t:'The song choice is perfect, adds so much to the vibe ✨',l:'834',time:'3h'},
        {e:'🌟',u:'@dancer_pro',t:'Been trying this move for weeks, your tutorial finally helped me get it!',l:'567',time:'4h'},
        {e:'💃',u:'@sarah_dances',t:'Can you do a tutorial on this? Please please please 🙏',l:'423',time:'5h'},
        {e:'🔥',u:'@viral_watch',t:'This went viral for a reason, absolute perfection 👏',l:'298',time:'6h'},
      ].map(c=>`
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#a29bfe);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">${c.e}</div>
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
              <span style="font-weight:bold;font-size:13px;">${c.u}</span>
              <span style="color:#555;font-size:11px;">${c.time} ago</span>
            </div>
            <div style="font-size:13px;color:#ddd;line-height:1.4;">${c.t}</div>
            <div style="margin-top:5px;display:flex;gap:14px;font-size:11px;color:#666;">
              <span>❤️ ${c.l}</span><span>Reply</span>
            </div>
          </div>
        </div>`).join('')}
    </div>
    <div style="padding:10px 14px 20px;border-top:1px solid rgba(255,255,255,0.08);display:flex;gap:10px;align-items:center;">
      <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#a29bfe);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">😊</div>
      <div style="flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:9px 14px;font-size:13px;color:#555;">Add a comment...</div>
      <div style="font-size:20px;">↗️</div>
    </div>
  </div>`,
];

(async () => {
  const browser = await chromium.launch();

  for (let i = 0; i < SCREENS.length; i++) {
    const s = SCREENS[i];
    const htmlIdx = i % 8;
    const isWide = s.vw >= 600;

    const context = await browser.newContext({
      viewport: { width: s.vw, height: s.vh },
      deviceScaleFactor: s.dpr,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;">${HTMLS[htmlIdx](isWide)}</body></html>`);
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/app/' + s.file, fullPage: false });
    await context.close();
    console.log('Saved: ' + s.file + ' (' + Math.round(s.vw * s.dpr) + 'x' + Math.round(s.vh * s.dpr) + ')');
  }

  await browser.close();
  console.log('All done!');
})();
