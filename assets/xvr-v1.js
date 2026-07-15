(()=>{
  'use strict';
  const synth=window.speechSynthesis;
  if(!synth)return;

  const XVR={
    voice:null,
    token:0,
    timers:new Set(),
    aliases:[
      [/\bBDC\b/g,'B D C'],[/\bXenOS\b/g,'Zen O S'],[/\bXen\b/g,'Zen'],[/\bVianka\b/g,'Vee-ahn-kah'],[/\bMarisol\b/g,'Mah-ree-sol']
    ],
    stop(){
      this.token++;
      synth.cancel();
      this.timers.forEach(clearTimeout);
      this.timers.clear();
    },
    selectVoice(){
      if(this.voice)return this.voice;
      const voices=synth.getVoices();
      const ranked=[
        /Microsoft (Ava|Jenny|Sonia|Ryan|Libby|Aria).*Natural/i,
        /(Ava|Samantha|Serena|Daniel|Karen|Moira|Tessa|Fiona)/i,
        /Google UK English Female/i,
        /Google UK English Male/i,
        /Google US English/i
      ];
      for(const rule of ranked){const found=voices.find(v=>rule.test(v.name));if(found){this.voice=found;break}}
      this.voice ||= voices.find(v=>/^en-GB/i.test(v.lang)) || voices.find(v=>/^en-US/i.test(v.lang)) || voices.find(v=>/^en/i.test(v.lang)) || null;
      return this.voice;
    },
    prepare(text){
      let value=String(text||'').replace(/\s+/g,' ').trim();
      this.aliases.forEach(([pattern,replacement])=>value=value.replace(pattern,replacement));
      return value;
    },
    profile(text){
      const t=text.toLowerCase();
      if(/should a company remember|every company grows|very few remember|future will be living companies/.test(t))return {rate:.84,pitch:.92,volume:.96,pause:850};
      if(/xen is not|operating system|designing living companies/.test(t))return {rate:.88,pitch:.91,volume:1,pause:700};
      if(/executive summary|your answers|prepared from/.test(t))return {rate:.93,pitch:.94,volume:1,pause:420};
      if(/\?$/.test(text.trim()))return {rate:.9,pitch:.96,volume:1,pause:620};
      if(/marisol|vianka|we did not have|company was learning/.test(t))return {rate:.91,pitch:.94,volume:1,pause:470};
      return {rate:.95,pitch:.96,volume:1,pause:300};
    },
    beats(text){
      const prepared=this.prepare(text);
      const sentences=prepared.match(/[^.!?]+[.!?]?/g)||[prepared];
      const beats=[];
      sentences.forEach(sentence=>{
        const s=sentence.trim();
        if(!s)return;
        if(s.length>145){
          const clauses=s.split(/(?<=,|;|:)\s+/);
          clauses.forEach(c=>c.trim()&&beats.push(c.trim()));
        }else beats.push(s);
      });
      return beats;
    },
    speak(text){
      if(typeof voiceOn!=='undefined'&&!voiceOn)return;
      this.stop();
      const myToken=this.token;
      const beats=this.beats(text);
      const voice=this.selectVoice();
      const next=index=>{
        if(myToken!==this.token||index>=beats.length)return;
        const beat=beats[index];
        const p=this.profile(beat);
        const utterance=new SpeechSynthesisUtterance(beat);
        utterance.voice=voice;
        utterance.lang=voice?.lang||'en-US';
        utterance.rate=p.rate;
        utterance.pitch=p.pitch;
        utterance.volume=p.volume;
        utterance.onend=()=>{
          if(myToken!==this.token)return;
          const extra=/\?$/.test(beat)?240:0;
          const timer=setTimeout(()=>{this.timers.delete(timer);next(index+1)},p.pause+extra);
          this.timers.add(timer);
        };
        utterance.onerror=()=>next(index+1);
        synth.speak(utterance);
      };
      next(0);
    }
  };

  synth.onvoiceschanged=()=>{XVR.voice=null;XVR.selectVoice()};
  window.XVR=XVR;
  window.speak=text=>XVR.speak(text);
  document.addEventListener('pointerdown',e=>{
    if(e.target.closest('#listen, textarea, input'))XVR.stop();
  },true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)XVR.stop()});
})();