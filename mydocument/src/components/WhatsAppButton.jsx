import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

const PHONE = '2349038375620'; // international format, no "+"
const MESSAGE = "Hi Focus_DevX, I saw your portfolio and I'd like to talk about a project.";

const WhatsAppButton = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Enter, then hop every few seconds
      gsap.fromTo(el, { y: 90, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, duration: 1.1, delay: 2.2, ease: 'back.out(1.7)' });

      const hop = gsap.timeline({ repeat: -1, repeatDelay: 2.6, delay: 4.2 });
      hop
        .to(el, { y: -22, duration: 0.34, ease: 'power2.out' })
        .to(el, { y: 0, duration: 1, ease: 'bounce.out' });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(el, { opacity: 1 });
    });

    return () => mm.revert();
  }, []);

  return (
    <a
      ref={ref}
      className="wa-fab"
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with me on WhatsApp"
    >
      <span className="wa-fab-label">Chat on WhatsApp</span>
      <span className="wa-fab-icon">
        <span className="wa-fab-ring" aria-hidden="true" />
        <FaWhatsapp aria-hidden="true" />
      </span>
    </a>
  );
};

export default WhatsAppButton;