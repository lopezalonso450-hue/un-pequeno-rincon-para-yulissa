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

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const song=$('#song'),musicBtn=$('#musicBtn'),musicLabel=$('#musicLabel');let fadeTimer;
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
$('#roseBtn').onclick=()=>{$('#roseBtn').classList.add('bloomed');$('#birthday').classList.add('show');burst(110);setTimeout(()=>{fadeTo(.52,1200);$('#night').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('.constellation').classList.add('show'),1000)},3200)};
$('#giftBtn').onclick=()=>{fadeTo(.3,1100);$('#mirrorScene').classList.add('open');$('#mirrorScene').setAttribute('aria-hidden','false');setTimeout(()=>$('#mirrorScene').scrollIntoView({behavior:'smooth'}),100)};
$('#gift').onclick=()=>{$('#gift').classList.add('open');burst(140);welcomeConfetti(45);setTimeout(()=>{$$('#fx .fall').forEach(x=>x.classList.add('final-heart-rain'));$('#gift').style.display='none';$('.gift-hint').style.display='none';$('#mirrorCard').classList.add('show');fadeTo(.18,1800)},850)};
$('#replayBtn').onclick=()=>{location.hash='';scrollTo({top:0,behavior:'smooth'});setTimeout(()=>location.reload(),900)};
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
