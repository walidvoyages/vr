const scenes=[...document.querySelectorAll('.scene')];
const bar=document.getElementById('bar');
const pager=document.getElementById('pager');
let current=0, timer=null, raf=null, started=0, duration=0;

scenes.forEach((_,i)=>{const dot=document.createElement('i'); if(i===0)dot.classList.add('on'); pager.appendChild(dot)});
const dots=[...pager.children];

function animateCounter(scene){
  scene.querySelectorAll('.counter').forEach(el=>{
    el.textContent='0';
    const target=+el.dataset.target;
    const start=performance.now(), dur=1300;
    const tick=now=>{
      const p=Math.min(1,(now-start)/dur);
      const eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*eased).toLocaleString('fr-FR');
      if(p<1 && scene.classList.contains('active')) requestAnimationFrame(tick);
    };
    setTimeout(()=>requestAnimationFrame(tick),1250);
  });
}

function clearTimers(){clearTimeout(timer); cancelAnimationFrame(raf)}
function runProgress(){
  const step=now=>{
    const p=Math.min(1,(now-started)/duration);
    const total=(current+p)/scenes.length*100;
    bar.style.width=total+'%';
    if(p<1) raf=requestAnimationFrame(step);
  };
  raf=requestAnimationFrame(step);
}
function showScene(index){
  clearTimers();
  scenes.forEach((s,i)=>s.classList.toggle('active',i===index));
  dots.forEach((d,i)=>d.classList.toggle('on',i===index));
  current=index;
  duration=+scenes[index].dataset.duration||5000;
  started=performance.now();
  animateCounter(scenes[index]);
  runProgress();
  timer=setTimeout(()=>showScene((index+1)%scenes.length),duration);
}

document.getElementById('replay').addEventListener('click',()=>showScene(0));
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showScene((current+1)%scenes.length); if(e.key==='ArrowLeft')showScene((current-1+scenes.length)%scenes.length)});

showScene(0);
