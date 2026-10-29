const body=document.body;
const modeToggle=document.getElementById('modeToggle');
const modeLabel=modeToggle.querySelector('.mode-label');
const modeIcon=modeToggle.querySelector('.mode-icon');
modeToggle.addEventListener('click',()=>{
  body.classList.toggle('light');
  const light=body.classList.contains('light');
  modeLabel.textContent=light?'DARK MODE':'LIGHT MODE';
  modeIcon.textContent=light?'☾':'☼';
  document.querySelector('meta[name="theme-color"]').content=light?'#f4f1ff':'#080812';
  localStorage.setItem('sajan-theme',light?'light':'dark');
});
if(localStorage.getItem('sajan-theme')==='light'){body.classList.add('light');modeLabel.textContent='DARK MODE';modeIcon.textContent='☾';}
const menuToggle=document.getElementById('menuToggle'),nav=document.querySelector('.topbar nav');
menuToggle.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const clickFlash=document.getElementById('clickFlash');
const effectToast=document.getElementById('effectToast');
let toastTimer;
function showEffect(x,y,label='✦ EFFECT ACTIVATED'){
  clickFlash.style.setProperty('--fx-x',x+'px');
  clickFlash.style.setProperty('--fx-y',y+'px');
  clickFlash.classList.remove('active'); void clickFlash.offsetWidth; clickFlash.classList.add('active');
  effectToast.textContent=label; effectToast.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>effectToast.classList.remove('show'),1050);
}
document.querySelectorAll('.photo-card').forEach(card=>{
 card.addEventListener('click',e=>{
   card.classList.remove('effect-hit'); void card.offsetWidth; card.classList.add('effect-hit');
   const shine=card.querySelector('.shine');
   if(shine){shine.style.animation='none';void shine.offsetWidth;shine.style.animation='shineSweep .9s ease-out';}
   showEffect(e.clientX,e.clientY,'✦ SAJAN PHOTO SHINE');
   setTimeout(()=>card.classList.remove('effect-hit'),900);
 });
 card.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-3px)`;});
 card.addEventListener('pointerleave',()=>card.style.transform='');
});
document.addEventListener('click',e=>{
 const target=e.target.closest('a,button,.feature-list div,.creator-credit,.brand');
 if(!target||target.classList.contains('photo-card'))return;
 showEffect(e.clientX,e.clientY,'✦ INTERACTION EFFECT');
});
const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';},{passive:true});
const stage=document.getElementById('heroStage');
stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform=`rotateY(${x*5}deg) rotateX(${-y*5}deg)`;});
stage.addEventListener('pointerleave',()=>stage.style.transform='');
document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.12}px)`;}));
document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));
document.querySelectorAll('.button').forEach(btn=>btn.addEventListener('click',e=>{const r=btn.getBoundingClientRect(),rip=document.createElement('span');rip.style.cssText=`position:absolute;left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;width:8px;height:8px;border-radius:50%;background:#fff9;transform:translate(-50%,-50%);animation:ripple .65s ease-out forwards;pointer-events:none`;btn.appendChild(rip);setTimeout(()=>rip.remove(),700)}));
const style=document.createElement('style');style.textContent='@keyframes ripple{to{width:240px;height:240px;opacity:0}}';document.head.appendChild(style);

// Social stats entrance effect: labels stay honest until a real authorized data source is connected.
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('stat-visible');
      statObserver.unobserve(entry.target);
    }
  });
}, {threshold: .2});
document.querySelectorAll('.social-stat-card').forEach(card => statObserver.observe(card));

