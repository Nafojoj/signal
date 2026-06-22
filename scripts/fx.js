


function initScrollReveal() {
  var els = document.querySelectorAll(
    '.card,.cc,.bc,.tcard,.sfull,.sbox,.phero h1,.hero h1,.sec-title'
  );
  els.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.1});
  els.forEach(function(el){ obs.observe(el); });
}

function rerunReveal() {
  document.querySelectorAll('.card,.cc,.bc,.tcard,.sfull,.sbox').forEach(function(el) {
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
  });
  setTimeout(initScrollReveal, 40);
}



function initHeroCanvas() {
  var hero = document.querySelector('#page-home .hero');
  if (!hero) return;
  var old = hero.querySelector('.hcvs');
  if (old) old.remove();

  var cvs = document.createElement('canvas');
  cvs.className = 'hcvs';
  cvs.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  hero.style.position = 'relative';
  hero.insertBefore(cvs, hero.firstChild);
  Array.from(hero.children).forEach(function(c) {
    if (c !== cvs) { c.style.position='relative'; c.style.zIndex='1'; }
  });

  var ctx = cvs.getContext('2d');
  var W, H, tiles = [];
  var mx = -999, my = -999;
  var COLS = 16, ROWS = 7;
  var CLR = ['#b8ff45','#2952e3','#ff6fb7','#0e0e0e'];

  function resize() {
    W = cvs.width  = cvs.offsetWidth;
    H = cvs.height = cvs.offsetHeight;
    buildTiles();
  }

  function buildTiles() {
    tiles = [];
    var tw = W/COLS, th = H/ROWS;
    for (var r=0; r<ROWS; r++) {
      for (var c=0; c<COLS; c++) {
        tiles.push({
          x:c*tw, y:r*th, w:tw, h:th,
          color: Math.random()>0.82 ? CLR[Math.floor(Math.random()*CLR.length)] : null,
          baseAlpha: Math.random()*0.15 + 0.03,
          isCircle: Math.random() > 0.5
        });
      }
    }
  }

  hero.addEventListener('mousemove', function(e) {
    var r = cvs.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  }, {passive:true});
  hero.addEventListener('mouseleave', function() { mx=-999; my=-999; });

  function draw() {
    ctx.clearRect(0,0,W,H);
    var tw=W/COLS, th=H/ROWS;
    for (var i=0; i<tiles.length; i++) {
      var t = tiles[i];
      if (!t.color) continue;
      var cx = t.x+tw/2, cy = t.y+th/2;
      var dx = mx-cx, dy = my-cy;
      var dist = Math.sqrt(dx*dx+dy*dy);
      var inf = Math.max(0, 1-dist/180);
      var sc = 1+inf*0.35;
      var al = t.baseAlpha + inf*0.35;
      ctx.save();
      ctx.globalAlpha = al;
      ctx.fillStyle = t.color;
      ctx.translate(cx, cy);
      ctx.scale(sc, sc);
      ctx.beginPath();
      if (t.isCircle) {
        ctx.arc(0,0,Math.min(tw,th)*0.32,0,Math.PI*2);
      } else {
        var s = Math.min(tw,th)*0.5;
        ctx.rect(-s/2,-s/2,s,s);
      }
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}


function initCursor() {



  if (window.innerWidth < 768 || ('ontouchstart' in window)) return;

  document.body.style.cursor = 'none';

  var dot = document.createElement('div');
  dot.id = 'cur-dot-el';
  dot.style.cssText = [
    'position:fixed','top:0','left:0',
    'width:8px','height:8px',
    'background:#2952e3','border-radius:50%',
    'pointer-events:none','z-index:9999',
    'will-change:transform',
    'transition:background 0.12s, width 0.12s, height 0.12s'
  ].join(';');

  var ring = document.createElement('div');
  ring.id = 'cur-ring-el';
  ring.style.cssText = [
    'position:fixed','top:0','left:0',
    'width:30px','height:30px',
    'border:2px solid #2952e3','border-radius:50%',
    'pointer-events:none','z-index:9998',
    'will-change:transform',
    'transition:border-color 0.12s, width 0.18s, height 0.18s'
  ].join(';');

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mx=0, my=0, rx=0, ry=0;
  var dw=8, rw=30; // текущие размеры

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
  }, {passive:true});

  document.addEventListener('mouseover', function(e) {
    var hover = !!e.target.closest('button,a,.card,.cc,.bc,.tcard,.bsubmit');
    if (hover) {
      ring.style.width='50px'; ring.style.height='50px';
      ring.style.borderColor='#b8ff45';
      dot.style.background='#b8ff45';
      dot.style.width='10px'; dot.style.height='10px';
      rw=50; dw=10;
    } else {
      ring.style.width='30px'; ring.style.height='30px';
      ring.style.borderColor='#2952e3';
      dot.style.background='#2952e3';
      dot.style.width='8px'; dot.style.height='8px';
      rw=30; dw=8;
    }
  });

  (function loop() {
    rx += (mx-rx)*0.25;
    ry += (my-ry)*0.25;
    dot.style.transform  = 'translate('+(mx-dw/2)+'px,'+(my-dw/2)+'px)';
    ring.style.transform = 'translate('+(rx-rw/2)+'px,'+(ry-rw/2)+'px)';
    requestAnimationFrame(loop);
  })();
}


