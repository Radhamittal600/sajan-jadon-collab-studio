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
const lightbox=document.getElementById('lightbox'),lbImage=document.getElementById('lightboxImage');
document.querySelectorAll('.photo-card').forEach(card=>{
 card.addEventListener('click',()=>{const img=card.querySelector('img');if(!img||!img.src||card.classList.contains('missing-photo'))return;lbImage.src=img.src;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';});
 card.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-3px)`;});
 card.addEventListener('pointerleave',()=>card.style.transform='');
});
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.getElementById('lightboxClose').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});
const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';},{passive:true});
const stage=document.getElementById('heroStage');
stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform=`rotateY(${x*5}deg) rotateX(${-y*5}deg)`;});
stage.addEventListener('pointerleave',()=>stage.style.transform='');
document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.12}px)`;}));
document.querySelectorAll('.magnetic').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));
document.querySelectorAll('.button').forEach(btn=>btn.addEventListener('click',e=>{const r=btn.getBoundingClientRect(),rip=document.createElement('span');rip.style.cssText=`position:absolute;left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;width:8px;height:8px;border-radius:50%;background:#fff9;transform:translate(-50%,-50%);animation:ripple .65s ease-out forwards;pointer-events:none`;btn.appendChild(rip);setTimeout(()=>rip.remove(),700)}));
const style=document.createElement('style');style.textContent='@keyframes ripple{to{width:240px;height:240px;opacity:0}}';document.head.appendChild(style);