/* V6: touch-friendly neon sparks for every tap/click. */
(()=>{
 const overlay=document.getElementById('fxOverlay');
 const toast=document.getElementById('fxToast');
 if(!overlay||!toast)return;
 let toastTimer;
 function burst(x,y,label){
   overlay.classList.remove('fx-flash'); void overlay.offsetWidth; overlay.classList.add('fx-flash');
   overlay.style.setProperty('--tap-x',x+'px'); overlay.style.setProperty('--tap-y',y+'px');
   for(let i=0;i<16;i++){
     const s=document.createElement('i');
     const angle=(Math.PI*2*i/16)+(Math.random()-.5)*.24;
     const distance=28+Math.random()*70;
     s.className='neon-spark';
     s.style.left=x+'px';s.style.top=y+'px';
     s.style.setProperty('--dx',Math.cos(angle)*distance+'px');
     s.style.setProperty('--dy',Math.sin(angle)*distance+'px');
     s.style.setProperty('--delay',(Math.random()*90)+'ms');
     overlay.appendChild(s);setTimeout(()=>s.remove(),780);
   }
   toast.textContent=label||'✦ NEON EFFECT';
   toast.classList.remove('show');void toast.offsetWidth;toast.classList.add('show');
   clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),900);
 }
 document.addEventListener('pointerdown',e=>{
   const target=e.target.closest('a,button,.photo-card,.social-stat-card,.feature-list div,.creator-credit,.brand');
   if(!target)return;
   const label=target.classList.contains('photo-card')?'✦ PHOTO NEON SHINE':
     target.classList.contains('mode-toggle')?'✦ THEME SHIFT':
     target.classList.contains('social-stat-card')?'✦ SOCIAL GLOW':'✦ NEON SPARK';
   burst(e.clientX,e.clientY,label);
   target.classList.remove('tap-neon-hit');void target.offsetWidth;target.classList.add('tap-neon-hit');
   setTimeout(()=>target.classList.remove('tap-neon-hit'),750);
 },{passive:true});
})();

/* V7 cinematic intro + lightweight scroll-reactive particle field */
(()=>{
 const loader=document.getElementById('introLoader');
 const hideLoader=()=>{if(loader)loader.classList.add('done');document.body.classList.add('page-ready')};
 window.addEventListener('load',()=>setTimeout(hideLoader,950),{once:true});
 setTimeout(hideLoader,2200);
 const canvas=document.getElementById('cinematicCanvas'),ctx=canvas&&canvas.getContext('2d');
 const progress=document.getElementById('scrollProgress');
 if(!canvas||!ctx)return;
 let w=0,h=0,dpr=1,particles=[],scrollY=window.scrollY||0,raf=0;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function resize(){
   dpr=Math.min(window.devicePixelRatio||1,1.6);w=window.innerWidth;h=window.innerHeight;
   canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);
   canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
   const count=Math.min(75,Math.max(28,Math.floor(w*h/17000)));
   particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,z:.25+Math.random()*.9,r:.5+Math.random()*1.8,phase:Math.random()*6.28,speed:.12+Math.random()*.45}));
 }
 function draw(){
   raf=0;ctx.clearRect(0,0,w,h);
   const sy=window.scrollY||0,depth=Math.min(1,sy/Math.max(1,document.documentElement.scrollHeight-h));
   if(progress)progress.style.width=(depth*100)+'%';
   document.documentElement.style.setProperty('--hero-parallax',(-sy*.12)+'px');
   document.documentElement.style.setProperty('--hero-scale',(1+Math.min(.08,sy/8000)).toFixed(3));
   document.querySelectorAll('.work,.social-stats,.about').forEach((el,i)=>{
     const r=el.getBoundingClientRect();
     el.style.setProperty('--section-depth',((r.top-h*.5)*-.035)+'px');
   });
   for(const p of particles){
     const y=(p.y-sy*p.speed*.22+h*3)%(h*1.25);
     const x=p.x+Math.sin(performance.now()*.00035+p.phase)*12;
     const alpha=.18+.38*(.5+.5*Math.sin(performance.now()*.001+p.phase));
     ctx.beginPath();ctx.fillStyle=`rgba(${p.phase%2>1?'88,230,244':'174,137,255'},${alpha})`;ctx.shadowBlur=7*p.z;ctx.shadowColor=p.phase%2>1?'#58e6f4':'#a879ff';ctx.arc(x,y,p.r*p.z,0,Math.PI*2);ctx.fill();
   }
   ctx.shadowBlur=0;
   if(!reduce)raf=requestAnimationFrame(draw);
 }
 function requestDraw(){if(!raf)raf=requestAnimationFrame(draw)}
 window.addEventListener('resize',()=>{resize();requestDraw()},{passive:true});
 window.addEventListener('scroll',requestDraw,{passive:true});
 resize();draw();
})();

if('scrollRestoration' in history) history.scrollRestoration='manual'; window.addEventListener('pageshow',()=>{if(!location.hash) window.scrollTo(0,0)});

