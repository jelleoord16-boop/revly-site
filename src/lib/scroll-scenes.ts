// Scroll drives only transforms and the current screenshot; native scrolling stays intact.
const hero=document.querySelector<HTMLElement>('.hero:has(.hero-app)');
const tour=document.querySelector<HTMLElement>('.tour-chapters');
const chapters=Array.from(document.querySelectorAll<HTMLElement>('.tour-chapter'));
const preview=document.querySelector<HTMLImageElement>('[data-sticky-screen]');
const caption=document.querySelector<HTMLElement>('[data-sticky-caption]');
const desktop=matchMedia('(min-width: 901px)');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let pending=false,activeSource='',request=0;
function render(){
 pending=false;
 const enabled=desktop.matches&&!reduced.matches;
 document.documentElement.classList.toggle('scroll-scenes',enabled);
 const vh=innerHeight;
 if(hero){
  if(reduced.matches){hero.style.removeProperty('--scene');}
  else {
   const rect=(desktop.matches?hero:hero.querySelector<HTMLElement>('.hero-app')!).getBoundingClientRect();
   const progress=desktop.matches?-rect.top/Math.max(1,rect.height-vh):(vh*.85-rect.top)/(vh*.85+rect.height*.25);
   hero.style.setProperty('--scene',String(Math.max(0,Math.min(1,progress))));
  }
 }
 if(!enabled)return;
 if(!tour||!preview)return;
 const bounds=chapters.map(el=>({el,rect:el.getBoundingClientRect()}));
 const current=bounds.reduce((best,item)=>Math.abs(item.rect.top+item.rect.height/2-vh/2)<Math.abs(best.rect.top+best.rect.height/2-vh/2)?item:best,bounds[0]);
 if(!current)return;
 const images=Array.from(current.el.querySelectorAll<HTMLImageElement>('.tour-shot img'));
 const image=images[images.length>1&&current.rect.top< -current.rect.height*.12?1:0];
 if(!image)return;
 const source=image.getAttribute('src')!;
 if(source===activeSource)return;
 activeSource=source;const token=++request;
 const loader=new Image();loader.src=source;
 loader.decode().then(()=>{
  if(token!==request||!desktop.matches||reduced.matches)return;
  preview.src=source;preview.alt=image.alt;
  caption!.textContent=image.closest('figure')!.querySelector('figcaption')!.textContent;
  preview.animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'});
  chapters.forEach(el=>el.classList.toggle('scene-active',el===current.el));
  document.querySelectorAll<HTMLElement>('[data-scene-link]').forEach(el=>el.classList.toggle('scene-active',el.dataset.sceneLink===current.el.id));
 }).catch(()=>{activeSource='';});
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(render);}}
if(hero||tour){addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});desktop.addEventListener('change',schedule);reduced.addEventListener('change',()=>{activeSource='';schedule();});schedule();}
