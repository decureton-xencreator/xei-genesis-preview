import fs from 'node:fs';
const required=['index.html','src/app-v5.js','src/styles-v5.css','src/cursor-v5.js','docs/XEI-001-CINEMATIC-STORYBOARD-V5.md'];
for(const file of required){
 if(!fs.existsSync(file))throw new Error(`Missing required production asset: ${file}`);
 const size=fs.statSync(file).size;
 if(size<20)throw new Error(`Production asset is unexpectedly empty: ${file}`);
 console.log(`PASS ${file} ${size} bytes`);
}
const html=fs.readFileSync('index.html','utf8');
const js=fs.readFileSync('src/app-v5.js','utf8');
const css=fs.readFileSync('src/styles-v5.css','utf8');
if(!html.includes('app-v5.js')||!html.includes('styles-v5.css'))throw new Error('V5 shell is not active');
if(js.includes('voices[0]'))throw new Error('Unsafe voice fallback detected');
if(!js.includes('caption-only'))throw new Error('Caption-only safety mode missing');
if(!css.includes('prefers-reduced-motion'))throw new Error('Reduced-motion support missing');
console.log('PASS executable V5 shell, voice safety boundary, and accessibility gate');