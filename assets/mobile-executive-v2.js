(()=>{
'use strict';
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const companies=['Artcraft Kitchen & Design','A Cut Above Design Stone & Marble','B & G Construction / Restoration','Elite Siding & Roofing','Elite Outdoor Designs','Checkmate Adjustment Services','Biotile Panamá','Renfro Pro','Another Checkmate company'];
const toast=msg=>{const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),3800)};
function stopLegacyRecognition(){try{window.XVR?.stop?.()}catch{}try{window.recognition?.abort?.()}catch{}}
function prepareNativeDictation(button,target){
 const input=document.getElementById(target);if(!input)return;
 stopLegacyRecognition();
 input.focus({preventScroll:false});
 try{input.setSelectionRange(input.value.length,input.value.length)}catch{}
 button.textContent='Keyboard Mic Ready';
 button.classList.add('green');
 toast('Tap the microphone on the iPhone keyboard, speak naturally, then tap Done. Your words will stay here for review.');
 setTimeout(()=>{button.textContent='Use iPhone Dictation';button.classList.remove('green')},5500);
}
function interceptMic(e){
 const button=e.target.closest('#intentListen,#listen');if(!button||!isIOS)return;
 e.preventDefault();e.stopImmediatePropagation();
 prepareNativeDictation(button,button.id==='intentListen'?'intent':'principle');
}
document.addEventListener('click',interceptMic,true);
function relabel(){
 if(!isIOS)return;
 const a=document.getElementById('intentListen'),b=document.getElementById('listen');
 if(a){a.textContent='Use iPhone Dictation';a.setAttribute('aria-label','Focus the answer field, then use the microphone on the iPhone keyboard')}
 if(b){b.textContent='Use iPhone Dictation';b.setAttribute('aria-label','Focus the principle field, then use the microphone on the iPhone keyboard')}
}
const observer=new MutationObserver(relabel);observer.observe(document.getElementById('stage'),{childList:true,subtree:true});relabel();
function modal(){
 let el=document.getElementById('companyModal');if(el)return el;
 el=document.createElement('div');el.id='companyModal';el.className='company-modal';el.innerHTML=`<div class="company-sheet" role="dialog" aria-modal="true" aria-labelledby="companyTitle"><button class="company-close" aria-label="Close">×</button><div class="eyebrow">Living Company Blueprint Session</div><h2 id="companyTitle">Which company should Xen enter first?</h2><p class="lead">Choose one company. This does not begin work or create a commitment—it records where you would want the next conversation to start.</p><div class="company-grid">${companies.map((c,i)=>`<button class="company-choice" data-company="${c}">${c}</button>`).join('')}</div><div id="otherCompanyWrap" hidden><label class="eyebrow" for="otherCompany">Company name</label><input id="otherCompany" class="company-input" placeholder="Enter company name"></div><button id="confirmCompany" class="btn green company-confirm" disabled>Continue with this company</button><p class="company-note">Xen will use this selection to frame the next Living Company Blueprint Session.</p></div>`;
 document.body.appendChild(el);
 el.querySelector('.company-close').onclick=()=>el.classList.remove('show');
 el.addEventListener('click',ev=>{if(ev.target===el)el.classList.remove('show')});
 let selected='';
 el.querySelectorAll('.company-choice').forEach(btn=>btn.onclick=()=>{
  el.querySelectorAll('.company-choice').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');selected=btn.dataset.company;
  const other=el.querySelector('#otherCompanyWrap');other.hidden=selected!=='Another Checkmate company';
  if(!other.hidden)setTimeout(()=>el.querySelector('#otherCompany').focus(),120);
  el.querySelector('#confirmCompany').disabled=false;
 });
 el.querySelector('#confirmCompany').onclick=()=>{
  if(selected==='Another Checkmate company')selected=el.querySelector('#otherCompany').value.trim();
  if(!selected)return toast('Enter the company name first.');
  try{state.selectedCompany=selected}catch{}
  el.querySelector('.company-sheet').innerHTML=`<div class="eyebrow">Selection remembered</div><h2>${selected}</h2><p class="lead">This is where the next Living Company Blueprint Session will begin: mapping what the company knows, where knowledge is vulnerable, and what should become Living Infrastructure first.</p><div class="company-result"><span>Selected company</span><strong>${selected}</strong></div><button id="finishSelection" class="btn green">Return to the Premiere</button>`;
  el.querySelector('#finishSelection').onclick=()=>{el.classList.remove('show');toast(`${selected} selected for exploration`);window.speak?.(`Understood. We will begin with ${selected}.`,{})};
 };
 return el;
}
document.addEventListener('click',e=>{
 const btn=e.target.closest('#discovery');if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();stopLegacyRecognition();modal().classList.add('show');
},true);
})();