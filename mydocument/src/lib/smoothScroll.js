import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const HEADER_OFFSET = -72;

let lenis = null;

export const initSmoothScroll = () => {
  if (lenis) return () => {};

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.9,
    smoothWheel: !reduce,
    anchors: { offset: HEADER_OFFSET, duration: 1.6, easing: easeOutExpo },
  });

  // Keep ScrollTrigger and Lenis on the same clock
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis && lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
};

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.6, easing: easeOutExpo });
  } else {
    window.scrollTo({ top: el.offsetTop + HEADER_OFFSET, behavior: 'smooth' });
  }
};

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.8, easing: easeOutExpo });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const lockScroll = () => lenis?.stop();
export const unlockScroll = () => lenis?.start();