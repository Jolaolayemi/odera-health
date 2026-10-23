(function(){
document.documentElement.classList.add('js');
var SERVICES=[
 {k:'gp',t:'General consultation',s:'From ₦15,000 · 20 min'},
 {k:'women',t:'Women\u2019s health',s:'30 min'},
 {k:'kids',t:'Children\u2019s health',s:'30 min'},
 {k:'chronic',t:'Hypertension & diabetes',s:'Review · 30 min'},
 {k:'lab',t:'Lab tests',s:'Home or walk-in'},
 {k:'mind',t:'Mental wellbeing',s:'45 min · video'}];
function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
ready(function(){
  // header + menu
  var header=document.querySelector('.site-header');
  var onScroll=function(){header&&header.classList.toggle('scrolled',window.scrollY>8);};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  var mb=document.getElementById('menuBtn'),nl=document.getElementById('navLinks');
  if(mb&&nl){mb.addEventListener('click',function(){var o=nl.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu');});
    nl.addEventListener('click',function(e){if(e.target.tagName==='A'){nl.classList.remove('open');mb.setAttribute('aria-expanded','false');}});}
  // reveals
  var els=[].slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(el){io.observe(el);});
  } else els.forEach(function(el){el.classList.add('in');});

  // booking
  var bk=document.getElementById('booker'); if(!bk) return;
  var icons={}; document.querySelectorAll('.svc').forEach(function(a,i){icons[SERVICES[i].k]=a.querySelector('.svc-ic').innerHTML;});
  var st={step:1,svc:null,day:null,time:null};
  var svcOpts=document.getElementById('svcOpts');
  SERVICES.forEach(function(s){var b=document.createElement('button');b.type='button';b.className='opt';b.setAttribute('role','radio');b.setAttribute('aria-checked','false');b.dataset.v=s.t;
    b.innerHTML='<span class="svc-ic">'+(icons[s.k]||'')+'</span><span>'+s.t+'<small>'+s.s+'</small></span>';
    b.addEventListener('click',function(){pick(svcOpts,b);st.svc=s.t;sync();});svcOpts.appendChild(b);});
  function pick(group,btn){group.querySelectorAll('[role=radio]').forEach(function(x){x.setAttribute('aria-checked',x===btn?'true':'false');});}
  // days
  var daysEl=document.getElementById('days'),DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var now=new Date(),list=[];
  for(var i=0;list.length<8&&i<14;i++){var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);if(d.getDay()===0)continue;list.push(d);}
  list.forEach(function(d,i){var b=document.createElement('button');b.type='button';b.className='day';b.setAttribute('role','radio');b.setAttribute('aria-checked','false');
    b.innerHTML='<small>'+(i===0?'Today':DN[d.getDay()])+'</small><b>'+d.getDate()+'</b><small>'+MN[d.getMonth()]+'</small>';
    b.addEventListener('click',function(){pick(daysEl,b);st.day=d;st.time=null;renderSlots();sync();});daysEl.appendChild(b);});
  var AM=['08:30','09:00','09:30','10:30','11:00','11:30'],PM=['13:00','14:30','15:00','16:00','17:30','18:30'];
  function renderSlots(){[['slotsAm',AM],['slotsPm',PM]].forEach(function(p){var el=document.getElementById(p[0]);el.innerHTML='';
    p[1].forEach(function(t,j){var b=document.createElement('button');b.type='button';b.className='slot';b.setAttribute('role','radio');b.setAttribute('aria-checked','false');b.textContent=t;
      var seed=st.day?(st.day.getDate()*7+j*3+p[0].length)%5:0;
      if(!st.day){b.disabled=true;} else {b.disabled=(seed===0);}
      b.addEventListener('click',function(){document.querySelectorAll('.slot').forEach(function(x){x.setAttribute('aria-checked',x===b?'true':'false');});st.time=t;sync();});
      el.appendChild(b);});});}
  renderSlots();
  var steps=bk.querySelectorAll('.bk-step'),prog=bk.querySelectorAll('.bk-progress li'),back=document.getElementById('bkBack'),next=document.getElementById('bkNext'),sum=document.getElementById('bkSum');
  var nextLbl=next.querySelector('span');
  function fmtDay(d){return DN[d.getDay()]+' '+d.getDate()+' '+MN[d.getMonth()];}
  function mode(){var m=bk.querySelector('input[name=mode]:checked');return m?m.value:'Video visit';}
  function valid(){if(st.step===1)return !!st.svc;if(st.step===2)return !!(st.day&&st.time);return true;}
  function sync(){
    steps.forEach(function(s){s.classList.toggle('on',+s.dataset.step===st.step);});
    prog.forEach(function(p){var n=+p.dataset.p;p.classList.toggle('on',n===st.step);p.classList.toggle('done',n<st.step);if(n===st.step)p.setAttribute('aria-current','step');else p.removeAttribute('aria-current');});
    back.disabled=st.step===1||st.step===4; next.disabled=!valid();
    nextLbl.textContent=st.step===3?'Confirm booking':st.step===4?'Book another':'Continue';
    var bits=[];if(st.svc)bits.push(st.svc);if(st.day)bits.push(fmtDay(st.day)+(st.time?' · '+st.time:''));
    sum.textContent=st.step<4?bits.join(' — '):'';
  }
  function go(n){st.step=n;sync();var top=bk.getBoundingClientRect().top;if(top<0||top>window.innerHeight*.5)bk.scrollIntoView({behavior:'smooth',block:'start'});
    var f=steps[n-1].querySelector('h3');if(f){f.setAttribute('tabindex','-1');f.focus({preventScroll:true});}}
  next.addEventListener('click',function(){
    if(st.step===3){var nm=document.getElementById('fName'),ph=document.getElementById('fPhone'),err=document.getElementById('formErr');
      var okN=nm.value.trim().length>1,digits=ph.value.replace(/\D/g,''),okP=digits.length>=10&&digits.length<=14;
      nm.setAttribute('aria-invalid',!okN);ph.setAttribute('aria-invalid',!okP);
      if(!okN||!okP){err.textContent=!okN?'Please add your name.':'Please add a phone number we can text (at least 10 digits).';(okN?ph:nm).focus();return;}
      err.textContent='';
      document.getElementById('cName').textContent=nm.value.trim().split(/\s+/)[0];
      document.getElementById('sSvc').textContent=st.svc;
      document.getElementById('sWhen').textContent=fmtDay(st.day)+', '+st.time;
      document.getElementById('sMode').textContent=mode();
      document.getElementById('sPhone').textContent=ph.value.trim();
      document.getElementById('sRef').textContent='OD-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-DEMO';
      go(4);return;}
    if(st.step===4){st={step:1,svc:null,day:null,time:null};bk.querySelectorAll('[role=radio]').forEach(function(x){x.setAttribute('aria-checked','false');});document.getElementById('details').reset();renderSlots();go(1);return;}
    if(valid())go(st.step+1);
  });
  back.addEventListener('click',function(){if(st.step>1)go(st.step-1);});
  document.getElementById('details').addEventListener('submit',function(e){e.preventDefault();});
  ['fName','fPhone'].forEach(function(id){document.getElementById(id).addEventListener('input',function(){this.removeAttribute('aria-invalid');document.getElementById('formErr').textContent='';});});
  // service links preselect
  document.querySelectorAll('[data-service]').forEach(function(a){a.addEventListener('click',function(){var b=svcOpts.querySelector('[data-v="'+a.dataset.service+'"]');if(b){pick(svcOpts,b);st.svc=b.dataset.v;if(st.step!==1){st.step=1;}sync();}});});
  sync();
});
})();
