window.STAGE_FB={"silk": {"center": "/u-reference/silk-center-0.jpeg", "cover": "/u-reference/silk-cover-0.jpeg", "deep": "/u-reference/silk-deep-0.jpeg", "hot": "/u-reference/silk-hot-0.jpeg", "left": "/u-reference/silk-left-0.jpeg", "low": "/u-reference/silk-low-0.jpeg", "right": "/u-reference/silk-right-0.jpeg", "top": "/u-reference/silk-top-0.jpeg"}, "cube": {"bl": ["/u-reference/cube-bl-0.jpeg", "/u-reference/cube-bl-1.jpeg"], "br": ["/u-reference/cube-br-0.jpeg"], "corners": ["/u-reference/cube-corners-0.jpeg", "/u-reference/cube-corners-1.jpeg"], "countdown": ["/u-reference/cube-countdown-0.jpeg"], "cover": ["/u-reference/cube-cover-0.jpeg"], "hero": ["/u-reference/cube-hero-0.jpeg"], "low": ["/u-reference/cube-low-0.jpeg"], "pair": ["/u-reference/cube-pair-0.jpeg", "/u-reference/cube-pair-1.jpeg"], "right": ["/u-reference/cube-right-0.jpeg"], "seal": ["/u-reference/cube-seal-0.jpeg"], "top": ["/u-reference/cube-top-0.jpeg"], "tr": ["/u-reference/cube-tr-0.jpeg"], "trb": ["/u-reference/cube-trb-0.jpeg", "/u-reference/cube-trb-1.jpeg"]}};
/* U-Hackathon stage: the living background.
   Two WebGL layers behind the slides:
   - silk: a slow, dark flowing gradient (after the "Blue Modern" reference, page 1), rendered at half resolution;
   - glass: up to three iridescent glass cubes (after the "3D Glass" reference), rendered at full resolution.
   Each slide picks a preset (data-silk, data-cubes); the stage eases from one composition to the next.
   All positions are in 1920×1080 stage pixels, so the composition scales with reveal.js. */
