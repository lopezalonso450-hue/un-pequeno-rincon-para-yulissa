// Acceso con contraseña. Esta capa aparece antes que cualquier otro contenido.
const ACCESS_PASSWORD = '1908';
const accessGate = document.querySelector('#accessGate');
const accessForm = document.querySelector('#accessForm');
const accessInput = document.querySelector('#accessPassword');
const accessError = document.querySelector('#accessError');
const lockWrap = document.querySelector('#lockWrap');
let accessBusy = false;

function accessParticleBurst(count=48){
  const layer=document.querySelector('#accessSparkles');
  if(!layer)return;
  const icons=['✨','💜','💗','🌸','🌹','✦'];
  for(let i=0;i<count;i++)setTimeout(()=>{
    const p=document.createElement('span');
    p.className='access-particle';
    p.textContent=icons[Math.floor(Math.random()*icons.length)];
    p.style.setProperty('--x',(15+Math.random()*70)+'vw');
    p.style.setProperty('--y',(25+Math.random()*50)+'vh');
    p.style.setProperty('--dx',(-160+Math.random()*320)+'px');
    p.style.setProperty('--dy',(-190+Math.random()*130)+'px');
    p.style.setProperty('--size',(14+Math.random()*22)+'px');
    p.style.setProperty('--delay',(Math.random()*.2)+'s');
    layer.appendChild(p);
    setTimeout(()=>p.remove(),2400);
  },i*18);
}

function removeDateGateAfterPassword(){
  try{clearInterval(gateTimer)}catch(e){}
  document.body.classList.remove('date-locked');
  if(gate){gate.classList.add('unlocked');setTimeout(()=>gate.remove(),250)}
}

async function unlockAccess(){
  if(accessBusy)return;
  accessBusy=true;
  accessError.textContent='';
  accessGate.classList.add('success');
  lockWrap.classList.add('open');
  accessParticleBurst(70);
  removeDateGateAfterPassword();
  document.body.classList.remove('access-locked');
  // La pulsación del botón cuenta como interacción del usuario y permite iniciar el audio.
  try{await beginExperience()}catch(e){}
  setTimeout(()=>accessGate.classList.add('leaving'),650);
  setTimeout(()=>accessGate.remove(),1750);
}

if(accessForm){
  setTimeout(()=>accessInput && accessInput.focus({preventScroll:true}),450);
  accessForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(accessBusy)return;
    if((accessInput.value||'').trim()===ACCESS_PASSWORD){
      unlockAccess();
    }else{
      accessError.textContent='Contraseña incorrecta. Inténtalo nuevamente.';
      accessGate.classList.remove('shake');void accessGate.offsetWidth;accessGate.classList.add('shake');
      accessInput.select();
      setTimeout(()=>accessGate.classList.remove('shake'),520);
    }
  });
  accessInput.addEventListener('input',()=>{accessError.textContent='';accessInput.value=accessInput.value.replace(/\D/g,'').slice(0,4)});
}

// Bloqueo por fecha: 19 de agosto de 2026, 00:00 (hora del centro de México).
const BIRTHDAY_UNLOCK = new Date('2026-08-19T00:00:00-06:00').getTime();
const gate = document.querySelector('#dateGate');
const previewUnlocked = new URLSearchParams(location.search).get('preview') === '1';
let gateTimer;
function setCounter(id,value){const el=document.querySelector(id);if(el)el.textContent=String(value).padStart(2,'0')}
function releaseBirthdayGate(){
  if(!gate)return;
  clearInterval(gateTimer);
  gate.classList.add('birthday');
  document.body.classList.remove('date-locked');
  try{burst(70)}catch(e){}
  setTimeout(()=>gate.classList.add('unlocked'),900);
  setTimeout(()=>gate.remove(),2200);
}
function updateBirthdayGate(){
  if(!gate)return;
  const remaining=BIRTHDAY_UNLOCK-Date.now();
  if(previewUnlocked||remaining<=0){releaseBirthdayGate();return}
  const days=Math.floor(remaining/86400000);
  const hours=Math.floor(remaining%86400000/3600000);
  const minutes=Math.floor(remaining%3600000/60000);
  const seconds=Math.floor(remaining%60000/1000);
  setCounter('#countDays',days);setCounter('#countHours',hours);setCounter('#countMinutes',minutes);setCounter('#countSeconds',seconds);
}
updateBirthdayGate();
if(gate&&!previewUnlocked&&Date.now()<BIRTHDAY_UNLOCK)gateTimer=setInterval(updateBirthdayGate,1000);

