const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const song=$('#song'),musicBtn=$('#musicBtn'),musicLabel=$('#musicLabel');let fadeTimer;
function fadeTo(target,duration=1300){clearInterval(fadeTimer);const start=song.volume,steps=30,delta=(target-start)/steps;let i=0;fadeTimer=setInterval(()=>{i++;song.volume=Math.max(0,Math.min(1,start+delta*i));if(i>=steps)clearInterval(fadeTimer)},duration/steps)}
async function playMusic(){try{song.volume=0;await song.play();musicBtn.classList.add('show','playing');musicLabel.textContent='Pausar';fadeTo(.72,1800)}catch(e){musicBtn.classList.add('show');musicLabel.textContent='Reproducir'}}
musicBtn.onclick=async()=>{if(song.paused){await song.play();fadeTo(.72,700);musicBtn.classList.add('playing');musicLabel.textContent='Pausar'}else{fadeTo(0,350);setTimeout(()=>song.pause(),380);musicBtn.classList.remove('playing');musicLabel.textContent='Reproducir'}};
$('#firstRose').onclick=()=>{$('#top').classList.add('awake');burst(28);setTimeout(()=>$('#envelopeScene').scrollIntoView({behavior:'smooth'}),850)};
$('#openBtn').onclick=()=>{$('#openBtn').classList.add('open');playMusic();burst(42);setTimeout(()=>$('.hero').scrollIntoView({behavior:'smooth'}),1150)};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.14});$$('.reveal').forEach(x=>io.observe(x));
addEventListener('scroll',()=>{const h=document.documentElement;$('#progress').style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%'});
function petal(force=false){if(!force&&scrollY<innerHeight)return;const p=document.createElement('span');p.className='fall';p.textContent=['🌸','🌹','💗','✦','❀'][Math.floor(Math.random()*5)];p.style.setProperty('--l',Math.random()*100+'vw');p.style.setProperty('--s',(12+Math.random()*18)+'px');p.style.setProperty('--d',(7+Math.random()*7)+'s');p.style.setProperty('--x',(-120+Math.random()*240)+'px');$('#fx').appendChild(p);setTimeout(()=>p.remove(),15000)}setInterval(()=>petal(),950);function burst(n){for(let i=0;i<n;i++)setTimeout(()=>petal(true),i*35)}
const dlg=$('#photoDialog');$$('.photo').forEach(f=>f.onclick=()=>{$('#dialogImg').src=f.querySelector('img').src;$('#dialogText').textContent=f.dataset.note;dlg.showModal();burst(8)});$('#closeDialog').onclick=()=>dlg.close();dlg.onclick=e=>{if(e.target===dlg)dlg.close()};
$('#roseBtn').onclick=()=>{$('#roseBtn').classList.add('bloomed');$('#birthday').classList.add('show');burst(110);setTimeout(()=>{fadeTo(.52,1200);$('#night').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('.constellation').classList.add('show'),1000)},3200)};
$('#giftBtn').onclick=()=>{fadeTo(.3,1100);$('#mirrorScene').classList.add('open');$('#mirrorScene').setAttribute('aria-hidden','false');setTimeout(()=>$('#mirrorScene').scrollIntoView({behavior:'smooth'}),100)};
$('#gift').onclick=()=>{$('#gift').classList.add('open');burst(80);setTimeout(()=>{$('#gift').style.display='none';$('.gift-hint').style.display='none';$('#mirrorCard').classList.add('show');fadeTo(.18,1800)},850)};
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