(function () {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PRINT = /print-pdf|view=print/i.test(location.search);
  const STILL = RM || PRINT;
  const FORCE_FB = /[?&]nogl\b/i.test(location.search); // ?nogl previews the no-WebGL fallback

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  const SILK = `precision highp float;
uniform vec2 uRes; uniform float uT; uniform vec4 uRect;
uniform vec4 uG1; uniform vec4 uG2; uniform vec3 uTone; // glow 1/2: x, y (stage px), radius (px), strength; tone: blue, violet, cyan mix
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 s=(gl_FragCoord.xy-uRect.xy)/uRect.zw*vec2(1920.,1080.); s.y=1080.-s.y;
  vec2 p=s/1080.*.62; float t=uT*.03;
  vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+1.9*q+vec2(1.7,9.2)+.7*t),fbm(p+1.9*q+vec2(8.3,2.8)-.5*t));
  float f=fbm(p+2.1*r);
  // light only where the preset puts it, so text areas stay deep
  float m1=uG1.w*smoothstep(uG1.z,0.,length(s-uG1.xy));
  float m2=uG2.w*smoothstep(uG2.z,0.,length(s-uG2.xy));
  float m=clamp(m1+m2,0.,1.4);
  vec3 navy=vec3(.10,.009,.018), cobalt=vec3(.86,.025,.07), violet=vec3(.54,.01,.04), cyan=vec3(1.,.36,.40);
  float body=smoothstep(.3,.7,f);
  float ridge=pow(clamp(1.-abs(f-.6)*6.,0.,1.),4.);
  vec3 c=navy*.35*(.3+body);
  c+=mix(cobalt,violet,clamp(q.x*1.6-.35+uTone.y-.5,0.,1.))*(body*1.6+.18)*m;
  c+=cyan*ridge*1.1*m*uTone.z*body;
  float vig=smoothstep(1.25,.25,length((s-vec2(960.,540.))/vec2(1500.,900.)));
  c*=.55+.45*vig;
  gl_FragColor=vec4(c,1.);
}`;

  const GLASS = `precision highp float;
uniform vec2 uRes; uniform float uT; uniform vec4 uRect; uniform float uPx;
uniform vec4 uC[3]; uniform vec4 uR[3];
mat3 rot(vec3 a){float cx=cos(a.x),sx=sin(a.x),cy=cos(a.y),sy=sin(a.y),cz=cos(a.z),sz=sin(a.z);
  mat3 X=mat3(1,0,0,0,cx,sx,0,-sx,cx),Y=mat3(cy,0,-sy,0,1,0,sy,0,cy),Z=mat3(cz,sz,0,-sz,cz,0,0,0,1);return Y*X*Z;}
vec3 pal(float h){h=fract(h)*5.;
  vec3 c0=vec3(1.,.86,.86),c1=vec3(1.,.24,.28),c2=vec3(.85,.02,.08),c3=vec3(1.,.43,.48),c4=vec3(1.,.72,.72);
  if(h<1.)return mix(c0,c1,smoothstep(0.,1.,h));if(h<2.)return mix(c1,c2,smoothstep(1.,2.,h));
  if(h<3.)return mix(c2,c3,smoothstep(2.,3.,h));if(h<4.)return mix(c3,c4,smoothstep(3.,4.,h));return mix(c4,c0,smoothstep(4.,5.,h));}
float along(vec3 p){vec3 a=abs(p);return a.x<a.y&&a.x<a.z?p.x:(a.y<a.z?p.y:p.z);}
float crest(vec3 p){vec3 a=abs(p)/.5;float mx=max(a.x,max(a.y,a.z)),mn=min(a.x,min(a.y,a.z));return smoothstep(.975,.998,a.x+a.y+a.z-mx-mn);}
float edge(vec3 p,float w){vec3 a=abs(p)/.5;float mx=max(a.x,max(a.y,a.z)),mn=min(a.x,min(a.y,a.z));float mid=a.x+a.y+a.z-mx-mn;
  return smoothstep(1.-w,1.-w*.12,mid);}
vec3 nrm(vec3 p){vec3 a=abs(p);if(a.x>a.y&&a.x>a.z)return vec3(sign(p.x),0,0);if(a.y>a.z)return vec3(0,sign(p.y),0);return vec3(0,0,sign(p.z));}
void main(){
  vec2 s=(gl_FragCoord.xy-uRect.xy)/uRect.zw*vec2(1920.,1080.); s.y=1080.-s.y;
  vec3 col=vec3(0.); float al=0.;
  for(int i=0;i<3;i++){
    vec4 c=uC[i]; if(c.w<.003)continue;
    vec2 uv=(s-c.xy)/c.z; uv.y=-uv.y;
    float d=length(uv);
    // soft violet halo behind the glass
    col+=vec3(.9,.04,.12)*.11*c.w*exp(-max(d-.38,0.)*5.5);
    if(d>1.)continue;
    vec4 r=uR[i]; float sp=uT*r.w;
    mat3 M=rot(vec3(r.y+sp*.62,r.x+sp,r.z+sin(sp*.7)*.12));
    vec3 ro=vec3(0.,0.,-3.4),rd=normalize(vec3(uv,3.4));
    vec3 lo=ro*M,ld=rd*M; // into the cube's own frame
    vec3 t1=(-.5-lo)/ld,t2=(.5-lo)/ld,tn=min(t1,t2),tf=max(t1,t2);
    float a0=max(tn.x,max(tn.y,tn.z)),a1=min(tf.x,min(tf.y,tf.z));
    if(a1<=a0)continue;
    float cov=smoothstep(0.,uPx/c.z*2.2,a1-a0)*c.w;
    vec3 pe=lo+ld*a0,px=lo+ld*a1,n=nrm(pe),nb=-nrm(px);
    float fr=pow(1.-abs(dot(n,ld)),2.);
    float hue=dot(pe,vec3(1.1,1.5,.8))*.55+fr*.6+uT*.02+float(i)*.21;
    vec3 ir=pal(hue);
    float st=.45+.55*pow(.5+.5*sin(along(pe)*11.+hue*6.28+uT*.4),1.5);
    float ef=edge(pe,.17),eb=edge(px,.15);
    vec3 g=vec3(.65,.03,.08)*.05+vec3(1.,.25,.3)*fr*.22;            // the pane itself: faint violet, brighter at grazing angles
    g+=ir*ef*st*1.35+vec3(1.,.94,.94)*crest(pe)*.55;                                                     // front edges: thick, rainbow
    g+=pal(hue+.3)*eb*.55*(.5+.5*sin(along(px)*8.-hue*5.));                            // far edges, seen through the glass
    g+=vec3(1.)*pow(max(dot(reflect(ld,n),normalize(vec3(-.5,.7,-.5))),0.),36.)*.8*(.35+ef);
    float a=clamp(.08+fr*.2+ef*st*.8+eb*.35,0.,1.)*cov;
    col=col*(1.-a)+g*cov; al=al+(1.-al)*a;
  }
  gl_FragColor=vec4(col,al);
}`;

  function prog(gl, fs) {
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
    const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    gl.useProgram(p);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(p, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = {}; ['uRes', 'uT', 'uRect', 'uG1', 'uG2', 'uTone', 'uPx', 'uC', 'uR'].forEach(k => u[k] = gl.getUniformLocation(p, k));
    return u;
  }
  function layer(id, fs, scale, alpha) {
    const cv = document.createElement('canvas'); cv.id = id; cv.setAttribute('aria-hidden', 'true');
    document.getElementById('stagebg').appendChild(cv);
    const gl = cv.getContext('webgl', { alpha, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true });
    if (!gl) throw new Error('no WebGL context');
    cv.addEventListener('webglcontextlost', e => { if (!active) return; e.preventDefault(); toFallback('context lost'); });
    return { cv, gl, u: prog(gl, fs), scale };
  }

  /* ---------- presets (stage px) ---------- */
  // silk: [g1x, g1y, g1r, g1s, g2x, g2y, g2r, g2s, blue, violet, cyan]
  const SILK_P = {
    cover: [1500, 300, 1300, 1.0, 300, 1150, 900, .55, 0, .35, 1],
    right: [1750, 380, 1100, .62, 1100, 1250, 800, .22, 0, .8, .6],
    left: [100, 800, 1000, .5, 1600, -200, 800, .3, 0, .8, .5],
    low: [960, 1400, 1200, .6, 1850, -50, 700, .25, 0, .75, .6],
    top: [1150, -300, 1200, .6, 200, 1250, 700, .18, 0, .75, .6],
    center: [1500, 900, 1000, .5, 300, -100, 700, .25, 0, .8, .6],
    deep: [960, 1250, 1000, .45, 960, -200, 700, .2, 0, .8, .4],
    hot: [960, 620, 1200, 1.1, 1600, 100, 800, .5, 0, .3, 1.2],
  };
  // cubes: [[x, y, size, alpha, yaw, pitch, roll, spin], ...] (max 3); missing cubes fade out where they are
  const CUBE_P = {
    none: [],
    cover: [[1590, 560, 470, 1, .7, .55, .2, .16]],
    hero: [[960, 540, 520, 1, .7, .6, .1, .2]],
    tr: [[1820, 120, 420, 1, .4, .9, .3, .12]],
    trb: [[1790, 130, 380, 1, .4, .9, .3, .12], [1280, 1070, 360, 1, 1.2, .3, .5, -.1]],
    br: [[1700, 1000, 440, 1, 1., .4, .2, .1]],
    bl: [[560, 1060, 360, 1, .9, .6, .3, .12], [1180, -40, 300, 1, .2, .8, .1, -.1]],
    right: [[1500, 560, 500, 1, .6, .5, .15, .14]],
    pair: [[1520, 260, 360, 1, .5, .7, .3, .14], [1260, 900, 420, 1, 1.1, .4, .1, -.12]],
    corners: [[1830, 140, 400, 1, .4, .9, .3, .11], [40, 650, 340, 1, 1.0, .5, .4, -.1]],
    low: [[960, 1180, 520, 1, .8, .5, .2, .1]],
    top: [[1100, -60, 380, 1, .3, .8, .2, .12]],
    countdown: [[960, 540, 640, .55, .7, .6, .1, .35]],
    seal: [[960, 420, 430, 1, .7, .6, .1, .32]],
  };

  let silk, glass, curS, curC, fromS, fromC, toS, toC, t0 = 0, dur = 1800, start = performance.now();
  const pad = a => { const o = a.map(c => c.slice()); while (o.length < 3) o.push(null); return o; };
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  function rect(l) {
    const r = document.getElementById('stagebg').getBoundingClientRect(), k = l.cv.width / r.width;
    return [0, 0, l.cv.width, l.cv.height];
  }
  function size(l) {
    const dpr = Math.min(devicePixelRatio || 1, 2) * l.scale, w = Math.round(document.getElementById('stagebg').getBoundingClientRect().width * dpr), h = Math.round(document.getElementById('stagebg').getBoundingClientRect().height * dpr);
    if (l.cv.width !== w || l.cv.height !== h) { l.cv.width = w; l.cv.height = h; l.gl.viewport(0, 0, w, h); }
  }
  function blend(now) {
    const k = STILL ? 1 : ease(Math.min(1, (now - t0) / dur));
    curS = toS.map((v, i) => lerp(fromS[i], v, k));
    curC = toC.map((c, i) => {
      const f = fromC[i];
      if (!c && !f) return null;
      const a = f || [...c.slice(0, 3), 0, ...c.slice(4)], b = c || [...f.slice(0, 3), 0, ...f.slice(4)];
      return a.map((v, j) => lerp(v, b[j], k));
    });
  }
  let phase = [0, 0, 0];
  function frame(now) { if (!active) return;
    const T = STILL ? 6 : (now - start) / 1000;
    blend(now);
    if (silk) {
      const { gl, u } = silk; size(silk);
      gl.uniform2f(u.uRes, silk.cv.width, silk.cv.height); gl.uniform1f(u.uT, T); gl.uniform4f(u.uRect, ...rect(silk));
      gl.uniform4f(u.uG1, ...curS.slice(0, 4)); gl.uniform4f(u.uG2, ...curS.slice(4, 8)); gl.uniform3f(u.uTone, ...curS.slice(8, 11));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    if (glass) {
      const { gl, u } = glass; size(glass);
      const R = rect(glass), C = [], Rr = [];
      for (let i = 0; i < 3; i++) { const c = curC[i] || [0, 0, 1, 0, 0, 0, 0, 0]; C.push(c[0], c[1], c[2], c[3]); Rr.push(c[4], c[5], c[6], c[7]); }
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u.uRes, glass.cv.width, glass.cv.height); gl.uniform1f(u.uT, T); gl.uniform4f(u.uRect, ...R);
      gl.uniform1f(u.uPx, 1920 / R[2]); gl.uniform4fv(u.uC, C); gl.uniform4fv(u.uR, Rr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
  let raf = 0, active = false; function loop(now) { if (!active) return; if (!document.hidden) frame(now); if (!STILL) raf = requestAnimationFrame(loop); }

  /* ---------- fallback without WebGL (GPU off, blocklisted driver, lost context) ----------
     Stills of every preset, baked at build time by tools/make_fallback.mjs (window.STAGE_FB),
     cross-faded in the DOM. Cube stills are rendered on black and blended with "screen". */
  let fb = null, fbSilk = null, fbCubes = null;
  function toFallback(why) {
    if (fb) return;
    console.warn('stage: WebGL unavailable, using stills (' + why + ')');
    document.querySelectorAll('#stagebg canvas').forEach(c => c.remove());
    silk = glass = null;
    document.documentElement.classList.add('no-gl');
    const bg = document.getElementById('stagebg'), first = bg.firstChild;
    fb = document.createElement('div'); fb.className = 'fb'; bg.insertBefore(fb, first);
    fb.innerHTML = '<div class="fb-silk"></div><div class="fb-silk"></div><div class="fb-cubes"></div>';
    fbPlace(); addEventListener('resize', fbPlace);
    fbShow(fbSilk || 'cover', fbCubes || 'cover', true);
  }
  function fbPlace() {
    if (!fb) return;
    const r = document.querySelector('.stage').getBoundingClientRect(), c = fb.querySelector('.fb-cubes');
    Object.assign(c.style, { left: '0', top: '0', width: '100%', height: '100%' });
  }
  function fbShow(silkName, cubeName, now) {
    fbSilk = silkName; fbCubes = cubeName;
    if (!fb) return;
    const FB = window.STAGE_FB || { silk: {}, cube: {} };
    const sl = fb.querySelectorAll('.fb-silk'), on = sl[0].classList.contains('on') ? 1 : 0, src = FB.silk[silkName] || FB.silk.center;
    if (sl[1 - on].dataset.name !== silkName && sl[on].dataset.name !== silkName) {
      sl[1 - on].style.backgroundImage = src ? `url(${src})` : ''; sl[1 - on].dataset.name = silkName;
    }
    if (sl[on].dataset.name !== silkName) { sl[1 - on].classList.add('on'); sl[on].classList.remove('on'); }
    const box = fb.querySelector('.fb-cubes');
    if (box.lastChild && box.lastChild.dataset.name === cubeName) return;
    box.querySelectorAll('.grp').forEach(g => { g.classList.remove('on'); setTimeout(() => g.remove(), 1600); });
    const g = document.createElement('div'); g.className = 'grp'; g.dataset.name = cubeName;
    (CUBE_P[cubeName] || []).forEach((c, i) => {
      const u = (FB.cube[cubeName] || [])[i]; if (!u) return;
      const im = new Image(); im.src = u; im.alt = '';
      Object.assign(im.style, { left: (c[0] - c[2]) / 19.2 + '%', top: (c[1] - c[2]) / 10.8 + '%', width: c[2] / 9.6 + '%', animationDelay: -i * 3.7 + 's' });
      g.appendChild(im);
    });
    box.appendChild(g);
    if (now || STILL) g.classList.add('on'); else requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add('on')));
  }

  window.STAGE = {
    presets: { SILK_P, CUBE_P },
    init() { active = true;
      try { if (FORCE_FB) throw new Error('forced by ?nogl'); silk = layer('silk', SILK, .5, false); glass = layer('glass', GLASS, 1, true); }
      catch (e) { toFallback(e.message); }
      toS = fromS = curS = SILK_P.cover.slice(); toC = fromC = curC = pad(CUBE_P.cover);
      
      raf = requestAnimationFrame(loop);
    },
    set(silkName, cubeName) {
      const s = SILK_P[silkName] || SILK_P.center, c = CUBE_P[cubeName] || [];
      fromS = curS.slice(); fromC = curC.map(x => x && x.slice());
      toS = s.slice(); toC = pad(c); t0 = performance.now();
      fbShow(SILK_P[silkName] ? silkName : 'center', CUBE_P[cubeName] ? cubeName : 'none');
      if (STILL) requestAnimationFrame(frame);
    },
    // used by tools/make_fallback.mjs: show exactly these cubes, no easing
    _pose(silkName, cubes) { toS = fromS = curS = SILK_P[silkName].slice(); toC = fromC = curC = pad(cubes); t0 = 0; requestAnimationFrame(frame); },
    redraw() { requestAnimationFrame(frame); }, destroy() { active = false; cancelAnimationFrame(raf); for(const layer of [silk,glass]) if(layer) layer.gl.getExtension('WEBGL_lose_context')?.loseContext(); document.querySelectorAll('#stagebg canvas, #stagebg .fb').forEach(c=>c.remove()); silk=glass=null; fb=null; },
  };
})();