// Flores, corazones y mensajes interactivos mientras la sorpresa permanece bloqueada.
const gateMessages=[
  'Ten paciencia… lo bonito también sabe esperar 💜',
  'Todavía no… pero falta cada vez menos 🌸',
  'Una sorpresa especial está floreciendo para ti 🌹',
  'Guarda un poquito de curiosidad para el 19 de agosto ✨',
  'La espera también forma parte de la sorpresa 💗',
  'Vuelve pronto… este rincón ya casi despierta 🦋'
];
let lastGateTouch=0, gateMessageTimer;
function makeGateFloater(){
  if(!gate || gate.classList.contains('unlocked'))return;
  const layer=document.querySelector('#gateFloaters');if(!layer)return;
  const el=document.createElement('span');
  el.className='gate-floater';
  el.textContent=['💜','🌸','🌹','💗','🦋','✦'][Math.floor(Math.random()*6)];
  el.style.setProperty('--left',Math.random()*100+'vw');
  el.style.setProperty('--size',(15+Math.random()*18)+'px');
  el.style.setProperty('--duration',(7+Math.random()*6)+'s');
  el.style.setProperty('--drift',(-90+Math.random()*180)+'px');
  layer.appendChild(el);setTimeout(()=>el.remove(),14000);
}
function gateTouchEffect(x,y){
  const msg=document.querySelector('#gateTouchMessage');
  if(msg){
    clearTimeout(gateMessageTimer);
    msg.textContent=gateMessages[Math.floor(Math.random()*gateMessages.length)];
    msg.classList.remove('show');void msg.offsetWidth;msg.classList.add('show');
    gateMessageTimer=setTimeout(()=>msg.classList.remove('show'),2600);
  }
  for(let i=0;i<8;i++)setTimeout(()=>{
    const el=document.createElement('span');el.className='gate-touch-pop';
    el.textContent=['💜','🌸','🌹','💗','✨'][Math.floor(Math.random()*5)];
    el.style.left=x+'px';el.style.top=y+'px';
    el.style.setProperty('--size',(16+Math.random()*16)+'px');
    el.style.setProperty('--dx',(-75+Math.random()*150)+'px');
    document.body.appendChild(el);setTimeout(()=>el.remove(),1800);
  },i*35);
}
if(gate&&!previewUnlocked&&Date.now()<BIRTHDAY_UNLOCK){
  for(let i=0;i<12;i++)setTimeout(makeGateFloater,i*280);
  setInterval(makeGateFloater,780);
  gate.addEventListener('pointerdown',e=>{
    const now=Date.now();if(now-lastGateTouch<450)return;lastGateTouch=now;
    gateTouchEffect(e.clientX,e.clientY);
  });
}


