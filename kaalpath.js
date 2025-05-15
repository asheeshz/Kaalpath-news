// Save this as a .js file (e.g., article-scripts.js)

let baseSize=17.6; // Base font size
const synth=window.speechSynthesis;
let defaultVoice=null;
let currentSpeakingElement=null;
let lastClickedEditorialBox=null; // Track last clicked editorial box

// --- Font Size Functions ---
function changeFontSize(val){
    const el=document.querySelector('.cnl-article-container .myPrintablePost .cnl-main-content');
    if(el){
        let curPx=parseFloat(window.getComputedStyle(el).fontSize);
        let curSizePx=isNaN(curPx)||curPx===0?baseSize:curPx;
        let newSizePx=curSizePx+val*1.5;
        if(newSizePx<12)newSizePx=12;
        if(newSizePx>27)newSizePx=27;
        el.style.fontSize=newSizePx+"px";
    }else{console.error("Font size target not found.");}
}

// --- Sharing & Utility Functions ---
function shareArticle(){
    if(navigator.share){
        navigator.share({title:document.title,text:'Check out this article: '+document.title,url:window.location.href})
        .then(()=>{}).catch(e=>{console.error('Error sharing:',e);alert('Unable to share. Please copy and paste manually.');});
    }else{
        const url=window.location.href;
        if(navigator.clipboard&&navigator.clipboard.writeText){
            navigator.clipboard.writeText(url).then(()=>{alert('Sharing not supported, but link copied!');}).catch(e=>{console.error('Failed to copy:',e);alert('Sharing not supported. Manually copy link:\n\n'+url);});
        }else{alert('Sharing not supported. Manually copy link:\n\n'+url);}
        console.warn('Web Share API not supported.');
    }
}
function reportError(){
    const sub="Correction: "+document.title;
    const body="URL: "+window.location.href+"\n\nError/Correction:\n\n";
    window.open('mailto:your@email.com?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body),'_blank');
}
function showFactCheckInfo(){alert('Fact check policy info placeholder.');} // Placeholder
function copyArticleLink(){
    const url=window.location.href;
    if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(()=>{alert('Link copied!');}).catch(e=>{console.error('Failed to copy:',e);prompt("Manual copy:",url);});
    }else{console.warn('Clipboard API not supported.');prompt("Manual copy:",url);}
}
function printMyPost(){
    const content=document.querySelector('.myPrintablePost');
    if(!content){alert("Printable content not found!");return;}
    const myWindow=window.open('','','width=900,height=650');
    myWindow.document.write(`<html><head><title>Print Preview</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"><style>
    body{font-family:'Noto Sans Devanagari',sans-serif;padding:30px;line-height:1.7;color:#111;}h1,h2,h3,h4{color:#2c3e50;margin-top:1em;margin-bottom:.5em;}p{margin-bottom:1em;}img{max-width:100%;height:auto;display:block;margin:1em auto;}figure{margin:1em auto;text-align:center;}figcaption{font-size:.9em;color:#555;margin-top:.5em;}blockquote{border-left:4px solid #888;padding:10px 15px;margin:1em 0;font-style:italic;background-color:#f9f9f9;}blockquote footer{font-size:.9em;color:#666;font-style:normal;margin-top:.5em;}ul,ol{margin:1em 0 1em 20px;padding:0;}li{margin-bottom:.5em;}table{width:100%;border-collapse:collapse;margin:1em 0;}th,td{border:1px solid #888;padding:8px;text-align:left;}th{background-color:#eee;font-weight:bold;}
    .cnl-fivew1h-full,.cnl-journalistic-box,.cnl-fact-box,.cnl-highlight-box,.cnl-science-box,.cnl-court-box,.cnl-obituary-box,.cnl-investigative-box,.cnl-editorial-opinion-box,.cnl-certification-box,.cnl-suvichar-box,.cnl-security-points-box,.cnl-author-bio-box,.cnl-comments-prompt-box{padding:15px!important;margin:15px 0!important;border:1px solid #ccc!important;border-left:4px solid #888!important;background-color:#f9f9f9!important;box-shadow:none!important;border-radius:0!important;color:#000!important;animation:none!important;background-image:none!important;-webkit-text-fill-color:initial!important;background-clip:initial!important;-webkit-background-clip:initial!important;text-fill-color:initial!important;}
    .cnl-fivew1h-full h2,.cnl-journalistic-box h4,.cnl-editorial-opinion-box h2,.cnl-certification-box h2,.cnl-suvichar-box h2,.cnl-security-points-box h3,.cnl-comments-prompt-box h3{border-bottom:1px solid #ccc!important;padding-bottom:5px!important;margin-bottom:10px!important;color:#333!important;text-shadow:none!important;}
    .cnl-certification-box::before,.cnl-certification-box::after,.cnl-suvichar-box::before,.cnl-security-points-box li::before{display:none!important;}
    .cnl-security-points-box ul{list-style:disc!important;padding-left:20px!important;}
    .cnl-security-points-box li{padding-left:0!important;}
    .cnl-author-bio-box img{border:none!important;box-shadow:none!important;margin-bottom:10px!important;}
    .myPrintablePost .cnl-author-info strong{color:#333!important;}
    .myPrintablePost .cnl-author-info small{color:#555!important;}
    .myPrintablePost .cnl-author-info a{color:#000!important;text-decoration:underline!important;text-shadow:none!important;}
    .cnl-timeline{border-left:2px solid #888!important;margin:15px 0 15px 15px!important;padding:15px!important;background:none!important;color:#000!important;box-shadow:none!important;border-radius:0!important;}
    .cnl-timeline-entry{margin-bottom:15px!important;padding-bottom:8px!important;border-bottom:1px dashed #ccc!important;}
    .cnl-timeline-entry h4{color:#333!important;}
    .cnl-timeline-entry p{color:#000!important;}
    .cnl-timeline-entry::before{content:'';position:absolute;left:-21px;top:6px;width:8px;height:8px;background-color:#555;border-radius:50%;border:2px solid #fff;z-index:1;}
    .cnl-tts-info-overlay,.cnl-tts-info-popup,.cnl-speaking-highlight,.cnl-article-headline-section,.cnl-article-info-section,.cnl-multimedia-gallery,.cnl-video-container,iframe,.cnl-accessibility-buttons,.sfcw-widget{display:none!important;}
    img{display:block!important;}figcaption{display:block!important;}table{display:table!important;}
    </style><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"></head><body>${content.innerHTML}</body></html>`);
    myWindow.document.close();myWindow.focus();myWindow.print();
}