/* V9: scroll camera, bento tilt, horizontal rail, mask reveal, procedural 3D particles */
(()=>{
 const rail=document.getElementById('cinemaRail'),railProgress=document.getElementById('railProgress');
 if(rail){
  const panels=[...rail.querySelectorAll('.rail-panel')];
  const updateRail=()=>{
   const max=Math.max(1,rail.scrollWidth-rail.clientWidth);
   if(railProgress)railProgress.style.width=(rail.scrollLeft/max*100)+'%';
   const center=rail.getBoundingClientRect().left+rail.clientWidth/2;
   panels.forEach(p=>{const r=p.getBoundingClientRect();p.classList.toggle('is-active',Math.abs((r.left+r.width/2)-center)<r.width*.62)});
  };
  rail.addEventListener('scroll',updateRail,{passive:true});window.addEventListener('resize',updateRail,{passive:true});updateRail();
  // Vertical page scroll drives the horizontal story rail, while native horizontal swipe remains available.
  let lastY=window.scrollY;
  window.addEventListener('wheel',e=>{
   if(Math.abs(e.deltaY)<Math.abs(e.deltaX)*1.2)return;
   const r=rail.getBoundingClientRect();
   if(r.top<window.innerHeight*.72&&r.bottom>window.innerHeight*.25&&Math.abs(e.deltaY)>0){
    rail.scrollLeft+=e.deltaY*.72;updateRail();
   }
   lastY=window.scrollY;
  },{passive:true});
 }
 const revealNodes=document.querySelectorAll('.section-head h2,.cinema-rail-head h2,.about h2,.collab-panel h2,.photo-card,.social-stat-card');
 revealNodes.forEach(n=>n.setAttribute('data-mask-reveal',''));
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('mask-shown');io.unobserve(e.target)}}),{threshold:.15});
 revealNodes.forEach(n=>io.observe(n));
 // Pointer tilt on cards (no hover dependency for touch devices).
 document.querySelectorAll('.photo-card,.social-stat-card,.rail-panel').forEach(card=>{
  card.addEventListener('pointermove',e=>{
   if(e.pointerType==='touch')return;
   const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   card.style.transform=`perspective(1100px) rotateY(${x*5}deg) rotateX(${-y*4}deg) translateY(-3px)`;
  });
  card.addEventListener('pointerleave',()=>{card.style.transform=''});
 });
 // Procedural particle morph: points move between a loose sphere and a spiral/text-like band as page scrolls.
 const c=document.getElementById('ultraCanvas'),ctx=c&&c.getContext('2d');
 if(!c||!ctx)return;
 let w=0,h=0,dpr=1,pts=[],raf=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function resize(){
  w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);
  c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=Math.min(130,Math.max(55,Math.floor(w*h/9500)));
  pts=Array.from({length:count},(_,i)=>({a:Math.random()*Math.PI*2,b:Math.random()*Math.PI,r:40+Math.random()*Math.min(w,h)*.42,s:Math.random()*6.28,i}));
 }
 function frame(t){
  raf=0;ctx.clearRect(0,0,w,h);
  const maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const p=scrollY/maxScroll;
  const cx=w*(.5+Math.sin(p*5)*.12),cy=h*(.42+Math.cos(p*4)*.1);
  for(const q of pts){
   const morph=(Math.sin(p*Math.PI*5+q.s)+1)/2;
   const angle=q.a+t*.00008*(q.i%2?1:-1)+p*2.4;
   const sphereX=Math.cos(angle)*Math.sin(q.b)*q.r;
   const sphereY=Math.cos(q.b)*q.r;
   const bandX=(q.i%17-8)*10+Math.sin(q.s+t*.0007)*24;
   const bandY=(q.i%9-4)*8;
   const x=cx+sphereX*(1-morph)+bandX*morph;
   const y=cy+sphereY*(1-morph)+bandY*morph;
   const alpha=.08+.26*(.5+.5*Math.sin(t*.001+q.s));
   ctx.beginPath();ctx.fillStyle=q.i%3===0?`rgba(100,235,255,${alpha})`:`rgba(178,137,255,${alpha})`;
   ctx.shadowBlur=7;ctx.shadowColor=q.i%3===0?'#58e6f4':'#a879ff';ctx.arc(x,y, .55+(q.i%4)*.24,0,Math.PI*2);ctx.fill();
  }
  ctx.shadowBlur=0;
  if(!reduced)raf=requestAnimationFrame(frame);
 }
 addEventListener('resize',()=>{resize();if(!raf)raf=requestAnimationFrame(frame)},{passive:true});
 addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(frame)},{passive:true});
 resize();frame(0);
})();
