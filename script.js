(function(){
  var m=document.getElementById('marquee'),t=document.getElementById('track');
  if(!m||!t)return;
  var set=Array.prototype.slice.call(t.children);
  for(var i=0;i<3;i++)set.forEach(function(n){var c=n.cloneNode(true);c.setAttribute('aria-hidden','true');t.appendChild(c);});
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W=0,pos=0,paused=false,timer=null,last=0,SPEED=28;
  function measure(){W=t.scrollWidth/4;}
  function wrap(){if(m.scrollLeft<W*.5)m.scrollLeft+=W;else if(m.scrollLeft>W*2.5)m.scrollLeft-=W;}
  function hold(){paused=true;clearTimeout(timer);}
  function release(d){clearTimeout(timer);timer=setTimeout(function(){pos=m.scrollLeft;paused=false;},d||2200);}
  function tick(ts){
    var dt=Math.min(.05,(ts-last)/1000||0);last=ts;
    if(!paused&&!reduce){pos-=SPEED*dt;m.scrollLeft=pos;if(pos<W*.5||pos>W*2.5){wrap();pos=m.scrollLeft;}}
    else wrap();
    requestAnimationFrame(tick);
  }
  function start(){measure();m.scrollLeft=pos=W*2;requestAnimationFrame(tick);}
  window.addEventListener('load',start);
  window.addEventListener('resize',function(){var r=m.scrollLeft/(W||1);measure();m.scrollLeft=pos=r*W;});
  m.addEventListener('touchstart',hold,{passive:true});
  m.addEventListener('touchend',function(){release(2500);},{passive:true});
  m.addEventListener('wheel',function(){hold();release(2500);},{passive:true});
  m.addEventListener('mouseenter',hold);
  m.addEventListener('mouseleave',function(){if(!drag)release(800);});
  var drag=false,sx=0,sl=0;
  m.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;drag=true;sx=e.clientX;sl=m.scrollLeft;m.classList.add('drag');hold();});
  window.addEventListener('pointermove',function(e){if(!drag)return;m.scrollLeft=sl-(e.clientX-sx);});
  window.addEventListener('pointerup',function(){if(!drag)return;drag=false;m.classList.remove('drag');release(1500);});
})();
