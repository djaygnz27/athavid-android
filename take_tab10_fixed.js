const { chromium } = require('playwright');

// 9:16 at 1080x1920 — both sides >= 1080px, within 7680px ✅
const SCREENS = [
  { file: 'tab10f_1_feed.png',     vw: 810, vh: 1440, dpr: 1.333 },
  { file: 'tab10f_2_explore.png',  vw: 810, vh: 1440, dpr: 1.333 },
  { file: 'tab10f_3_profile.png',  vw: 810, vh: 1440, dpr: 1.333 },
  { file: 'tab10f_4_upload.png',   vw: 810, vh: 1440, dpr: 1.333 },
  { file: 'tab10f_5_login.png',    vw: 810, vh: 1440, dpr: 1.333 },
  { file: 'tab10f_6_signup.png',   vw: 810, vh: 1440, dpr: 1.333 },
  { file: 'tab10f_7_trending.png', vw: 810, vh: 1440, dpr: 1.333 },
  { file: 'tab10f_8_comments.png', vw: 810, vh: 1440, dpr: 1.333 },
];

const HTMLS = [
  // 1 - Feed
  `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;display:flex;flex-direction:column;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:rgba(0,0,0,0.9);border-bottom:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;font-size:24px;font-weight:900;">AthaVid</div>
      <div style="display:flex;gap:24px;color:#fff;font-size:14px;">
        <span style="opacity:0.6;">Following</span>
        <span style="font-weight:bold;border-bottom:2px solid #ff6b6b;padding-bottom:3px;">For You</span>
        <span style="opacity:0.6;">Explore</span>
      </div>
      <div style="display:flex;gap:12px;align-items:center;">
        <div style="background:rgba(255,255,255,0.1);border-radius:20px;padding:8px 18px;color:#aaa;font-size:13px;">🔍 Search</div>
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#a29bfe);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:14px;">J</div>
      </div>
    </div>
    <div style="flex:1;display:flex;gap:4px;padding:4px;overflow:hidden;">
      <div style="flex:2;background:linear-gradient(160deg,#1a1a2e,#0f3460);position:relative;border-radius:8px;overflow:hidden;">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 55%,rgba(255,107,107,0.3),transparent 60%);"></div>
        <div style="position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);font-size:52px;">▶️</div>
        <div style="position:absolute;bottom:90px;left:20px;right:70px;color:#fff;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#ee5a24);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🎵</div>
            <div><div style="font-weight:bold;font-size:15px;">@dancequeen</div><div style="font-size:12px;opacity:0.6;">2.1M followers</div></div>
            <button style="margin-left:8px;background:#ff6b6b;border:none;color:#fff;padding:6px 16px;border-radius:5px;font-size:12px;font-weight:bold;">Follow</button>
          </div>
          <div style="font-size:14px;line-height:1.6;">This transition took me 3 weeks to perfect 😤 #dance #viral #fyp</div>
          <div style="margin-top:6px;font-size:12px;opacity:0.5;">🎵 original sound · dancequeen</div>
        </div>
        <div style="position:absolute;bottom:90px;right:16px;display:flex;flex-direction:column;gap:20px;align-items:center;color:#fff;">
          <div style="text-align:center;"><div style="font-size:28px;">❤️</div><div style="font-size:11px;">24.5K</div></div>
          <div style="text-align:center;"><div style="font-size:28px;">💬</div><div style="font-size:11px;">832</div></div>
          <div style="text-align:center;"><div style="font-size:28px;">↗️</div><div style="font-size:11px;">1.2K</div></div>
          <div style="text-align:center;"><div style="font-size:28px;">🔖</div><div style="font-size:11px;">4.8K</div></div>
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
        <div style="flex:1;background:linear-gradient(135deg,#a29bfe,#6c5ce7);border-radius:8px;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.75));"></div>
          <div style="position:absolute;bottom:10px;left:10px;color:#fff;"><div style="font-size:12px;font-weight:bold;">@foodiepro</div><div style="font-size:11px;opacity:0.8;">Secret ramen 🍜</div></div>
        </div>
        <div style="flex:1;background:linear-gradient(135deg,#00b894,#00cec9);border-radius:8px;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.75));"></div>
          <div style="position:absolute;bottom:10px;left:10px;color:#fff;"><div style="font-size:12px;font-weight:bold;">@traveler99</div><div style="font-size:11px;opacity:0.8;">Hidden beach 🌊</div></div>
        </div>
        <div style="flex:1;background:linear-gradient(135deg,#fdcb6e,#e17055);border-radius:8px;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.75));"></div>
          <div style="position:absolute;bottom:10px;left:10px;color:#fff;"><div style="font-size:12px;font-weight:bold;">@comedy_k</div><div style="font-size:11px;opacity:0.8;">Monday mood 😂</div></div>
        </div>
      </div>
    </div>
    <div style="background:rgba(0,0,0,0.95);display:flex;justify-content:space-around;padding:12px 0 18px;border-top:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;text-align:center;font-size:11px;"><div style="font-size:24px;">🏠</div>Home</div>
      <div style="color:#555;text-align:center;font-size:11px;"><div style="font-size:24px;">🔍</div>Explore</div>
      <div style="color:#555;text-align:center;font-size:11px;"><div style="font-size:24px;">➕</div>Post</div>
      <div style="color:#555;text-align:center;font-size:11px;"><div style="font-size:24px;">👤</div>Me</div>
    </div>
  </div>`,

  // 2 - Explore
  `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;">
    <div style="padding:16px 22px 12px;display:flex;align-items:center;gap:14px;border-bottom:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;font-size:22px;font-weight:900;">AthaVid</div>
      <div style="flex:1;background:rgba(255,255,255,0.08);border-radius:22px;padding:9px 18px;color:#aaa;font-size:13px;">🔍 Search videos, sounds, users...</div>
    </div>
    <div style="padding:14px 18px 0;">
      <div style="font-size:18px;font-weight:bold;margin-bottom:10px;">🔥 Trending Now</div>
      <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
        ${['#viral','#dance','#food','#travel','#comedy','#fitness'].map((t,i)=>
          `<span style="background:${i===0?'#ff6b6b':'rgba(255,255,255,0.1)'};color:#fff;padding:5px 14px;border-radius:16px;font-size:12px;">${t}</span>`
        ).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;height:calc(100vh - 200px);">
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
          <div style="background:${v.c};border-radius:8px;position:relative;overflow:hidden;">
            <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.75));"></div>
            <div style="position:absolute;bottom:8px;left:8px;color:#fff;">
              <div style="font-size:12px;font-weight:bold;">${v.u}</div>
              <div style="font-size:11px;opacity:0.8;">❤️ ${v.l}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>`,

  // 3 - Profile
  `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;">
    <div style="height:180px;background:linear-gradient(135deg,#6c5ce7,#a29bfe,#fd79a8);position:relative;">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.2);"></div>
      <div style="position:absolute;top:16px;left:22px;font-size:22px;font-weight:900;">AthaVid</div>
    </div>
    <div style="padding:0 22px;margin-top:-50px;position:relative;">
      <div style="width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:4px solid #0a0a0a;display:flex;align-items:center;justify-content:center;font-size:40px;">🎵</div>
      <div style="margin-top:10px;font-size:20px;font-weight:bold;">@dancequeen</div>
      <div style="color:#aaa;font-size:13px;margin-top:3px;">Creating vibes daily ✨ | NJ based | DMs open 💌</div>
      <div style="display:flex;gap:28px;margin-top:12px;">
        <div><span style="font-weight:bold;font-size:16px;">142</span> <span style="color:#aaa;font-size:12px;">Following</span></div>
        <div><span style="font-weight:bold;font-size:16px;">8.4K</span> <span style="color:#aaa;font-size:12px;">Followers</span></div>
        <div><span style="font-weight:bold;font-size:16px;">56.2K</span> <span style="color:#aaa;font-size:12px;">Likes</span></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px;">
        <button style="flex:1;background:#ff6b6b;border:none;color:#fff;padding:12px;border-radius:8px;font-size:14px;font-weight:bold;">Follow</button>
        <button style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:12px;border-radius:8px;font-size:14px;">Message</button>
      </div>
    </div>
    <div style="padding:16px 22px 0;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;height:calc(100vh - 450px);">
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
        <div style="background:${v.c};border-radius:6px;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 60%,rgba(0,0,0,0.7));"></div>
          <div style="position:absolute;bottom:6px;left:8px;font-size:11px;color:#fff;">❤️ ${v.l}</div>
        </div>`).join('')}
    </div>
  </div>`,

  // 4 - Upload
  `<div style="width:100vw;height:100vh;background:#111;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;flex-direction:column;">
    <div style="padding:16px 22px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:14px;">
      <div style="color:#ff6b6b;font-size:22px;font-weight:900;">AthaVid</div>
      <div style="font-size:17px;font-weight:bold;">Upload Video</div>
    </div>
    <div style="flex:1;display:flex;gap:18px;padding:18px;overflow:hidden;">
      <div style="flex:1;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:14px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;">
        <div style="font-size:64px;">🎬</div>
        <div style="font-size:13px;color:#555;">Tap to select video</div>
      </div>
      <div style="flex:1.2;display:flex;flex-direction:column;gap:16px;overflow:hidden;">
        <div>
          <div style="font-size:12px;color:#aaa;margin-bottom:7px;">Caption</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:12px;font-size:14px;color:#ddd;line-height:1.5;">My amazing dance tutorial 🕺 #dance #tutorial #fyp</div>
        </div>
        <div>
          <div style="font-size:12px;color:#aaa;margin-bottom:7px;">Hashtags</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${['#dance','#tutorial','#fyp','#viral','#trending'].map(t=>`<span style="background:rgba(255,107,107,0.15);border:1px solid rgba(255,107,107,0.4);color:#ff6b6b;padding:5px 12px;border-radius:16px;font-size:12px;">${t}</span>`).join('')}
          </div>
        </div>
        <div>
          <div style="font-size:12px;color:#aaa;margin-bottom:7px;">Sound</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:12px;font-size:14px;color:#ddd;display:flex;align-items:center;gap:10px;">🎵 Original Sound — dancequeen</div>
        </div>
        <div>
          <div style="font-size:12px;color:#aaa;margin-bottom:7px;">Who can watch</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:12px;font-size:14px;color:#ddd;display:flex;justify-content:space-between;">🌍 Everyone <span style="color:#aaa;">▼</span></div>
        </div>
        <div style="display:flex;gap:12px;margin-top:auto;">
          <button style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:14px;border-radius:10px;font-size:14px;">Save Draft</button>
          <button style="flex:1;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:none;color:#fff;padding:14px;border-radius:10px;font-size:15px;font-weight:bold;">Post Now 🚀</button>
        </div>
      </div>
    </div>
  </div>`,

  // 5 - Login
  `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;align-items:center;justify-content:center;">
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a1a2e,#16213e);opacity:0.7;"></div>
    <div style="position:relative;background:#1a1a1a;border-radius:18px;padding:42px 36px;width:420px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 32px 80px rgba(0,0,0,0.6);">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="color:#ff6b6b;font-size:36px;font-weight:900;margin-bottom:6px;">AthaVid</div>
        <div style="color:#aaa;font-size:14px;">Welcome back! 👋</div>
      </div>
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;color:#aaa;margin-bottom:7px;">Email</div>
        <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.2);border-radius:10px;padding:13px;font-size:14px;color:#ddd;">you@example.com</div>
      </div>
      <div style="margin-bottom:24px;">
        <div style="font-size:12px;color:#aaa;margin-bottom:7px;">Password</div>
        <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.2);border-radius:10px;padding:13px;font-size:14px;color:#555;">••••••••</div>
      </div>
      <button style="width:100%;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:none;color:#fff;padding:16px;border-radius:10px;font-size:16px;font-weight:bold;margin-bottom:16px;">Log In</button>
      <div style="text-align:center;font-size:13px;color:#aaa;">Don't have an account? <span style="color:#ff6b6b;">Sign Up</span></div>
    </div>
  </div>`,

  // 6 - Sign Up
  `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;align-items:center;justify-content:center;">
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,#6c5ce7,#a29bfe);opacity:0.12;"></div>
    <div style="position:relative;background:#1a1a1a;border-radius:18px;padding:38px 36px;width:420px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 32px 80px rgba(0,0,0,0.6);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="color:#ff6b6b;font-size:34px;font-weight:900;margin-bottom:4px;">AthaVid</div>
        <div style="color:#aaa;font-size:14px;">Create your account ✨</div>
      </div>
      ${['Username','Email','Password','Date of Birth'].map(f=>`
        <div style="margin-bottom:14px;">
          <div style="font-size:12px;color:#aaa;margin-bottom:6px;">${f}</div>
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:12px;font-size:14px;color:#555;">Enter ${f.toLowerCase()}...</div>
        </div>`).join('')}
      <button style="width:100%;background:linear-gradient(135deg,#a29bfe,#6c5ce7);border:none;color:#fff;padding:15px;border-radius:10px;font-size:15px;font-weight:bold;margin-top:6px;margin-bottom:14px;">Create Account</button>
      <div style="text-align:center;font-size:13px;color:#aaa;">Already have an account? <span style="color:#ff6b6b;">Log In</span></div>
    </div>
  </div>`,

  // 7 - Trending
  `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;">
    <div style="padding:16px 22px 12px;border-bottom:1px solid rgba(255,255,255,0.08);">
      <div style="color:#ff6b6b;font-size:22px;font-weight:900;margin-bottom:12px;">AthaVid</div>
      <div style="background:rgba(255,255,255,0.08);border-radius:22px;padding:9px 18px;color:#aaa;font-size:13px;">🔍 Discover trending...</div>
    </div>
    <div style="padding:14px 22px;">
      <div style="font-size:17px;font-weight:bold;margin-bottom:12px;">🎵 Trending Sounds</div>
      ${[
        {c:'#ff6b6b',t:'Levitating Remix',a:'DJ Mix',v:'2.1M'},
        {c:'#a29bfe',t:'Original Dance Beat',a:'@beatmaker',v:'1.4M'},
        {c:'#00b894',t:'Summer Vibes 2026',a:'Various',v:'980K'},
      ].map(s=>`
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;background:rgba(255,255,255,0.05);border-radius:12px;padding:12px;">
          <div style="width:50px;height:50px;border-radius:10px;background:${s.c};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">🎵</div>
          <div style="flex:1;"><div style="font-size:14px;font-weight:bold;">${s.t}</div><div style="font-size:12px;color:#aaa;">${s.a} · ${s.v} videos</div></div>
          <button style="background:rgba(255,107,107,0.2);border:1px solid rgba(255,107,107,0.4);color:#ff6b6b;padding:6px 14px;border-radius:16px;font-size:12px;">Use</button>
        </div>`).join('')}
      <div style="font-size:17px;font-weight:bold;margin:16px 0 12px;">👥 Suggested Creators</div>
      ${[
        {e:'🎵',u:'@dancequeen',f:'2.1M followers',c:'#ff6b6b'},
        {e:'🍳',u:'@chefmike',f:'890K followers',c:'#fdcb6e'},
        {e:'🌊',u:'@traveler99',f:'1.3M followers',c:'#00b894'},
        {e:'😂',u:'@comedy_k',f:'560K followers',c:'#a29bfe'},
      ].map(c=>`
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;background:rgba(255,255,255,0.05);border-radius:12px;padding:12px;">
          <div style="width:50px;height:50px;border-radius:50%;background:${c.c};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${c.e}</div>
          <div style="flex:1;"><div style="font-size:14px;font-weight:bold;">${c.u}</div><div style="font-size:12px;color:#aaa;">${c.f}</div></div>
          <button style="background:#ff6b6b;border:none;color:#fff;padding:6px 16px;border-radius:16px;font-size:12px;font-weight:bold;">Follow</button>
        </div>`).join('')}
    </div>
  </div>`,

  // 8 - Comments
  `<div style="width:100vw;height:100vh;background:#0a0a0a;font-family:'Segoe UI',sans-serif;overflow:hidden;color:#fff;display:flex;flex-direction:column;">
    <div style="padding:16px 22px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:12px;">
      <div style="font-size:20px;opacity:0.6;">←</div>
      <div style="color:#ff6b6b;font-size:22px;font-weight:900;">AthaVid</div>
      <div style="font-size:16px;font-weight:bold;">Comments (1,247)</div>
    </div>
    <div style="flex:1;overflow:hidden;padding:14px 22px;display:flex;flex-direction:column;gap:16px;">
      ${[
        {e:'😍',u:'@user_alex',t:'This is EVERYTHING!! The way you nailed that transition 🔥🔥',l:'1.2K',time:'2h'},
        {e:'🎵',u:'@music_fan',t:'The song choice is perfect, adds so much to the vibe ✨',l:'834',time:'3h'},
        {e:'🌟',u:'@dancer_pro',t:'Been trying this move for weeks, your tutorial finally helped me get it!',l:'567',time:'4h'},
        {e:'💃',u:'@sarah_dances',t:'Can you do a tutorial on this? Please please please 🙏',l:'423',time:'5h'},
        {e:'🔥',u:'@viral_watch',t:'This went viral for a reason, absolute perfection 👏',l:'298',time:'6h'},
      ].map(c=>`
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#a29bfe);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">${c.e}</div>
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span style="font-weight:bold;font-size:14px;">${c.u}</span>
              <span style="color:#555;font-size:12px;">${c.time} ago</span>
            </div>
            <div style="font-size:14px;color:#ddd;line-height:1.5;">${c.t}</div>
            <div style="margin-top:6px;display:flex;gap:16px;font-size:12px;color:#666;">
              <span>❤️ ${c.l}</span><span>Reply</span>
            </div>
          </div>
        </div>`).join('')}
    </div>
    <div style="padding:12px 18px 22px;border-top:1px solid rgba(255,255,255,0.08);display:flex;gap:12px;align-items:center;">
      <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#a29bfe);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">😊</div>
      <div style="flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:22px;padding:11px 16px;font-size:13px;color:#555;">Add a comment...</div>
      <div style="font-size:22px;">↗️</div>
    </div>
  </div>`,
];

(async () => {
  const browser = await chromium.launch();
  for (let i = 0; i < SCREENS.length; i++) {
    const s = SCREENS[i];
    const context = await browser.newContext({
      viewport: { width: s.vw, height: s.vh },
      deviceScaleFactor: s.dpr,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;">${HTMLS[i]}</body></html>`);
    await page.waitForTimeout(600);
    await page.screenshot({ path: '/app/' + s.file, fullPage: false });
    await context.close();
    const w = Math.round(s.vw * s.dpr);
    const h = Math.round(s.vh * s.dpr);
    console.log(`Saved: ${s.file} (${w}x${h})`);
  }
  await browser.close();
  console.log('All 8 done!');
})();
