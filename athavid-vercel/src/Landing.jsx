import React, { useState, useEffect } from "react";

function getThemeIndex() {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return Math.floor(day / 3) % 5;
}

const SLOGAN = ["Real Moments.", "Real People.", "No AI."];

// ── Shared Apply Button ───────────────────────────────────────────────────────
function ApplyBtn({ bg = "linear-gradient(135deg,#F5C842,#FF9500)", color = "#000" }) {
  return (
    <div style={{ position:"absolute", top:20, right:20, zIndex:20 }}>
      <button onClick={e => { e.stopPropagation(); window.location.href='/apply'; }}
        style={{ background:bg, color, border:"none", borderRadius:50,
          padding:"10px 20px", fontWeight:900, fontSize:13, cursor:"pointer",
          fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
        🌸 Apply as Founding Creator
      </button>
    </div>
  );
}

// ── THEME 1: EKG Heartbeat / Dark Grid ───────────────────────────────────────
const STARS_1 = Array.from({length:60},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:0.6+Math.random()*1.6,dur:2+Math.random()*4,delay:Math.random()*6}));
const PARTICLES_1 = Array.from({length:16},(_,i)=>({id:i,left:`${5+Math.random()*90}%`,delay:`${Math.random()*10}s`,duration:`${8+Math.random()*8}s`,size:2+Math.random()*4,drift:(Math.random()-0.5)*60,color:i%3===0?"#F5C842":i%3===1?"#FF9500":"#fff"}));
const EKG_PTS = "0,30 30,30 42,8 50,52 58,30 80,30 88,18 96,42 104,30 130,30 142,8 150,52 158,30 180,30 188,18 196,42 204,30 260,30";

