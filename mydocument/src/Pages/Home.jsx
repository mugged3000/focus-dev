import React, { useState, useEffect, useLayoutEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaCode, FaStar } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';
import { contentfulClient } from '../Contentfull';
import { scrollToId } from '../lib/smoothScroll';
import '../css/home.css';

gsap.registerPlugin(ScrollTrigger);

// three.js is heavy, so it loads in its own chunk after the page is interactive
const HeroScene = lazy(() => import('../components/HeroScene'));

const DEFAULT_TITLE = 'Building Digital Experiences That Matter';
const DEFAULT_DESC =
  'Front-end developer specializing in crafting beautiful, fast, and accessible web applications.';

const splitTitle = (title) => {
  const words = title.trim().split(/\s+/);
  if (words.length <= 4) return { lead: '', accent: title };
  const mid = Math.ceil(words.length / 2);
  return {
    lead: words.slice(0, mid).join(' '),
    accent: words.slice(mid).join(' '),
  };
};

// Each word sits in a mask so it can rise into place
const Words = ({ text }) =>
  text
    .trim()
    .split(/\s+/)
    .map((word, i) => (
      <React.Fragment key={i}>
        <span className="w" aria-hidden="true">
          <span className="wi">{word}</span>
        </span>{' '}
      </React.Fragment>
    ));

const Home = () => {
  const rootRef = useRef(null);
  const [heroTitle, setHeroTitle] = useState(DEFAULT_TITLE);
  const [heroDescription, setHeroDescription] = useState(DEFAULT_DESC);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Safety net: show the default hero if the network is slow (content swaps in when it arrives)
    const fallbackTimer = setTimeout(() => !cancelled && setIsLoading(false), 1200);

    contentfulClient
      .getEntries({ content_type: 'myportfolio', limit: 1 })
      .then((res) => {
        if (cancelled || !res.items.length) return;
        const fields = res.items[0].fields;
        setHeroTitle(fields.hero || DEFAULT_TITLE);
        setHeroDescription(fields.heroDescription || DEFAULT_DESC);
      })
      .catch(console.error)
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Intro sequence + scroll-out, once the content is ready
  useLayoutEffect(() => {
    if (isLoading) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.fromTo('.hero-availability', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 })
          .fromTo('.hero-title .wi', { yPercent: 118, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1.35, stagger: 0.07 }, 0.1)
          .fromTo('.hero-desc', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1 }, 0.6)
          .fromTo('.hero-text-actions', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1 }, 0.72)
          .fromTo('.hero-badges', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 0.88)
          .fromTo('.hero-float-card', { opacity: 0 }, { opacity: 1, duration: 1.4, stagger: 0.25 }, 1.1);

        // Text drifts up and fades as the hero leaves
        gsap.to('.hero-text', {
          y: -70,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top+=160', scrub: true },
        });
      },
      root
    );

    return () => mm.revert();
  }, [isLoading]);

  const { lead, accent } = splitTitle(heroTitle);

  return (
    <section id="home" className="hero" ref={rootRef}>
      <div className="hero-inner">
        {/* ── Text Side ── */}
        <div className={`hero-text ${isLoading ? 'hero-loading' : ''}`}>
          <div className="hero-availability">
            <span className="hero-availability-dot" aria-hidden="true" />
            <span className="hero-availability-text">Available for Hire</span>
          </div>

          <h1 className="hero-title" aria-label={heroTitle}>
            {lead && <Words text={lead} />}
            <span className="highlight">
              <Words text={accent} />
            </span>
          </h1>

          <p className="hero-desc">{heroDescription}</p>

          <div className="hero-text-actions">
            <button type="button" className="btn-primary-custom" onClick={() => scrollToId('portfolio')}>
              View My Work →
            </button>
            <button type="button" className="btn-outline-custom" onClick={() => scrollToId('contact')}>
              Hire Me
            </button>
          </div>

          <div className="hero-badges">
            <div className="hero-badge">
              <span className="hero-badge-icon"><FaCode aria-hidden="true" /></span>
              Software Engineer
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon"><HiLightningBolt aria-hidden="true" /></span>
              Fast &amp; Accessible
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon"><FaStar aria-hidden="true" /></span>
              6 Years Exp.
            </div>
          </div>
        </div>

        {/* ── 3D Side ── */}
        <div className="hero-visual">
          <div className="hero-img-wrap">
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>

            <div className="hero-float-card card-a">
              <div className="float-card-icon"><FaStar aria-hidden="true" /></div>
              <div className="float-card-text">
                <strong>Projects Done</strong>
                <span>40+ Delivered</span>
              </div>
            </div>

            <div className="hero-float-card card-b">
              <div className="float-card-icon"><FaGithub aria-hidden="true" /></div>
              <div className="float-card-text">
                <strong>Open Source</strong>
                <span>Active Contributor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="hero-scroll"
        aria-label="Scroll to About section"
        onClick={(e) => {
          e.preventDefault();
          scrollToId('about');
        }}
      >
        <div className="hero-scroll-line" />
        scroll
      </a>
    </section>
  );
};

export default Home;