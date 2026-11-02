type Option={label:string;value:string};
export function initFinderChoices(){
 document.querySelectorAll<HTMLElement>('[data-choice]').forEach(root=>{
  const input=root.querySelector<HTMLInputElement>('input')!;const toggle=root.querySelector<HTMLButtonElement>('button')!;const panel=root.querySelector<HTMLElement>('[role="listbox"]')!;const fixed=root.dataset.fixed==='true';let options=JSON.parse(root.dataset.options||'[]') as Option[];let active=-1;let matches:Option[]=[];let committing=false;
  const close=()=>{panel.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');active=-1;};
  const select=(option:Option)=>{input.value=option.label;input.dataset.value=option.value;close();committing=true;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));committing=false;input.focus();};
  const draw=(filter:boolean)=>{if(input.disabled)return;matches=options.filter(o=>!filter||o.label.toLowerCase().includes(input.value.toLowerCase()));active=-1;input.removeAttribute('aria-activedescendant');panel.replaceChildren();
   matches.forEach((o,i)=>{const button=document.createElement('div');button.className='finder-choice-option';button.role='option';button.id=input.id+'-option-'+i;button.setAttribute('aria-selected',String(o.value===input.dataset.value));button.textContent=o.label;button.addEventListener('mousedown',e=>e.preventDefault());button.addEventListener('click',()=>select(o));panel.appendChild(button);});
   if(!matches.length){const empty=document.createElement('div');empty.className='finder-choice-empty';empty.textContent=fixed?'No options available':'Not listed? You can use the name you typed.';panel.appendChild(empty);}panel.hidden=false;input.setAttribute('aria-expanded','true');};
  toggle.addEventListener('click',()=>{if(!panel.hidden){close();return;}input.focus();draw(false);});
  input.addEventListener('click',()=>draw(false));
  input.addEventListener('input',()=>{if(!fixed){input.dataset.value=input.value;if(!committing)draw(true);}});
  input.addEventListener('keydown',e=>{if(e.key==='Escape'){close();return;}if(e.key==='Tab'){close();return;}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(panel.hidden)draw(false);if(!matches.length)return;active=e.key==='ArrowDown'?Math.min(active+1,matches.length-1):Math.max(active-1,0);Array.from(panel.children).forEach((el,i)=>el.setAttribute('aria-selected',String(i===active)));const row=panel.children[active] as HTMLElement;input.setAttribute('aria-activedescendant',row.id);row.scrollIntoView({block:'nearest'});}else if(e.key==='Enter'&&!panel.hidden){e.preventDefault();if(active>=0&&matches[active])select(matches[active]);else close();}});
  document.addEventListener('pointerdown',e=>{if(!root.contains(e.target as Node))close();});
  input.addEventListener('blur',()=>{close();});
  root.addEventListener('choice-options',((e:CustomEvent<Option[]>)=>{options=e.detail;input.disabled=false;toggle.disabled=false;close();}) as EventListener);
 });
}
export function updateChoiceOptions(input:HTMLInputElement,options:Option[]){input.closest('[data-choice]')!.dispatchEvent(new CustomEvent('choice-options',{detail:options}));}