function Theme1({ onEnter, leaving }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let fr, st=null;
    const go = ts => { if(!st)st=ts; const v=Math.min((ts-st)/2000,1); setP(v); if(v<1)fr=requestAnimationFrame(go); };
    const t = setTimeout(()=>{fr=requestAnimationFrame(go);},400);
    return ()=>{ clearTimeout(t); cancelAnimationFrame(fr); };
  },[]);
  return (
    <div onClick={onEnter} style={{ position:"fixed",inset:0,zIndex:9999,background:"#030308",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer",opacity:leaving?0:1,transition:"opacity 0.7s ease" }}>
      <style>{`
        @keyframes tw1{0%,100%{opacity:.06;transform:scale(.7)}50%{opacity:.8;transform:scale(1.4)}}
        @keyframes pr1{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:.8}90%{opacity:.2}100%{transform:translateY(-100vh) translateX(var(--drift));opacity:0}}
        @keyframes gp1{0%,100%{opacity:.03}50%{opacity:.08}}
        @keyframes li1{0%{opacity:0;transform:translateY(-20px) scale(.9)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes ni1{0%{opacity:0;transform:translateX(-30px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes fi1{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes eg1{0%,100%{filter:drop-shadow(0 0 4px rgba(245,200,66,.6))}50%{filter:drop-shadow(0 0 18px rgba(245,200,66,1))}}
        @keyframes sc1{0%{left:-100%}100%{left:100%}}
        @keyframes pr1r{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.8);opacity:0}}
        @keyframes db1{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes sh1{0%{background-position:-400% center}100%{background-position:400% center}}
        @keyframes bf1{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes hb1{0%,100%{transform:scaleY(1)}8%{transform:scaleY(1.12)}18%{transform:scaleY(.92)}28%{transform:scaleY(1)}}
        .t1li{animation:li1 .8s cubic-bezier(.16,1,.3,1) .3s both}
        .t1ni{animation:ni1 .7s cubic-bezier(.16,1,.3,1) .6s both}
        .t1f1{animation:fi1 .6s ease .9s both}.t1f2{animation:fi1 .6s ease 1.2s both}
        .t1f3{animation:fi1 .6s ease 1.5s both}.t1f4{animation:fi1 .6s ease 1.8s both}
        .t1f5{animation:fi1 .6s ease 2.1s both}
        .t1eg{animation:eg1 2.5s ease-in-out 1.5s infinite,hb1 2s ease-in-out 2.2s infinite;transform-origin:center}
      `}</style>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(245,200,66,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(245,200,66,.035) 1px,transparent 1px)",backgroundSize:"44px 44px",animation:"gp1 4s ease-in-out infinite"}}/>
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:2}}>
        <div style={{position:"absolute",top:0,bottom:0,width:"25%",background:"linear-gradient(90deg,transparent,rgba(245,200,66,.025),transparent)",animation:"sc1 7s linear infinite"}}/>
      </div>
      {STARS_1.map(s=><div key={s.id} style={{position:"absolute",borderRadius:"50%",background:"#fff",width:s.size,height:s.size,left:`${s.x}%`,top:`${s.y}%`,animation:`tw1 ${s.dur}s ease-in-out ${s.delay}s infinite`,pointerEvents:"none",zIndex:1}}/>)}
      {PARTICLES_1.map(p2=><div key={p2.id} style={{position:"absolute",bottom:-10,left:p2.left,pointerEvents:"none",zIndex:1,"--drift":`${p2.drift}px`,animation:`pr1 ${p2.duration} ${p2.delay} ease-in infinite`}}><div style={{width:p2.size,height:p2.size,borderRadius:"50%",background:p2.color,opacity:.6}}/></div>)}
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,200,66,.055) 0%,transparent 70%)",top:"50%",left:"50%",transform:"translate(-50%,-58%)",pointerEvents:"none",zIndex:1}}/>
      <ApplyBtn/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:10,padding:"0 28px",textAlign:"center",width:"100%",maxWidth:440}}>
        <div className="t1li" style={{marginBottom:20,position:"relative"}}>
          <div style={{position:"absolute",width:100,height:100,borderRadius:"50%",border:"1px solid rgba(245,200,66,.25)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"pr1r 2.6s ease-out 2s infinite"}}/>
          <div style={{position:"absolute",width:100,height:100,borderRadius:"50%",border:"1px solid rgba(245,200,66,.15)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"pr1r 2.6s ease-out 3.2s infinite"}}/>
          <div className="t1eg">
            <svg width="290" height="76" viewBox="0 0 280 72" style={{overflow:"visible"}}>
              <defs><linearGradient id="eg1g" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#F5C842" stopOpacity=".2"/><stop offset="25%" stopColor="#F5C842"/><stop offset="55%" stopColor="#FF9500"/><stop offset="100%" stopColor="#FF4500" stopOpacity=".5"/></linearGradient></defs>
              <polyline points={EKG_PTS} fill="none" stroke="rgba(245,200,66,.1)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" transform="translate(10,6)"/>
              <polyline points={EKG_PTS} fill="none" stroke="url(#eg1g)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="900" strokeDashoffset={900*(1-p)} transform="translate(10,6)" style={{transition:"stroke-dashoffset .05s linear"}}/>
              {p<.99&&<circle cx={10+p*260} cy={36} r={5} fill="#fff" opacity={.9}/>}
            </svg>
          </div>
        </div>
        <div className="t1ni" style={{marginBottom:2}}>
          <div style={{fontSize:80,fontWeight:900,lineHeight:.9,background:"linear-gradient(135deg,#FFE070 0%,#F5C842 35%,#FF9500 65%,#FFE090 100%)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"sh1 5s linear 1.5s infinite",fontFamily:"'Arial Black',system-ui,sans-serif",letterSpacing:"-4px"}}>sachi</div>
        </div>
        <div className="t1f1" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,marginBottom:24}}>
          <span style={{fontSize:9,color:"rgba(245,200,66,.4)",letterSpacing:5,fontWeight:700}}>™</span>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(245,200,66,.07)",border:"1px solid rgba(245,200,66,.18)",borderRadius:40,padding:"6px 18px"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:"#F5C842",animation:"db1 1.2s ease-in-out infinite"}}/>
            <span style={{color:"rgba(245,200,66,.85)",fontSize:10,fontWeight:800,letterSpacing:3.5,textTransform:"uppercase"}}>Sachi means truth</span>
          </div>
        </div>
        {SLOGAN.map((s,i)=><div key={i} className={`t1f${i+2}`} style={{fontSize:i===2?22:20,fontWeight:i===2?900:700,color:i===2?"#F5C842":i===0?"rgba(255,255,255,.9)":"rgba(255,255,255,.5)",marginBottom:i===2?28:4,letterSpacing:i===2?1:0}}>{s}</div>)}
        <div className="t1f5" style={{fontSize:13,color:"rgba(255,255,255,.25)",fontWeight:600,marginBottom:10}}>Tap anywhere to enter</div>
        <div className="t1f5" style={{display:"flex",gap:8,alignItems:"center",marginTop:8}}>
          {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:`rgba(245,200,66,${.7-i*.15})`,animation:`db1 1.3s ease-in-out ${i*.25}s infinite`}}/>)}
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:2}}><div style={{height:"100%",background:"linear-gradient(90deg,#7b2ff7,#F5C842,#FF9500,#FF4500)",backgroundSize:"300% 100%",animation:"bf1 3s ease infinite"}}/></div>
      {[{top:0,left:0,borderTop:"1.5px solid rgba(245,200,66,.18)",borderLeft:"1.5px solid rgba(245,200,66,.18)"},{top:0,right:0,borderTop:"1.5px solid rgba(245,200,66,.18)",borderRight:"1.5px solid rgba(245,200,66,.18)"},{bottom:0,left:0,borderBottom:"1.5px solid rgba(245,200,66,.18)",borderLeft:"1.5px solid rgba(245,200,66,.18)"},{bottom:0,right:0,borderBottom:"1.5px solid rgba(245,200,66,.18)",borderRight:"1.5px solid rgba(245,200,66,.18)"}].map((s,i)=><div key={i} style={{position:"absolute",width:55,height:55,pointerEvents:"none",...s}}/>)}
    </div>
  );
}

