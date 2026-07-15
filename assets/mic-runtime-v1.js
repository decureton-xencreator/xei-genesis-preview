(()=>{
'use strict';
let active=null,watchdog=null,stream=null;
const stopStream=()=>{try{stream?.getTracks().forEach(t=>t.stop())}catch{}stream=null};
const toast=msg=>{const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),3200)};
const resetUI=(button,orb)=>{clearTimeout(watchdog);watchdog=null;try{active?.stop()}catch{}active=null;stopStream();if(button){button.disabled=false;button.textContent='Use Microphone';button.removeAttribute('aria-busy')}orb?.classList.remove('listening');};
async function primePermission(){
  if(!navigator.mediaDevices?.getUserMedia)return true;
  try{stream=await navigator.mediaDevices.getUserMedia({audio:true});return true}
  catch(err){toast(err?.name==='NotAllowedError'?'Microphone permission was not granted. You can type your answer instead.':'The microphone could not start. You can type your answer instead.');return false}
}
async function begin(button,target){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const input=document.getElementById(target);
  const orb=document.getElementById('orb');
  if(!input)return;
  window.XVR?.stop?.();
  if(!SR){toast('Safari speech capture is unavailable on this device. Type your answer and continue.');input.focus();return}
  resetUI(button,orb);
  button.disabled=true;button.textContent='Preparing…';button.setAttribute('aria-busy','true');
  const permitted=await primePermission();
  if(!permitted){resetUI(button,orb);input.focus();return}
  stopStream();
  const recognition=new SR();active=recognition;
  recognition.lang='en-US';recognition.interimResults=true;recognition.continuous=false;recognition.maxAlternatives=1;
  let heard='';let finished=false;
  const finish=(message)=>{if(finished)return;finished=true;resetUI(button,orb);if(message)toast(message);if(heard.trim())input.focus();};
  recognition.onstart=()=>{button.disabled=false;button.textContent='Stop Listening';button.setAttribute('aria-busy','true');orb?.classList.add('listening');toast('Listening… Speak naturally, then pause.');watchdog=setTimeout(()=>{try{recognition.stop()}catch{}finish(heard?'I captured your answer. Review it, then continue.':'I did not hear anything. Type your answer or try again.');},15000)};
  recognition.onresult=e=>{let text='';for(let i=0;i<e.results.length;i++)text+=e.results[i][0].transcript;heard=text.trim();input.value=heard;input.dispatchEvent(new Event('input',{bubbles:true}));};
  recognition.onspeechend=()=>{try{recognition.stop()}catch{}};
  recognition.onend=()=>finish(heard?'I captured your answer. Review it, then continue.':'I did not hear anything. Type your answer or try again.');
  recognition.onerror=e=>{const map={not_allowed:'Microphone access was blocked. Type your answer instead.','audio-capture':'No microphone was available. Type your answer instead.',network:'Speech capture lost its connection. Your typed answer still works.',no_speech:'I did not hear anything. Try again or type your answer.',aborted:'Microphone capture stopped.'};finish(map[e.error]||'Microphone capture could not complete. Type your answer instead.');};
  button.onclick=()=>{try{recognition.stop()}catch{};finish(heard?'I captured your answer. Review it, then continue.':'Listening stopped. You can type your answer.');};
  try{recognition.start()}catch{finish('Microphone capture could not start. Type your answer instead.')}
}
document.addEventListener('click',e=>{const button=e.target.closest('#intentListen,#listen');if(!button)return;e.preventDefault();e.stopImmediatePropagation();begin(button,button.id==='intentListen'?'intent':'principle');},true);
window.addEventListener('pagehide',()=>resetUI());
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetUI()});
})();