// --- TTS Functions ---
function findDefaultVoice(){
    const allVoices=synth.getVoices();let found=null;
    found=allVoices.find(v=>v.lang==='hi-IN'||v.lang.startsWith('hi'));
    if(!found){found=allVoices.find(v=>v.lang==='en-IN');}
    if(!found){found=allVoices[0]||null;}
    defaultVoice=found;if(!defaultVoice){console.warn("No suitable TTS voice found.");}
}
function cleanTextForTTS(text){
    if(!text)return "";
    const div=document.createElement('div');div.innerHTML=text;
    text=div.textContent||div.innerText||text;
    text=text.replace(/[\u2705\u2714\u2713]/g,''); // Remove checkmarks etc.
    text=text.replace(/<i\s+class=["'][^"']*fa-[^"']*["'][^>]*><\/i>/g,''); // Remove icon tags
    text=text.replace(/[\u{1F000}-\u{1FFFF}\u{20000}-\u{2FFFF}]/gu,''); // Remove broad emoji range
    text=text.replace(/\s+/g,' ').trim();return text;
}
function removeHighlight(){if(currentSpeakingElement){currentSpeakingElement.classList.remove('cnl-speaking-highlight');currentSpeakingElement=null;}}
function startSpeakingElement(el){
    if(!synth||!defaultVoice){
        console.error("TTS or voice not ready.");
        if(synth&&synth.getVoices().length===0){synth.addEventListener('voiceschanged',()=>{findDefaultVoice();if(defaultVoice)startSpeakingElement(el);},{once:true});}
        else{alert("TTS not available or Hindi voice not found.");} return;
    }
    const rawText=el.innerText;const text=cleanTextForTTS(rawText);
    if(!text||text.trim()===""){console.warn("No readable text. Skipping.",el);return;}
    if(synth.speaking){synth.cancel();removeHighlight();}else{removeHighlight();}
    el.classList.add('cnl-speaking-highlight');currentSpeakingElement=el;
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.voice=defaultVoice;utterance.lang=defaultVoice.lang;
    utterance.rate=0.95;utterance.pitch=1;
    utterance.onend=removeHighlight;utterance.oncancel=removeHighlight;
    synth.speak(utterance);
}

// --- SFCW Particle System (Self-contained) ---
// Particle Class (Prefixed)
class SFCW_Particle {
    constructor(x, y) {
        this.x = x || Math.random() * sfcwCanvas.width;
        this.y = y || Math.random() * sfcwCanvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = (Math.random() * 1 - 0.5) * 0.5;
        this.speedY = (Math.random() * 1 - 0.5) * 0.5;
        const rootStyle = getComputedStyle(document.documentElement);
        const starColor = rootStyle.getPropertyValue('--sfcw-star-color').trim() || 'rgba(240, 248, 255, 0.85)';
        const particleColor = rootStyle.getPropertyValue('--sfcw-particle-color').trim() || 'rgba(0, 160, 160, 0.5)';
        this.color = Math.random() > 0.1 ? starColor : particleColor;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.initialOpacity = this.opacity;
        this.life = Math.random() * 2 + 1;
        this.initialLife = this.life;
    }
    update(deltaTime) {
        this.x += this.speedX * deltaTime * 30;
        this.y += this.speedY * deltaTime * 30;
        this.life -= deltaTime;
        if (this.life <= 0) {
             this.opacity = 0;
             if (this.life <= -0.5) { this.reset(); }
        } else {
             this.opacity = this.initialOpacity * (0.6 + Math.abs(Math.sin( (this.initialLife - this.life) * Math.PI / this.initialLife ) * 0.4));
        }
        if (this.x <= 0 || this.x >= sfcwCanvas.width) { this.speedX *= -1; this.x = Math.max(1, Math.min(this.x, sfcwCanvas.width - 1)); }
        if (this.y <= 0 || this.y >= sfcwCanvas.height) { this.speedY *= -1; this.y = Math.max(1, Math.min(this.y, sfcwCanvas.height - 1)); }
    }
    reset() {
        this.x = Math.random() * sfcwCanvas.width;
        this.y = Math.random() * sfcwCanvas.height;
        this.opacity = this.initialOpacity;
        this.life = this.initialLife;
        this.speedX = (Math.random() * 1 - 0.5) * 0.5;
        this.speedY = (Math.random() * 1 - 0.5) * 0.5;
    }
    draw() {
        if (this.opacity <= 0) return;
        sfcwCtx.globalAlpha = this.opacity;
        sfcwCtx.fillStyle = this.color;
        sfcwCtx.beginPath();
        sfcwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        sfcwCtx.fill();
    }
}

let sfcwCanvas, sfcwCtx, sfcwParticles=[], sfcwAnimationFrameId=null, sfcwLastTime=0, sfcwResizeTimeout;

function sfcwResizeCanvas(){if(sfcwCanvas){sfcwCanvas.width=sfcwCanvas.offsetWidth;sfcwCanvas.height=sfcwCanvas.offsetHeight;}}
function sfcwInitParticles(){
    sfcwParticles=[];
    let num=Math.floor((sfcwCanvas.width*sfcwCanvas.height)/15000);
    num=Math.max(50,Math.min(num,150));
    for(let i=0;i<num;i++){sfcwParticles.push(new SFCW_Particle());}
}
function sfcwAnimateParticles(ts){
    if(document.hidden){sfcwLastTime=ts;sfcwAnimationFrameId=requestAnimationFrame(sfcwAnimateParticles);return;}
    const dt=(ts-sfcwLastTime)/1000;sfcwLastTime=ts;
    if(sfcwCtx){sfcwCtx.clearRect(0,0,sfcwCanvas.width,sfcwCanvas.height);sfcwParticles.forEach(p=>{if(dt>0&&dt<0.1){p.update(dt);}else if(dt>=0.1){p.reset();}p.draw();});sfcwCtx.globalAlpha=1.0;}
    sfcwAnimationFrameId=requestAnimationFrame(sfcwAnimateParticles);
}
function sfcwStartAnimation(){sfcwResizeCanvas();sfcwInitParticles();if(sfcwAnimationFrameId){cancelAnimationFrame(sfcwAnimationFrameId);}sfcwLastTime=performance.now();sfcwAnimationFrameId=requestAnimationFrame(sfcwAnimateParticles);}


// --- DOMContentLoaded Listener (Runs after HTML is parsed) ---
document.addEventListener("DOMContentLoaded",()=>{
    // Font Size Setup
    const mainContentForFont=document.querySelector('.cnl-article-container .myPrintablePost .cnl-main-content');
    if(mainContentForFont){
        const computedPx=parseFloat(window.getComputedStyle(mainContentForFont).fontSize);
        baseSize=isNaN(computedPx)||computedPx===0?17.6:computedPx;
    }else{console.error("Main content for font size not found on load.");}

    // Read Time Calculation
    const articleBodyForReadTime=document.querySelector(".cnl-article-container .myPrintablePost .cnl-main-content");
    const readTimeElement=document.getElementById("cnl-read-time");
    if(articleBodyForReadTime&&readTimeElement){
        const clone=articleBodyForReadTime.cloneNode(true);
        clone.querySelectorAll('h2,h3,h4,figure,table,.cnl-fivew1h-full,.cnl-journalistic-box,.cnl-fact-box,.cnl-highlight-box,.cnl-science-box,.cnl-court-box,.cnl-obituary-box,.cnl-investigative-box,.cnl-timeline,.cnl-video-container,.cnl-multimedia-gallery,blockquote,.cnl-manual-box,.cnl-author-bio-box,.cnl-comments-prompt-box,script,style,.cnl-security-points-box').forEach(el=>el.remove());
        const text=clone.textContent||clone.innerText;
        const words=text.split(/\s+/).filter(w=>w.length>0).length;
        const time=Math.ceil(words/200); // 200 WPM
        readTimeElement.innerHTML=`<i class="fas fa-hourglass-half"></i> रीडिंग टाइम: ${Math.max(1,time)} मिनट`;
    }else if(readTimeElement){readTimeElement.style.display='none';}

    // TTS Setup
    const mainContentForTTS=document.querySelector('.cnl-article-container .myPrintablePost .cnl-main-content');
    if('speechSynthesis'in window&&mainContentForTTS){
        if(synth.getVoices().length>0){findDefaultVoice();}else{synth.addEventListener('voiceschanged',findDefaultVoice,{once:true});}
        mainContentForTTS.addEventListener('click',e=>{
            const sel='p,h2,h4,blockquote,.cnl-fact-box li,.cnl-highlight-box li,.cnl-key-takeaways-box li,.cnl-fivew1h-block p,.cnl-timeline-entry p,.cnl-expert-opinion-box blockquote p,.cnl-editorial-opinion-box p,.cnl-certification-content,.cnl-suvichar-content,td,th,figcaption,.cnl-security-points-box li';
            const target=e.target.closest(sel);
            const editorialBox=e.target.closest('.cnl-editorial-opinion-box');

            if(e.target.closest('.cnl-main-content')&&!target&&!editorialBox){ // Clicked inside main but not on readable/editorial
                if(synth.speaking){synth.cancel();removeHighlight();}
                return;
            }

            // Editorial Box Toggle
            if(editorialBox){
                 if(lastClickedEditorialBox&&lastClickedEditorialBox!==editorialBox){lastClickedEditorialBox.classList.remove('cnl-editorial-opinion-clicked');}
                 editorialBox.classList.toggle('cnl-editorial-opinion-clicked');
                 lastClickedEditorialBox=editorialBox.classList.contains('cnl-editorial-opinion-clicked')?editorialBox:null;
            }else{ // Click outside editorial box
                if(lastClickedEditorialBox){lastClickedEditorialBox.classList.remove('cnl-editorial-opinion-clicked');lastClickedEditorialBox=null;}
            }

            // Handle TTS for readable elements
            if(target){startSpeakingElement(target);}
            else if(synth.speaking){synth.cancel();removeHighlight();} // Click on editorial but not text inside, or other non-text area
        });
        synth.addEventListener('cancel',removeHighlight);
        synth.addEventListener('end',removeHighlight);
    }else{console.warn("Speech Synthesis API not supported or main content not found. TTS disabled.");}

    // --- SFCW Widget Setup ---
    const sfcwYearSpan=document.getElementById('sfcw-current-year');
    if(sfcwYearSpan){sfcwYearSpan.textContent=" "+new Date().getFullYear();}

    sfcwCanvas=document.getElementById('sfcw-particle-canvas');
    if(sfcwCanvas){
        sfcwCtx=sfcwCanvas.getContext('2d');
        const sfcwStartDelay=setTimeout(sfcwStartAnimation,100); // Start animation after slight delay
        window.addEventListener('resize',()=>{clearTimeout(sfcwResizeTimeout);sfcwResizeTimeout=setTimeout(()=>{if(sfcwAnimationFrameId){cancelAnimationFrame(sfcwAnimationFrameId);}sfcwStartAnimation();},500);});
        window.addEventListener('beforeunload',()=>{if(sfcwAnimationFrameId){cancelAnimationFrame(sfcwAnimationFrameId);}clearTimeout(sfcwStartDelay);clearTimeout(sfcwResizeTimeout);});
    } // else: console.error("SFCW Particle canvas not found!");
});