// ── THEME 2: Neon Purple Rave ─────────────────────────────────────────────────
const RAVE_LINES = Array.from({length:14},(_,i)=>({id:i,x1:Math.random()*100,y1:Math.random()*100,x2:Math.random()*100,y2:Math.random()*100,dur:3+Math.random()*4,delay:Math.random()*5,color:i%2===0?"rgba(180,50,255,.15)":"rgba(245,200,66,.1)"}));

function Theme2({ onEnter, leaving }) {
  return (
    <div onClick={onEnter} style={{position:"fixed",inset:0,zIndex:9999,background:"linear-gradient(135deg,#0d0020 0%,#1a0035 40%,#0a001a 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer",opacity:leaving?0:1,transition:"opacity .7s ease"}}>
      <style>{`
        @keyframes t2in{0%{opacity:0;transform:scale(.8) rotate(-5deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
        @keyframes t2pulse{0%,100%{box-shadow:0 0 30px rgba(180,50,255,.4),0 0 60px rgba(180,50,255,.2)}50%{box-shadow:0 0 60px rgba(180,50,255,.8),0 0 120px rgba(180,50,255,.4),0 0 200px rgba(245,200,66,.2)}}
        @keyframes t2glitch{0%,88%,100%{transform:translateX(0)}90%{transform:translateX(-3px)}92%{transform:translateX(3px)}94%{transform:translateX(-2px)}96%{transform:translateX(2px)}}
        @keyframes t2lf{0%,100%{opacity:0}50%{opacity:1}}
        @keyframes t2fi{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes sh2{0%{background-position:-400% center}100%{background-position:400% center}}
        @keyframes db2{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes scanH2{0%{top:-5%}100%{top:105%}}
        .t2in{animation:t2in .9s cubic-bezier(.34,1.56,.64,1) .2s both}
        .t2f1{animation:t2fi .6s ease .7s both}.t2f2{animation:t2fi .6s ease 1s both}
        .t2f3{animation:t2fi .6s ease 1.3s both}.t2f4{animation:t2fi .6s ease 1.6s both}
        .t2f5{animation:t2fi .6s ease 1.9s both}
        .t2box{animation:t2pulse 3s ease-in-out infinite}
        .t2txt{animation:t2glitch 8s ease-in-out 3s infinite}
      `}</style>
      <div style={{position:"absolute",left:0,right:0,height:2,zIndex:2,pointerEvents:"none",background:"linear-gradient(90deg,transparent,rgba(180,50,255,.6),rgba(245,200,66,.4),transparent)",animation:"scanH2 4s linear infinite",opacity:.5}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1}}>
        {RAVE_LINES.map(l=><line key={l.id} x1={`${l.x1}%`} y1={`${l.y1}%`} x2={`${l.x2}%`} y2={`${l.y2}%`} stroke={l.color} strokeWidth="1" style={{animation:`t2lf ${l.dur}s ease-in-out ${l.delay}s infinite`}}/>)}
      </svg>
      <ApplyBtn bg="linear-gradient(135deg,#b432ff,#F5C842)"/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:10,padding:"0 28px",textAlign:"center",maxWidth:440,width:"100%"}}>
        <div className="t2in t2box" style={{marginBottom:24,border:"2px solid rgba(180,50,255,.5)",borderRadius:20,padding:"16px 40px",background:"rgba(180,50,255,.08)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(180,50,255,.1),rgba(245,200,66,.05))",pointerEvents:"none"}}/>
          <div className="t2txt" style={{fontSize:84,fontWeight:900,lineHeight:.9,background:"linear-gradient(135deg,#b432ff 0%,#F5C842 50%,#ff6b00 100%)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"sh2 4s linear 1s infinite, t2glitch 8s ease-in-out 3s infinite",fontFamily:"'Arial Black',system-ui,sans-serif",letterSpacing:"-4px"}}>sachi</div>
          <div style={{fontSize:9,color:"rgba(180,50,255,.6)",letterSpacing:6,fontWeight:700,marginTop:4}}>™</div>
        </div>
        <div className="t2f1" style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:24,background:"rgba(180,50,255,.1)",border:"1px solid rgba(180,50,255,.3)",borderRadius:40,padding:"6px 18px"}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:"#b432ff",animation:"db2 1s ease-in-out infinite"}}/>
          <span style={{color:"rgba(200,100,255,.9)",fontSize:10,fontWeight:800,letterSpacing:3.5,textTransform:"uppercase"}}>Sachi means truth</span>
        </div>
        {SLOGAN.map((s,i)=><div key={i} className={`t2f${i+2}`} style={{fontSize:i===2?24:20,fontWeight:i===2?900:700,marginBottom:i===2?32:4,color:i===2?"#F5C842":i===0?"#fff":"rgba(255,255,255,.5)",letterSpacing:i===2?1:0}}>{s}</div>)}
        <div className="t2f5" style={{fontSize:13,color:"rgba(255,255,255,.25)",marginBottom:12}}>Tap anywhere to enter</div>
        <div className="t2f5" style={{display:"flex",gap:8}}>
          {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:`rgba(180,50,255,${.8-i*.2})`,animation:`db2 1.3s ease-in-out ${i*.25}s infinite`}}/>)}
        </div>
      </div>
    </div>
  );
}

