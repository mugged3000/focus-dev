import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaGithub, FaCode, FaStar } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';
import { contentfulClient } from '../Contentfull';
import '../css/home.css';

const Home = () => {
  const [heroTitle, setHeroTitle] = useState("Building Digital Experiences That Matter");
  const [heroDescription, setHeroDescription] = useState("Front-end developer specializing in crafting beautiful, fast, and accessible web applications.");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    contentfulClient
      .getEntries({ content_type: "myportfolio", limit: 1 })
      .then((res) => {
        if (!res.items.length) return;
        const fields = res.items[0].fields;
        setHeroTitle(fields.hero || heroTitle);
        setHeroDescription(fields.heroDescription || heroDescription);
        const heroImageUrl = fields.images?.[1]?.url;
        if (heroImageUrl) {
          document.documentElement.style.setProperty("--hero-bg-image", `url(${heroImageUrl})`);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        {/* ── Text Side ── */}
        <div className={`hero-text ${isLoading ? 'hero-loading' : 'hero-loaded'}`}>
          <div className="hero-eyebrow">
            <span>Available for work</span>
          </div>

          <h1 className="hero-title">
            {heroTitle.split(' ').length > 4 ? (
              <>
                {heroTitle.split(' ').slice(0, Math.ceil(heroTitle.split(' ').length / 2)).join(' ')}{' '}
                <span className="highlight">
                  {heroTitle.split(' ').slice(Math.ceil(heroTitle.split(' ').length / 2)).join(' ')}
                </span>
              </>
            ) : (
              <span className="highlight">{heroTitle}</span>
            )}
          </h1>

          <p className="hero-desc">{heroDescription}</p>

          <div className="hero-text-actions">
            <button className="btn-primary-custom" onClick={() => scrollTo('portfolio')}>
              View My Work →
            </button>
            <button className="btn-outline-custom" onClick={() => scrollTo('contact')}>
              Hire Me
            </button>
          </div>

          <div className="hero-badges">
            <div className="hero-badge">
              <span className="hero-badge-icon"><FaCode /></span>
             Software Engineer
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon"><HiLightningBolt /></span>
              Fast & Accessible
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon"><FaStar /></span>
              6 Years Exp.
            </div>
          </div>
        </div>

        {/* ── Visual Side ── */}
        <div className="hero-visual">
          <div className="hero-img-wrap">
            <div className="hero-img-frame">
              {/* Image set via Contentful via CSS variable; fallback gradient shown */}
              <div style={{
                width: '100%', height: '100%',
                background: 'var(--gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '5rem', color: 'rgba(255,255,255,0.3)'
              }}>
                <FaCode />
              </div>
            </div>

            {/* Floating card A */}
            <div className="hero-float-card card-a">
              <div className="float-card-icon"><FaStar /></div>
              <div className="float-card-text">
                <strong>Projects Done</strong>
                <span>40+ Delivered</span>
              </div>
            </div>

            {/* Floating card B */}
            <div className="hero-float-card card-b">
              <div className="float-card-icon"><FaGithub /></div>
              <div className="float-card-text">
                <strong>Open Source</strong>
                <span>Active Contributor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#about" className="hero-scroll" onClick={e => { e.preventDefault(); scrollTo('about'); }}>
        <div className="hero-scroll-line" />
        scroll
      </a>
    </section>
  );
};

export default Home;
