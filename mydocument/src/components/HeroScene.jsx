import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PALETTE = {
  dark:  { gold: '#e2b44f', accent: '#8c98e0', fill: '#0e0e1a', fillAlpha: 0.62, dust: 0.8 },
  light: { gold: '#a97b14', accent: '#5c6bc0', fill: '#f9f8f6', fillAlpha: 0.78, dust: 0.9 },
};

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying float vH;
varying vec3 vNormal;
varying vec3 vView;
${NOISE}
void main(){
  float h = snoise(position * 0.85 + vec3(0.0, 0.0, uTime * 0.12))
          + snoise(position * 2.1 - vec3(uTime * 0.08)) * 0.25;
  vec3 displaced = position + normal * h * uAmp;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vH = h;
  vNormal = normalize(normalMatrix * normal);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform vec3 uGold;
uniform vec3 uAccent;
uniform vec3 uFill;
uniform float uFillAlpha;
varying float vH;
varying vec3 vNormal;
varying vec3 vView;

float contour(float f, float width){
  float w = max(fwidth(f), 1e-4);
  return 1.0 - smoothstep(0.0, w * width, abs(fract(f - 0.5) - 0.5));
}

void main(){
  float major = contour(vH * 8.0, 1.5);
  float minor = contour(vH * 32.0, 1.1);
  float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.6);

  vec3 ink = mix(uAccent, uGold, smoothstep(-0.7, 0.7, vH));
  float line = clamp(major + minor * 0.28 + rim * 0.55, 0.0, 1.0);

  #ifdef BACK
    gl_FragColor = vec4(ink, line * 0.22);
  #else
    gl_FragColor = vec4(mix(uFill, ink, line), clamp(line + uFillAlpha, 0.0, 1.0));
  #endif
  #include <colorspace_fragment>
}`;

const HeroScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return undefined; // No WebGL: the hero still works without the scene
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 9;

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.3 },
      uGold: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color() },
      uFill: { value: new THREE.Color() },
      uFillAlpha: { value: 0.7 },
    };

    const group = new THREE.Group();
    scene.add(group);

    // Topographic body: back faces drawn first, front faces on top
    const geometry = new THREE.IcosahedronGeometry(1.55, small ? 28 : 44);
    const backMat = new THREE.ShaderMaterial({
      uniforms, vertexShader: VERT, fragmentShader: FRAG,
      defines: { BACK: 1 }, side: THREE.BackSide, transparent: true, depthWrite: false,
    });
    const frontMat = new THREE.ShaderMaterial({
      uniforms, vertexShader: VERT, fragmentShader: FRAG,
      side: THREE.FrontSide, transparent: true,
    });
    const back = new THREE.Mesh(geometry, backMat);
    const front = new THREE.Mesh(geometry, frontMat);
    back.renderOrder = 0;
    front.renderOrder = 1;
    group.add(back, front);

    // Orbit ring + satellite
    const orbit = new THREE.Group();
    orbit.rotation.set(1.18, 0.28, 0);
    const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.0045, 8, 220), ringMat);
    const satMat = new THREE.MeshBasicMaterial();
    const sat = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 20), satMat);
    orbit.add(ring, sat);
    group.add(orbit);

    // Dust
    const count = small ? 260 : 520;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 3.2;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(ph) - 1;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dustMat = new THREE.PointsMaterial({ size: 0.03, transparent: true, depthWrite: false });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ── State ──
    const s = { tx: 0, ty: 0, mx: 0, my: 0, pulse: 0, scroll: 0, base: 1, angle: 0, visible: true };

    const applyTheme = (animate) => {
      const p = PALETTE[document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'];
      const dur = animate && !reduce ? 0.8 : 0;
      const gold = new THREE.Color(p.gold);
      const accent = new THREE.Color(p.accent);
      const fill = new THREE.Color(p.fill);
      gsap.to(uniforms.uGold.value, { r: gold.r, g: gold.g, b: gold.b, duration: dur, overwrite: true });
      gsap.to(uniforms.uAccent.value, { r: accent.r, g: accent.g, b: accent.b, duration: dur, overwrite: true });
      gsap.to(uniforms.uFill.value, { r: fill.r, g: fill.g, b: fill.b, duration: dur, overwrite: true });
      gsap.to(uniforms.uFillAlpha, { value: p.fillAlpha, duration: dur, overwrite: true });
      gsap.to(ringMat.color, { r: gold.r, g: gold.g, b: gold.b, duration: dur, overwrite: true });
      gsap.to(satMat.color, { r: gold.r, g: gold.g, b: gold.b, duration: dur, overwrite: true });
      gsap.to(dustMat.color, { r: accent.r, g: accent.g, b: accent.b, duration: dur, overwrite: true });
      dustMat.opacity = p.dust;
      if (reduce) renderOnce();
    };

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      s.base = Math.min(1, camera.aspect * 1.08);
      if (reduce) renderOnce();
    };

    const renderOnce = () => {
      group.scale.setScalar(s.base);
      group.rotation.set(0.18, 0.6, 0);
      renderer.render(scene, camera);
    };

    const onPointer = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      s.pulse = Math.min(1, s.pulse + Math.hypot(nx - s.tx, ny - s.ty) * 1.6);
      s.tx = nx;
      s.ty = ny;
    };

    const tick = (_time, deltaMs) => {
      const dt = Math.min(deltaMs / 1000, 0.05);
      const ease = 1 - Math.exp(-dt * 3.2);
      s.mx += (s.tx - s.mx) * ease;
      s.my += (s.ty - s.my) * ease;
      s.pulse *= Math.exp(-dt * 2.2);
      s.angle += dt * 0.35;

      uniforms.uTime.value += dt;
      uniforms.uAmp.value = 0.3 + s.pulse * 0.14 + s.scroll * 0.24;

      group.rotation.y = uniforms.uTime.value * 0.06 + s.mx * 0.55 + s.scroll * Math.PI * 0.9;
      group.rotation.x = 0.18 + s.my * 0.28 + s.scroll * 0.3;
      group.position.y = s.scroll * 0.9;
      group.scale.setScalar(s.base * (1 - s.scroll * 0.3));

      sat.position.set(Math.cos(s.angle) * 2.55, Math.sin(s.angle) * 2.55, 0);
      dust.rotation.y += dt * 0.02;
      dust.position.x = -s.mx * 0.25;
      dust.position.y = s.my * 0.15;

      renderer.render(scene, camera);
    };

    // ── Wire up ──
    resize();
    applyTheme(false);

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const themeObserver = new MutationObserver(() => applyTheme(true));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let scrollTween;
    let io;
    if (!reduce) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      scrollTween = gsap.to(s, {
        scroll: 1,
        ease: 'none',
        scrollTrigger: { trigger: mount.closest('.hero') || mount, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !s.visible) gsap.ticker.add(tick);
        if (!entry.isIntersecting && s.visible) gsap.ticker.remove(tick);
        s.visible = entry.isIntersecting;
      });
      io.observe(mount);
      gsap.ticker.add(tick);
      gsap.fromTo(mount, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.8, ease: 'expo.out', delay: 0.2 });
    }

    return () => {
      gsap.ticker.remove(tick);
      gsap.killTweensOf([mount, uniforms.uGold.value, uniforms.uAccent.value, uniforms.uFill.value, uniforms.uFillAlpha, ringMat.color, satMat.color, dustMat.color]);
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
      io?.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      geometry.dispose();
      backMat.dispose();
      frontMat.dispose();
      ring.geometry.dispose();
      ringMat.dispose();
      sat.geometry.dispose();
      satMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="hero-scene" aria-hidden="true" />;
};

export default HeroScene;