// ── THEME 3: Minimal Gold Luxury ─────────────────────────────────────────────
const LUX_STARS = Array.from({length:40},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:.5+Math.random()*1.2,dur:3+Math.random()*5,delay:Math.random()*8}));

function Theme3({ onEnter, leaving }) {
  return (
    <div onClick={onEnter} style={{position:"fixed",inset:0,zIndex:9999,background:"#080808",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer",opacity:leaving?0:1,transition:"opacity .7s ease"}}>
      <style>{`
        @keyframes t3in{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes t3glow{0%,100%{text-shadow:0 0 40px rgba(245,200,66,.3)}50%{text-shadow:0 0 80px rgba(245,200,66,.7),0 0 120px rgba(255,149,0,.3)}}
        @keyframes sh3{0%{background-position:-400% center}100%{background-position:400% center}}
        @keyframes db3{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes tw3{0%,100%{opacity:.04;transform:scale(.6)}50%{opacity:.6;transform:scale(1.3)}}
        @keyframes t3fi{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes gl3{0%{width:0;opacity:0}100%{width:160px;opacity:1}}
        .t3nm{animation:t3in 1.2s cubic-bezier(.16,1,.3,1) .4s both,t3glow 4s ease-in-out 2s infinite}
        .t3f1{animation:t3fi .8s ease 1.0s both}.t3f2{animation:t3fi .8s ease 1.4s both}
        .t3f3{animation:t3fi .8s ease 1.8s both}.t3f4{animation:t3fi .8s ease 2.2s both}
        .t3f5{animation:t3fi .8s ease 2.6s both}
        .t3gl{animation:gl3 1.2s cubic-bezier(.16,1,.3,1) .8s both}
      `}</style>
      {LUX_STARS.map(s=><div key={s.id} style={{position:"absolute",borderRadius:"50%",background:"#F5C842",width:s.size,height:s.size,left:`${s.x}%`,top:`${s.y}%`,animation:`tw3 ${s.dur}s ease-in-out ${s.delay}s infinite`,pointerEvents:"none"}}/>)}
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,200,66,.04) 0%,transparent 70%)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
      <ApplyBtn bg="transparent" color="#F5C842"/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:10,padding:"0 28px",textAlign:"center",maxWidth:420,width:"100%"}}>
        <div className="t3f1" style={{marginBottom:12,opacity:.45}}>
          <svg width="200" height="36" viewBox="0 0 200 36">
            <defs><linearGradient id="le3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#F5C842" stopOpacity="0"/><stop offset="50%" stopColor="#F5C842"/><stop offset="100%" stopColor="#F5C842" stopOpacity="0"/></linearGradient></defs>
            <polyline points="0,18 30,18 38,6 44,30 50,18 80,18 86,10 92,26 98,18 130,18 138,6 144,30 150,18 200,18" fill="none" stroke="url(#le3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="t3nm" style={{marginBottom:0}}>
          <div style={{fontSize:96,fontWeight:900,lineHeight:.85,background:"linear-gradient(135deg,#c8a800 0%,#F5C842 30%,#fff9e0 55%,#F5C842 75%,#b8960a 100%)",backgroundSize:"400% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"sh3 6s linear 1.5s infinite",fontFamily:"'Arial Black',system-ui,sans-serif",letterSpacing:"-5px"}}>sachi</div>
        </div>
        <div className="t3f1" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,margin:"12px 0 28px"}}>
          <span style={{fontSize:9,color:"rgba(245,200,66,.5)",letterSpacing:6,fontWeight:500}}>™</span>
          <div className="t3gl" style={{height:"1px",background:"linear-gradient(90deg,transparent,#F5C842,transparent)",overflow:"hidden"}}/>
          <span style={{fontSize:11,color:"rgba(245,200,66,.55)",letterSpacing:6,fontWeight:500,textTransform:"uppercase"}}>Sachi means truth</span>
        </div>
        {SLOGAN.map((s,i)=><div key={i} className={`t3f${i+2}`} style={{fontSize:i===2?24:18,fontWeight:i===2?800:400,color:i===2?"#F5C842":"rgba(255,255,255,.55)",marginBottom:i===2?32:6,letterSpacing:i===2?2:1}}>{s}</div>)}
        <div className="t3f5" style={{fontSize:12,color:"rgba(255,255,255,.2)",marginBottom:12,letterSpacing:1,textTransform:"uppercase"}}>Tap anywhere to enter</div>
        <div className="t3f5" style={{display:"flex",gap:10}}>
          {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:`rgba(245,200,66,${.6-i*.15})`,animation:`db3 1.4s ease-in-out ${i*.3}s infinite`}}/>)}
        </div>
      </div>
      <div style={{position:"absolute",inset:16,border:"1px solid rgba(245,200,66,.07)",borderRadius:8,pointerEvents:"none"}}/>
    </div>
  );
}

