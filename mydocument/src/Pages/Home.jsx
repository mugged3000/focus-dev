import React, { useState, useEffect } from 'react';
import { FaGithub, FaCode, FaStar } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';
import { contentfulClient } from '../Contentfull';
import '../css/home.css';

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

const Home = () => {
  const [heroTitle, setHeroTitle] = useState(DEFAULT_TITLE);
  const [heroDescription, setHeroDescription] = useState(DEFAULT_DESC);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

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
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  const { lead, accent } = splitTitle(heroTitle);

  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        {/* ── Text Side ── */}
        <div className={`hero-text ${isLoading ? 'hero-loading' : 'hero-loaded'}`}>
          <div className="hero-availability">
            <span className="hero-availability-dot" aria-hidden="true" />
            <span className="hero-availability-text">Available for Hire</span>
          </div>

          <h1 className="hero-title">
            {lead && <>{lead} </>}
            <span className="highlight">{accent}</span>
          </h1>

          <p className="hero-desc">{heroDescription}</p>

          <div className="hero-text-actions">
            <button type="button" className="btn-primary-custom" onClick={() => scrollTo('portfolio')}>
              View My Work →
            </button>
            <button type="button" className="btn-outline-custom" onClick={() => scrollTo('contact')}>
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

        {/* ── Visual Side (no image, just the frame + floating cards) ── */}
        <div className="hero-visual">
          <div className="hero-img-wrap">
            <div className="hero-frame" aria-hidden="true" />

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
          scrollTo('about');
        }}
      >
        <div className="hero-scroll-line" />
        scroll
      </a>
    </section>
  );
};

export default Home;