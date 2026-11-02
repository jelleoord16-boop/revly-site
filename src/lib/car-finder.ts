import { updateChoiceOptions } from './finder-choice';
export function initCarFinder() {
 const form=document.querySelector<HTMLFormElement>('#model-finder');if(!form)return;
 const catalogue=JSON.parse(form.dataset.catalogue!) as {make:string;models:string[]}[];
 const input=(id:string)=>document.getElementById(id) as HTMLInputElement;
 const make=input('finder-make');
 const model=input('finder-model');const unit=document.querySelector<HTMLSelectElement>('#finder-unit')!;
 let lastMake='';
 make.addEventListener('input',()=>{const name=make.value.trim();if(name===lastMake)return;lastMake=name;model.value='';model.placeholder=name?'Choose or type a model':'Choose a make first';updateChoiceOptions(model,(catalogue.find(m=>m.make.toLowerCase()===name.toLowerCase())?.models||[]).map(name=>({value:name,label:name})));model.disabled=!name;const toggle=model.parentElement!.querySelector('button') as HTMLButtonElement;toggle.disabled=!name;});

 const node=(tag:string,cls:string,text?:string)=>{const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 form.addEventListener('submit',e=>{
  e.preventDefault();const errors:string[]=[];const makeName=make.value.trim();const modelName=model.value.trim();
  if(!makeName||!modelName)errors.push('Choose or enter your make and model.');
  const raw=input('finder-distance').value.trim();const digits=raw.replace(/[ ,\.]/g,'');
  if(raw&&!/^(?:\d+|\d{1,3}(?:[ ,. ]\d{3})+)$/.test(raw))errors.push('Enter the odometer as a positive whole number.');
  const distance=raw?Number(digits):null;
  const distanceKm=distance===null?null:distance*(unit.value==='mi'?1.609344:1);
  if(distanceKm!==null&&distanceKm>3000000)errors.push('Check the odometer. This preview supports up to 3,000,000 km.');
  const error=document.querySelector<HTMLElement>('#finder-error')!;error.textContent=errors.join(' ');if(errors.length)return;
  const powertrain=input('finder-fuel');const fuel=powertrain.dataset.value||'unknown';const fuelLabel=powertrain.value;const result=document.createDocumentFragment();
  const card=node('section','garage-card');card.appendChild(node('div','garage-name',makeName+' '+modelName));
  card.appendChild(node('div','garage-sub',[fuel!=='unknown'?fuelLabel:null].filter(Boolean).join(' · ')||'Vehicle details entered by you'));
  const bottom=node('div','garage-bottom');bottom.appendChild(node('div','garage-odo',distance===null?'Mileage not entered':distance.toLocaleString('en-GB')+' '+(unit.value==='mi'?'miles':'km')));card.appendChild(bottom);result.appendChild(card);
  const group=(title:string,rows:[string,string][])=>{result.appendChild(node('h2','check-h2',title));const container=node('div','rows');rows.forEach(([heading,text])=>{const row=node('div','row');const content=node('div','');content.append(node('div','row-title',heading),node('div','row-sub',text));row.appendChild(content);container.appendChild(row);});result.appendChild(container);};
  const reminderRows:[string,string][]=[];
  reminderRows.push(['Your local vehicle inspection','In the app, add a reminder using the inspection date that applies in your country.']);
  reminderRows.push(['Tyres and seasonal checks','Record tyre age, condition and seasonal changes. Weather-based reminders require location and settings in the app.']);
  group('Reminders for your car',reminderRows);
  const maintenance:[string,string][]=[];
  if(fuel==='electric')maintenance.push(['Electric-vehicle maintenance','Record checks for brakes, tyres, coolant and cabin filters according to your handbook. No engine-oil or timing-belt reminder is shown.']);
  else if(fuel!=='unknown'&&fuel!=='other'){maintenance.push(['Service and engine oil','Record the last service, date and odometer. Set the next interval from your handbook. Mileage alone cannot tell us when a service is due.']);maintenance.push(['Timing belt or chain','Check which system your engine uses and its manufacturer schedule. The catalogue does not identify engine-specific replacement intervals.']);}
  else maintenance.push(['Your service schedule','Choose the powertrain and record your maintenance history to set suitable reminders. Follow your handbook or ask your garage.']);
  maintenance.push(['Brake fluid and tyres','Keep a record of inspections and replacements. Maintenance reminders need the last service date and the interval you choose.']);
  group('Maintenance to keep track of',maintenance);
  if(distance!==null){const step=50000;const next=(Math.floor(distance/step)+1)*step;const label=unit.value==='mi'?'miles':'km';group('Your next milestone',[[next.toLocaleString('en-GB')+' '+label,`${(next-distance).toLocaleString('en-GB')} ${label} to go, based on your entered odometer.`]]);}
  result.appendChild(node('p','notice','This overview uses your entries and general guidance. It is not a diagnostic report, manufacturer service schedule, recall lookup or record of completed maintenance.'));
  const action=node('a','btn btn-primary','See the app') as HTMLAnchorElement;action.href='/en/app/';result.appendChild(action);
  document.querySelector('#finder-result')!.replaceChildren(result);
  if(innerWidth<900)document.querySelector('#finder-result')!.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
 });
}
