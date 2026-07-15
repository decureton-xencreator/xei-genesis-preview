import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const js=fs.readFileSync('src/app-v5.js','utf8');
const css=fs.readFileSync('src/styles-v5.css','utf8');
const cursor=fs.readFileSync('src/cursor-v5.js','utf8');
const storyboard=fs.readFileSync('docs/XEI-001-CINEMATIC-STORYBOARD-V5.md','utf8');
const checks={
 'production assets exist':html.includes('app-v5.js')&&html.includes('styles-v5.css')&&html.includes('cursor-v5.js'),
 'approved cinematic storyboard retained':storyboard.includes('ACT XIII')&&storyboard.includes('GOLD MASTER ACCEPTANCE TEST'),
 'directed film runtime':js.includes("const scenes=")&&js.includes('scrollIntoView')&&js.includes('data-camera'),
 'Living Company proof sequence':js.includes('Can your company remember')&&js.includes('Panama')&&js.includes('manualHTML')&&js.includes('Approve Evolution'),
 'enterprise close':js.includes('length:24')&&js.includes('EXECUTIVE SUMMARY')&&js.includes('Checkmate 1 integration and comparison'),
 'voice safety and captions':js.includes('caption-only')&&!js.includes('voices[0]')&&html.includes('aria-live="polite"'),
 'cinematic visual language':css.includes('.chapter.active')&&css.includes('@keyframes blink')&&cursor.includes('--mx'),
 'responsive accessibility':css.includes('@media(max-width:1000px)')&&css.includes('@media(max-width:650px)')&&css.includes('prefers-reduced-motion')
};
let failed=0;for(const [name,ok] of Object.entries(checks)){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed++}
if(failed)process.exit(1);
console.log(`PASS ${Object.keys(checks).length}/${Object.keys(checks).length} deterministic cinematic gates`);