import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades + lifts every [data-reveal] element inside `scopeRef` as it enters the viewport.
 * Put data-reveal on wrappers, not on elements that have their own CSS transform transitions.
 */
export const useReveal = (scopeRef, deps = []) => {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const els = gsap.utils.toArray('[data-reveal]', scope);
        if (!els.length) return;
        gsap.set(els, { opacity: 0, y: 44 });
        ScrollTrigger.batch(els, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 1.15,
              ease: 'expo.out',
              stagger: 0.1,
              overwrite: true,
            }),
        });
      },
      scope
    );

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};