// ── THEME 4: Cinematic Red / Black ────────────────────────────────────────────
const EMBERS = Array.from({length:24},(_,i)=>({id:i,left:`${Math.random()*100}%`,delay:`${Math.random()*8}s`,duration:`${6+Math.random()*8}s`,size:1+Math.random()*3,drift:(Math.random()-.5)*50}));

function Theme4({ onEnter, leaving }) {
  return (
    <div onClick={onEnter} style={{position:"fixed",inset:0,zIndex:9999,background:"#050000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer",opacity:leaving?0:1,transition:"opacity .7s ease"}}>
      <style>{`
        @keyframes emb4{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:.9}90%{opacity:.2}100%{transform:translateY(-100vh) translateX(var(--drift));opacity:0}}
        @keyframes t4in{0%{opacity:0;transform:scale(1.2)}100%{opacity:1;transform:scale(1)}}
        @keyframes t4fi{0%{opacity:0;transform:translateX(-20px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes t4glow{0%,100%{filter:drop-shadow(0 0 20px rgba(220,20,20,.5))}50%{filter:drop-shadow(0 0 50px rgba(220,20,20,.9)) drop-shadow(0 0 80px rgba(255,80,0,.4))}}
        @keyframes sh4{0%{background-position:-400% center}100%{background-position:400% center}}
        @keyframes db4{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes pr4{0%{transform:scale(1);opacity:.4}100%{transform:scale(3);opacity:0}}
        @keyframes bf4{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .t4nm{animation:t4in 1s cubic-bezier(.16,1,.3,1) .3s both,t4glow 3s ease-in-out 1.5s infinite}
        .t4f1{animation:t4fi .7s ease .8s both}.t4f2{animation:t4fi .7s ease 1.1s both}
        .t4f3{animation:t4fi .7s ease 1.4s both}.t4f4{animation:t4fi .7s ease 1.7s both}
        .t4f5{animation:t4fi .7s ease 2.0s both}
      `}</style>
      {EMBERS.map(e=><div key={e.id} style={{position:"absolute",bottom:-10,left:e.left,pointerEvents:"none","--drift":`${e.drift}px`,animation:`emb4 ${e.duration} ${e.delay} ease-in infinite`}}><div style={{width:e.size,height:e.size,borderRadius:"50%",background:`rgba(${220+Math.random()*35},${Math.random()*60},0,0.9)`}}/></div>)}
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(180,0,0,.12) 0%,transparent 70%)",top:"50%",left:"50%",transform:"translate(-50%,-55%)",pointerEvents:"none"}}/>
      <ApplyBtn bg="linear-gradient(135deg,#dc1414,#ff4500)" color="#fff"/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:10,padding:"0 28px",textAlign:"center",maxWidth:440,width:"100%"}}>
        <div style={{marginBottom:20,position:"relative"}}>
          <div style={{position:"absolute",width:120,height:120,borderRadius:"50%",border:"1px solid rgba(220,20,20,.3)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"pr4 2.8s ease-out 2s infinite"}}/>
          <div style={{position:"absolute",width:120,height:120,borderRadius:"50%",border:"1px solid rgba(220,20,20,.15)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"pr4 2.8s ease-out 3.4s infinite"}}/>
          <div className="t4nm">
            <div style={{fontSize:88,fontWeight:900,lineHeight:.9,background:"linear-gradient(135deg,#ff6b6b 0%,#dc1414 35%,#fff 55%,#dc1414 75%,#ff4500 100%)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"sh4 5s linear 1.5s infinite",fontFamily:"'Arial Black',system-ui,sans-serif",letterSpacing:"-4px"}}>sachi</div>
          </div>
        </div>
        <div className="t4f1" style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:24,background:"rgba(220,20,20,.1)",border:"1px solid rgba(220,20,20,.3)",borderRadius:40,padding:"6px 18px"}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:"#dc1414",animation:"db4 1.1s ease-in-out infinite"}}/>
          <span style={{color:"rgba(255,100,100,.9)",fontSize:10,fontWeight:800,letterSpacing:3.5,textTransform:"uppercase"}}>Sachi means truth</span>
        </div>
        <div className="t4f1" style={{fontSize:9,color:"rgba(220,20,20,.5)",letterSpacing:5,fontWeight:700,marginBottom:20}}>™</div>
        {SLOGAN.map((s,i)=><div key={i} className={`t4f${i+2}`} style={{fontSize:i===2?26:20,fontWeight:i===2?900:700,color:i===2?"#ff4500":i===0?"#fff":"rgba(255,255,255,.45)",marginBottom:i===2?32:4,letterSpacing:i===2?1:0}}>{s}</div>)}
        <div className="t4f5" style={{fontSize:13,color:"rgba(255,255,255,.2)",marginBottom:12}}>Tap anywhere to enter</div>
        <div className="t4f5" style={{display:"flex",gap:8}}>
          {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:`rgba(220,20,20,${.8-i*.2})`,animation:`db4 1.3s ease-in-out ${i*.25}s infinite`}}/>)}
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:3}}><div style={{height:"100%",background:"linear-gradient(90deg,#dc1414,#ff4500,#F5C842,#dc1414)",backgroundSize:"300% 100%",animation:"bf4 3s ease infinite"}}/></div>
    </div>
  );
}

