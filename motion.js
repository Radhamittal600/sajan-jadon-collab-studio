(() => {
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast=$('#toast');let toastTimer;
function popToast(text='✦ Nice click!'){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1100)}
// Smooth reveal on scroll
if('IntersectionObserver' in window&&!reduce){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}}),{threshold:.13});$$('.reveal,.work-card,.process-card').forEach(el=>io.observe(el))}
else $$('.reveal,.work-card,.process-card').forEach(el=>el.classList.add('in-view'));
// Mouse glow and 3D tilt, disabled for touch/reduced motion
const glow=$('#cursorGlow');if(glow&&!reduce&&matchMedia('(pointer:fine)').matches){window.addEventListener('pointermove',e=>{glow.style.transform=`translate3d(${e.clientX-130}px,${e.clientY-130}px,0)`},{passive:true})}
if(!reduce&&matchMedia('(pointer:fine)').matches){$$('.tilt-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*7}deg) rotateY(${x*8}deg) translateY(-4px)`});card.addEventListener('pointerleave',()=>card.style.transform='')})}
// Click ripple and shine effects
document.addEventListener('click',e=>{const target=e.target.closest('button,a,.work-card,.work-media');if(!target)return;const r=target.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const ripple=document.createElement('span');ripple.className='click-ripple';ripple.style.left=x+'px';ripple.style.top=y+'px';target.appendChild(ripple);setTimeout(()=>ripple.remove(),750);target.classList.remove('click-pop');void target.offsetWidth;target.classList.add('click-pop');setTimeout(()=>target.classList.remove('click-pop'),500);if(target.matches('.button,.nav-cta,.filter'))popToast('✦ Spark activated')});
// Image click lightbox
const lightbox=$('#lightbox');if(lightbox){const img=$('img',lightbox),cap=$('.lightbox-caption',lightbox);$$('.work-card .work-media img').forEach(image=>image.addEventListener('click',()=>{img.src=image.src;img.alt=image.alt;cap.textContent=image.alt;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll')}));const close=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')};$('.lightbox-close',lightbox).addEventListener('click',close);lightbox.addEventListener('click',e=>{if(e.target===lightbox)close()});window.addEventListener('keydown',e=>{if(e.key==='Escape')close()})}
// filters cover both static demo cards and Appwrite cards
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.toggle('active',b===btn));const f=btn.dataset.filter;$$('.work-card').forEach(card=>{const kind=card.dataset.kind||card.querySelector('.work-type')?.textContent.toLowerCase();const show=f==='all'||(f==='image'&&(kind==='image'||kind?.includes('photo')||kind?.includes('visual')))||(f==='video'&&kind?.includes('video'))||(f==='youtube'&&kind?.includes('youtube'));card.style.display=show?'':'none'})}));
// Parallax hero layers and scroll progress
const hero=$('.hero');if(hero&&!reduce&&matchMedia('(pointer:fine)').matches){window.addEventListener('scroll',()=>{const y=window.scrollY;hero.style.setProperty('--hero-parallax',Math.min(y*.12,75)+'px')},{passive:true})}
const form=$('#collabForm');form?.addEventListener('submit',e=>{setTimeout(()=>{const s=$('#formStatus');if(s&&s.textContent.includes('not connected'))popToast('✦ Cloud setup is next')},30)});
$('#year')&&($('#year').textContent=new Date().getFullYear());
})();