const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const song=$('#song'),musicBtn=$('#musicBtn'),musicLabel=$('#musicLabel');let fadeTimer;
// Al pulsar “Volver a vivirlo”, la portada reaparece sin mostrar otra vez el botón Comenzar.
const replayWithoutStart=sessionStorage.getItem('yulissaReplayWithoutStart')==='1';
if(replayWithoutStart){
  sessionStorage.removeItem('yulissaReplayWithoutStart');
  document.body.classList.add('replay-clean');
  const roseHint=$('#firstRose small');
  if(roseHint)roseHint.textContent='Toca la rosa';
}
function fadeTo(target,duration=1300){clearInterval(fadeTimer);const start=song.volume,steps=30,delta=(target-start)/steps;let i=0;fadeTimer=setInterval(()=>{i++;song.volume=Math.max(0,Math.min(1,start+delta*i));if(i>=steps)clearInterval(fadeTimer)},duration/steps)}
async function playMusic(){try{song.volume=0;await song.play();musicBtn.classList.add('show','playing');musicLabel.textContent='Pausar';fadeTo(.72,1800)}catch(e){musicBtn.classList.add('show');musicLabel.textContent='Reproducir'}}
musicBtn.onclick=async()=>{if(song.paused){await song.play();fadeTo(.72,700);musicBtn.classList.add('playing');musicLabel.textContent='Pausar'}else{fadeTo(0,350);setTimeout(()=>song.pause(),380);musicBtn.classList.remove('playing');musicLabel.textContent='Reproducir'}};
function welcomeConfetti(n=70){const colors=['#a855d6','#e1b7ff','#ffffff','#d5a85b','#7d2aa4'];for(let i=0;i<n;i++){setTimeout(()=>{const c=document.createElement('i');c.className='confetti-piece';c.style.setProperty('--x',Math.random()*100+'vw');c.style.setProperty('--c',colors[Math.floor(Math.random()*colors.length)]);c.style.setProperty('--t',(2.8+Math.random()*2.4)+'s');c.style.setProperty('--r',Math.random()*360+'deg');c.style.setProperty('--dx',(-100+Math.random()*200)+'px');document.body.appendChild(c);setTimeout(()=>c.remove(),6000)},i*16)}}
async function beginExperience(){const top=$('#top');if(top.classList.contains('started'))return;top.classList.add('awake','started');welcomeConfetti(85);burst(24);await playMusic();setTimeout(()=>$('#envelopeScene').scrollIntoView({behavior:'smooth'}),950)}
$('#startBtn').onclick=beginExperience;
$('#firstRose').onclick=beginExperience;
$('#openBtn').onclick=()=>{$('#openBtn').classList.add('open');playMusic();burst(42);setTimeout(()=>$('.hero').scrollIntoView({behavior:'smooth'}),1150)};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.14});$$('.reveal').forEach(x=>io.observe(x));
addEventListener('scroll',()=>{const h=document.documentElement;$('#progress').style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%'});
function petal(force=false){if(!force&&scrollY<innerHeight)return;const p=document.createElement('span');p.className='fall';p.textContent=['🌸','🌹','💗','✦','❀'][Math.floor(Math.random()*5)];p.style.setProperty('--l',Math.random()*100+'vw');p.style.setProperty('--s',(12+Math.random()*18)+'px');p.style.setProperty('--d',(7+Math.random()*7)+'s');p.style.setProperty('--x',(-120+Math.random()*240)+'px');$('#fx').appendChild(p);setTimeout(()=>p.remove(),15000)}setInterval(()=>petal(),950);function burst(n){for(let i=0;i<n;i++)setTimeout(()=>petal(true),i*35)}
const dlg=$('#photoDialog');$$('.photo').forEach(f=>f.onclick=()=>{$('#dialogImg').src=f.querySelector('img').src;$('#dialogText').textContent=f.dataset.note;dlg.showModal();burst(8)});$('#closeDialog').onclick=()=>dlg.close();dlg.onclick=e=>{if(e.target===dlg)dlg.close()};

function birthdayCelebration(n=85){
  const icons=['🎈','💜','🌸','🌹','💗','🎉','✨'];
  for(let i=0;i<n;i++)setTimeout(()=>{
    const el=document.createElement('span');el.className='celebration-pop';
    el.textContent=icons[Math.floor(Math.random()*icons.length)];
    el.style.setProperty('--left',Math.random()*100+'vw');
    el.style.setProperty('--size',(16+Math.random()*25)+'px');
    el.style.setProperty('--duration',(3.8+Math.random()*3.5)+'s');
    el.style.setProperty('--drift',(-130+Math.random()*260)+'px');
    el.style.setProperty('--rotation',(-260+Math.random()*520)+'deg');
    document.body.appendChild(el);setTimeout(()=>el.remove(),8000);
  },i*28);
}

$('#roseBtn').onclick=()=>{$('#roseBtn').classList.add('bloomed');$('#birthday').classList.add('show');burst(110);birthdayCelebration(95);setTimeout(()=>{fadeTo(.52,1200);$('#night').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('.constellation').classList.add('show'),1000)},3200)};
$('#giftBtn').onclick=()=>{fadeTo(.3,1100);$('#mirrorScene').classList.add('open');$('#mirrorScene').setAttribute('aria-hidden','false');setTimeout(()=>$('#mirrorScene').scrollIntoView({behavior:'smooth'}),100)};
$('#gift').onclick=()=>{$('#gift').classList.add('open');burst(140);welcomeConfetti(45);setTimeout(()=>{$$('#fx .fall').forEach(x=>x.classList.add('final-heart-rain'));$('#gift').style.display='none';$('.gift-hint').style.display='none';$('#mirrorCard').classList.add('show');fadeTo(.18,1800)},850)};
$('#replayBtn').onclick=()=>{
  sessionStorage.setItem('yulissaReplayWithoutStart','1');
  try{song.pause();song.currentTime=0}catch(e){}
  location.hash='';
  scrollTo({top:0,behavior:'smooth'});
  setTimeout(()=>location.reload(),900)
};
const canvas=$('#stars'),ctx=canvas.getContext('2d');let stars=[];function resize(){const d=devicePixelRatio||1;canvas.width=canvas.clientWidth*d;canvas.height=canvas.clientHeight*d;ctx.setTransform(d,0,0,d,0,0);stars=Array.from({length:150},()=>({x:Math.random()*canvas.clientWidth,y:Math.random()*canvas.clientHeight,r:Math.random()*1.6+.25,a:Math.random(),v:Math.random()*.018+.004}))}resize();addEventListener('resize',resize);(function draw(){ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);for(const s of stars){s.a+=s.v;if(s.a>1||s.a<.12)s.v*=-1;ctx.fillStyle=`rgba(255,255,255,${s.a})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)})();// Nuevas páginas: cada fotografía guarda una frase y una pequeña reacción.
document.querySelectorAll('.book-page').forEach(page=>{
  page.addEventListener('click',()=>{
    const img=page.querySelector('img');
    document.querySelector('#dialogImg').src=img.src;
    document.querySelector('#dialogText').textContent=page.dataset.note;
    page.classList.remove('heart-pop'); void page.offsetWidth; page.classList.add('heart-pop');
    document.querySelector('#photoDialog').showModal();
    burst(12);
  });
});


const finalBirthdayTitle=document.querySelector('#finalBirthdayTitle');
if(finalBirthdayTitle){
  let finalCelebrated=false;
  const birthdayObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting&&!finalCelebrated){finalCelebrated=true;birthdayCelebration(120);burst(55)}
  }),{threshold:.65});
  birthdayObserver.observe(finalBirthdayTitle);
}

/* =========================================================
   MAGIA VISUAL DEFINITIVA EN PRIMER PLANO
   ========================================================= */
(() => {
  const layer = document.getElementById('globalFx');
  const toast = document.getElementById('touchToast');
  if (!layer) return;

  const allIcons = ['💜','💗','💕','🌸','🌹','❀','✦','✨','🦋'];
  const softIcons = ['💜','🌸','🌹','❀','✦','✨'];
  const birthdayIcons = ['🎈','🎈','🎈','🎉','💜','💗','🌸','🌹','✨','🎊'];
  const patienceMessages = [
    'Ten paciencia… lo bonito también sabe esperar 💜',
    'Ya casi… la sorpresa está floreciendo para ti 🌸',
    'Un poquito más de paciencia, Yulissa 🌹',
    'Todavía no se abre… pero falta cada vez menos ✨',
    'Guarda un poquito de curiosidad para el 19 de agosto 💗',
    'Lo mejor está por comenzar 🦋'
  ];
  let toastTimer = null;

  function item(icon, options = {}) {
    const el = document.createElement('span');
    el.className = `magic-item ${options.className || ''}`.trim();
    el.textContent = icon;
    el.style.setProperty('--left', options.left ?? `${Math.random()*100}vw`);
    el.style.setProperty('--top', options.top ?? `${-12-Math.random()*18}vh`);
    el.style.setProperty('--size', options.size ?? `${16+Math.random()*24}px`);
    el.style.setProperty('--duration', options.duration ?? `${7+Math.random()*7}s`);
    el.style.setProperty('--drift', options.drift ?? `${-130+Math.random()*260}px`);
    el.style.setProperty('--spin', options.spin ?? `${-520+Math.random()*1040}deg`);
    if (options.touchX) el.style.setProperty('--touch-x', options.touchX);
    if (options.touchY) el.style.setProperty('--touch-y', options.touchY);
    if (options.dx) el.style.setProperty('--dx', options.dx);
    if (options.dy) el.style.setProperty('--dy', options.dy);
    layer.appendChild(el);
    const lifetime = (parseFloat(options.duration || 14) + 2) * 1000;
    setTimeout(() => el.remove(), Math.min(18000, lifetime));
    return el;
  }

  function ambientOne() {
    const icon = softIcons[Math.floor(Math.random()*softIcons.length)];
    item(icon, {className: icon === '✨' || icon === '✦' ? 'sparkle' : ''});
  }

  // Llenado inicial: los detalles se ven inmediatamente y en el centro, no solo en los bordes.
  for (let i=0;i<26;i++) {
    setTimeout(() => item(allIcons[Math.floor(Math.random()*allIcons.length)], {
      left:`${6+Math.random()*88}vw`,
      top:`${-5+Math.random()*80}vh`,
      duration:`${6+Math.random()*7}s`,
      size:`${17+Math.random()*25}px`
    }), i*70);
  }
  const ambientTimer = setInterval(ambientOne, 360);

  function frontBurst(x, y, count=14) {
    for (let i=0;i<count;i++) {
      setTimeout(() => {
        const a = (Math.PI*2*i/count) + (Math.random()-.5)*.35;
        const distance = 60 + Math.random()*115;
        item(allIcons[Math.floor(Math.random()*allIcons.length)], {
          className:'touch-burst',
          touchX:`${x}px`, touchY:`${y}px`,
          dx:`${Math.cos(a)*distance}px`, dy:`${Math.sin(a)*distance}px`,
          size:`${18+Math.random()*22}px`, duration:`${1.2+Math.random()*.8}s`,
          spin:`${-220+Math.random()*440}deg`
        });
      }, i*24);
    }
  }

  function showToast(message) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  // Captura el toque antes que cualquier elemento de la pantalla bloqueada.
  document.addEventListener('pointerdown', (ev) => {
    if (!document.body.classList.contains('date-locked')) return;
    frontBurst(ev.clientX, ev.clientY, 16);
    showToast(patienceMessages[Math.floor(Math.random()*patienceMessages.length)]);
  }, true);

  function grandCelebration(count=150) {
    for (let i=0;i<count;i++) {
      setTimeout(() => {
        const icon = birthdayIcons[Math.floor(Math.random()*birthdayIcons.length)];
        const balloon = icon === '🎈';
        item(icon, {
          className: balloon ? 'balloon' : (icon === '✨' ? 'sparkle' : ''),
          left:`${2+Math.random()*96}vw`,
          top: balloon ? '105vh' : `${-10-Math.random()*20}vh`,
          size:`${balloon ? 30+Math.random()*38 : 18+Math.random()*28}px`,
          duration:`${balloon ? 6+Math.random()*5 : 5+Math.random()*5}s`,
          drift:`${-160+Math.random()*320}px`
        });
      }, i*22);
    }
  }

  // Reacciona al momento principal de cumpleaños.
  const birthday = document.getElementById('birthday');
  if (birthday) {
    new MutationObserver(() => {
      if (birthday.classList.contains('show') && !birthday.dataset.frontCelebrated) {
        birthday.dataset.frontCelebrated = '1';
        grandCelebration(180);
      }
    }).observe(birthday, {attributes:true, attributeFilter:['class']});
  }

  const finalTitle = document.getElementById('finalBirthdayTitle');
  if (finalTitle) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && !finalTitle.dataset.frontCelebrated) {
        finalTitle.dataset.frontCelebrated = '1';
        grandCelebration(200);
      }
    }), {threshold:.45});
    observer.observe(finalTitle);
  }

  // También celebra al abrir el regalo final.
  const gift = document.getElementById('gift');
  if (gift) gift.addEventListener('click', () => grandCelebration(110));

  addEventListener('pagehide', () => clearInterval(ambientTimer), {once:true});
})();