// ── THEME 5: Deep Ocean / Teal ────────────────────────────────────────────────
const BUBBLES = Array.from({length:20},(_,i)=>({id:i,left:`${Math.random()*100}%`,delay:`${Math.random()*10}s`,duration:`${8+Math.random()*10}s`,size:3+Math.random()*8,drift:(Math.random()-.5)*40}));

function Theme5({ onEnter, leaving }) {
  return (
    <div onClick={onEnter} style={{position:"fixed",inset:0,zIndex:9999,background:"linear-gradient(180deg,#000d1a 0%,#001a2e 50%,#000d1a 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer",opacity:leaving?0:1,transition:"opacity .7s ease"}}>
      <style>{`
        @keyframes bub5{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:.6}90%{opacity:.1}100%{transform:translateY(-100vh) translateX(var(--drift));opacity:0}}
        @keyframes t5in{0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes t5fi{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes t5wave{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.05)}}
        @keyframes sh5{0%{background-position:-400% center}100%{background-position:400% center}}
        @keyframes db5{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes glow5{0%,100%{filter:drop-shadow(0 0 20px rgba(0,200,200,.4))}50%{filter:drop-shadow(0 0 50px rgba(0,220,220,.8)) drop-shadow(0 0 80px rgba(0,150,200,.4))}}
        @keyframes pr5{0%{transform:scale(1);opacity:.4}100%{transform:scale(3.5);opacity:0}}
        @keyframes bf5{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .t5nm{animation:t5in 1.1s cubic-bezier(.16,1,.3,1) .4s both,glow5 3.5s ease-in-out 2s infinite}
        .t5f1{animation:t5fi .7s ease .9s both}.t5f2{animation:t5fi .7s ease 1.2s both}
        .t5f3{animation:t5fi .7s ease 1.5s both}.t5f4{animation:t5fi .7s ease 1.8s both}
        .t5f5{animation:t5fi .7s ease 2.1s both}
      `}</style>
      {BUBBLES.map(b=><div key={b.id} style={{position:"absolute",bottom:-20,left:b.left,pointerEvents:"none","--drift":`${b.drift}px`,animation:`bub5 ${b.duration} ${b.delay} ease-in infinite`}}><div style={{width:b.size,height:b.size,borderRadius:"50%",border:"1px solid rgba(0,200,200,.4)",background:"rgba(0,200,200,.05)"}}/></div>)}
      <div style={{position:"absolute",width:600,height:300,background:"radial-gradient(ellipse,rgba(0,150,200,.08) 0%,transparent 70%)",bottom:"10%",left:"50%",transform:"translateX(-50%)",pointerEvents:"none",animation:"t5wave 6s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,180,200,.07) 0%,transparent 70%)",top:"30%",left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}}/>
      <ApplyBtn bg="linear-gradient(135deg,#00c8c8,#0088cc)" color="#000"/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:10,padding:"0 28px",textAlign:"center",maxWidth:440,width:"100%"}}>
        <div style={{marginBottom:20,position:"relative"}}>
          <div style={{position:"absolute",width:110,height:110,borderRadius:"50%",border:"1px solid rgba(0,200,200,.25)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"pr5 3s ease-out 2s infinite"}}/>
          <div style={{position:"absolute",width:110,height:110,borderRadius:"50%",border:"1px solid rgba(0,200,200,.12)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"pr5 3s ease-out 3.5s infinite"}}/>
          <div className="t5nm">
            <div style={{fontSize:88,fontWeight:900,lineHeight:.9,background:"linear-gradient(135deg,#00e5ff 0%,#00c8c8 30%,#fff 55%,#00c8c8 75%,#0088cc 100%)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"sh5 5s linear 1.5s infinite",fontFamily:"'Arial Black',system-ui,sans-serif",letterSpacing:"-4px"}}>sachi</div>
          </div>
        </div>
        <div className="t5f1" style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:8,background:"rgba(0,200,200,.08)",border:"1px solid rgba(0,200,200,.2)",borderRadius:40,padding:"6px 18px"}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:"#00c8c8",animation:"db5 1.2s ease-in-out infinite"}}/>
          <span style={{color:"rgba(0,220,220,.9)",fontSize:10,fontWeight:800,letterSpacing:3.5,textTransform:"uppercase"}}>Sachi means truth</span>
        </div>
        <div className="t5f1" style={{fontSize:9,color:"rgba(0,200,200,.45)",letterSpacing:5,fontWeight:700,marginBottom:24}}>™</div>
        {SLOGAN.map((s,i)=><div key={i} className={`t5f${i+2}`} style={{fontSize:i===2?25:20,fontWeight:i===2?900:600,color:i===2?"#00e5ff":i===0?"rgba(255,255,255,.9)":"rgba(255,255,255,.4)",marginBottom:i===2?32:4,letterSpacing:i===2?2:0}}>{s}</div>)}
        <div className="t5f5" style={{fontSize:13,color:"rgba(255,255,255,.2)",marginBottom:12}}>Tap anywhere to enter</div>
        <div className="t5f5" style={{display:"flex",gap:8}}>
          {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:`rgba(0,200,200,${.7-i*.2})`,animation:`db5 1.3s ease-in-out ${i*.25}s infinite`}}/>)}
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:2}}><div style={{height:"100%",background:"linear-gradient(90deg,#00c8c8,#0088cc,#00e5ff,#00c8c8)",backgroundSize:"300% 100%",animation:"bf5 3s ease infinite"}}/></div>
      {[{top:0,left:0,borderTop:"1.5px solid rgba(0,200,200,.15)",borderLeft:"1.5px solid rgba(0,200,200,.15)"},{top:0,right:0,borderTop:"1.5px solid rgba(0,200,200,.15)",borderRight:"1.5px solid rgba(0,200,200,.15)"},{bottom:0,left:0,borderBottom:"1.5px solid rgba(0,200,200,.15)",borderLeft:"1.5px solid rgba(0,200,200,.15)"},{bottom:0,right:0,borderBottom:"1.5px solid rgba(0,200,200,.15)",borderRight:"1.5px solid rgba(0,200,200,.15)"}].map((s,i)=><div key={i} style={{position:"absolute",width:55,height:55,pointerEvents:"none",...s}}/>)}
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function Landing({ onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const theme = getThemeIndex();

  useEffect(() => {
    const t = setTimeout(() => { setLeaving(true); setTimeout(() => onEnter(), 700); }, 9000);
    return () => clearTimeout(t);
  }, []);

  const go = () => { if (leaving) return; setLeaving(true); setTimeout(() => onEnter(), 700); };

  if (theme === 1) return <Theme2 onEnter={go} leaving={leaving}/>;
  if (theme === 2) return <Theme3 onEnter={go} leaving={leaving}/>;
  if (theme === 3) return <Theme4 onEnter={go} leaving={leaving}/>;
  if (theme === 4) return <Theme5 onEnter={go} leaving={leaving}/>;
  return <Theme1 onEnter={go} leaving={leaving}/>;
}