function initTilt() {
  document.querySelectorAll('.card,.cc,.bc,.tcard').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX-r.left)/r.width  - 0.5;
      var y = (e.clientY-r.top) /r.height - 0.5;
      el.style.transform = 'translate(-2px,-2px) rotateY('+(x*8)+'deg) rotateX('+(-y*8)+'deg) scale(1.015)';
    }, {passive:true});
    el.addEventListener('mouseleave', function() {
      el.style.transition = 'transform 0.35s ease, box-shadow 0.15s';
      el.style.transform = '';
      setTimeout(function(){ el.style.transition=''; }, 350);
    });
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';
  });
}


function initMarquee() {
  var track = document.querySelector('.mtrack');
  if (!track) return;
  var wrap = track.parentElement;
  wrap.addEventListener('mouseenter', function(){ track.style.animationPlayState='paused'; });
  wrap.addEventListener('mouseleave', function(){ track.style.animationPlayState='running'; });
}


var _cDone = new WeakSet();

function initCounters() {

  document.querySelectorAll('.mval').forEach(function(v) {
    if (!v.dataset.orig) v.dataset.orig = v.textContent.trim();
  });

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting || _cDone.has(entry.target)) return;
      _cDone.add(entry.target);
      var el = entry.target;
      var raw = el.dataset.orig || el.textContent.trim();
      var m = raw.match(/^([+\-x]?)(\d+\.?\d*)(.*)$/);
      if (!m) return;
      var pre=m[1], num=parseFloat(m[2]), suf=m[3];
      var start=null, dur=900;
      (function step(ts){
        if(!start) start=ts;
        var p = Math.min((ts-start)/dur, 1);
        var e2 = 1-Math.pow(1-p,3);
        el.textContent = pre+(Number.isInteger(num)?Math.round(num*e2):(num*e2).toFixed(1))+suf;
        if(p<1) requestAnimationFrame(step);
        else el.textContent = raw;
      })(performance.now());
    });
  }, {threshold:0.3});

  document.querySelectorAll('.mval').forEach(function(v){ obs.observe(v); });
}




function initNavLine() {
  var nav = document.querySelector('nav');
  if (!nav) return;
  var line = document.createElement('div');
  line.style.cssText = 'position:absolute;height:2px;background:#2952e3;bottom:0;left:0;width:0;transition:left 0.22s,width 0.22s;pointer-events:none;opacity:0;';
  nav.style.position='relative';
  nav.appendChild(line);
  nav.querySelectorAll('button').forEach(function(b){
    b.addEventListener('mouseenter',function(){
      var nr=nav.getBoundingClientRect(), br=b.getBoundingClientRect();
      line.style.left=(br.left-nr.left)+'px';
      line.style.width=br.width+'px';
      line.style.opacity='1';
    });
  });
  nav.addEventListener('mouseleave',function(){ line.style.opacity='0'; });
}



document.addEventListener('DOMContentLoaded', function() {
  initCursor();
  initHeroCanvas();
  initScrollReveal();
  initTilt();
  initMarquee();
  initCounters();
  initNavLine();
});



window.addEventListener('resize', function() {
  var dot = document.getElementById('cur-dot-el');
  var ring = document.getElementById('cur-ring-el');
  if (window.innerWidth < 768) {
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
    document.body.style.cursor = '';
  }
});

window.onPageChange = function() {
  rerunReveal();
  initTilt();
  initCounters();
  setTimeout(initHeroCanvas, 80);
};
