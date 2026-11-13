import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { contentfulClient } from '../Contentfull';
import { useReveal } from '../lib/useReveal';
import haldenCover from '../assets/halden-cover.svg';
import '../css/portfolio.css';

gsap.registerPlugin(ScrollTrigger);

const pad = (n) => String(n).padStart(2, '0');

// Hard-coded project (not from Contentful). It replaces the old E-Commerce card.
const HALDEN = {
  title: 'Halden Unisex Salon',
  description:
    'A modern website for a unisex barbing and styling salon. It presents the brand, the services and the experience in a clean, mobile-first layout, so clients can see what is on offer and get in touch quickly.',
  tags: ['Responsive', 'Web Design', 'Netlify'],
  liveLink: 'https://haldenunisexsallon.netlify.app/',
  category: 'professional',
  image: haldenCover,
};

const isOldEcommerce = (item) => /e[-\s]?commerce site/i.test(item.title || '');
// ─── Category config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'all',
    label: 'All Projects',
    description: null,
  },
  {
    id: 'foundation',
    label: 'Foundation',
    description:
      'These projects were built during my learning phase — where I explored core web development concepts, practiced UI patterns, and developed the problem-solving mindset I carry into every project today.',
  },
  {
    id: 'professional',
    label: 'Professional',
    description:
      'Production-level work built with real engineering standards — clean architecture, scalable code, and polished user experience. These projects reflect my current capabilities as a software developer.',
  },
];

// Only Food Recipe and E-Commerce Platform are Foundation tier.
// Everything else is Professional automatically.
const FOUNDATION_TITLES = ['food recipe store', 'e-commerce site'];

const getItemCategory = (item) => {
  if (item.category === 'foundation' || item.category === 'professional') {
    return item.category;
  }
  const titleLower = (item.title || '').toLowerCase();
  if (FOUNDATION_TITLES.some((title) => titleLower === title)) {
    return 'foundation';
  }
  return 'professional';
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [images, setImages] = useState([]);
  const sectionRef = useRef(null);
  const stackRef = useRef(null);

  useEffect(() => {
    contentfulClient
      .getEntries({ content_type: 'myportfolio', limit: 1 })
      .then((res) => {
        if (!res.items.length) return;
        const fields = res.items[0].fields;
        setPortfolioItems(fields.portfolioView || []);
        setImages(fields.images || []);
      })
      .catch(console.error);
  }, []);

  // Map each project to its image by matching keywords in the image alt text
  const getImageForItem = (item) => {
    const titleLower = (item.title || '').toLowerCase();
    return images.find((img) => {
      const alt = (img.alt || '').toLowerCase();
      if (titleLower.includes('food') || titleLower.includes('recipe')) return alt.includes('food') || alt.includes('recipe');
      if (titleLower.includes('gym') || titleLower.includes('powerfit')) return alt.includes('gym') || alt.includes('powerfit');
      if (titleLower.includes('end to end') || titleLower.includes('platform')) return alt.includes('platform') || alt.includes('platform');
      if (titleLower.includes('commerce site') || titleLower.includes('ecommerce')) return alt.includes('ecommerce') || alt.includes('shopping') || alt.includes('shooping');
      if (titleLower.includes('full stack') || titleLower.includes('vanilla') || titleLower.includes('portfolio')) return alt.includes('vanilla') || alt.includes('portfolio');
      if (titleLower.includes('modern-engineering') || titleLower.includes('website')) return alt.includes('engineering') || alt.includes('website');
      return false;
    });
  };

  // Swap the old E-Commerce card for Halden, in the same position (card 4)
const allItems = (() => {
  if (!portfolioItems.length) return [];
  const idx = portfolioItems.findIndex(isOldEcommerce);
  if (idx !== -1) return portfolioItems.map((item, i) => (i === idx ? HALDEN : item));
  const copy = [...portfolioItems];
  copy.splice(Math.min(3, copy.length), 0, HALDEN);
  return copy;
})();

const filteredItems =
  activeFilter === 'all'
    ? allItems
    : allItems.filter((item) => getItemCategory(item) === activeFilter);

  const activeCategoryMeta = CATEGORIES.find((c) => c.id === activeFilter);

  useReveal(sectionRef, []);

  // Sticky stack: earlier cards recede (scale + shade) as each new card slides over them
  useLayoutEffect(() => {
    const root = stackRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 901px)' },
      (ctx) => {
        if (!ctx.conditions.motion) return;
        const top = ctx.conditions.desktop ? 112 : 84;
        const step = ctx.conditions.desktop ? 18 : 14;
        const cards = gsap.utils.toArray('.stack-card', root);
        const SCALE = 0.045;
        const SHADE = 0.14;

        // Image parallax inside each card
        cards.forEach((card) => {
          const img = card.querySelector('.stack-media img');
          if (!img) return;
          gsap.fromTo(
            img,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });

        // Depth: when card j arrives, every card beneath it steps back one level
        cards.forEach((card, j) => {
          if (j === 0) return;
          const stickAt = top + j * step;
          cards.slice(0, j).forEach((prev, i) => {
            const depth = j - i;
            const inner = prev.querySelector('.stack-card-inner');
            const shade = prev.querySelector('.stack-shade');
            const trigger = { trigger: card, start: 'top 92%', end: `top ${stickAt}px`, scrub: true };
            gsap.fromTo(
              inner,
              { scale: 1 - (depth - 1) * SCALE },
              { scale: 1 - depth * SCALE, ease: 'none', immediateRender: false, scrollTrigger: trigger }
            );
            gsap.fromTo(
              shade,
              { opacity: Math.min((depth - 1) * SHADE, 0.6) },
              { opacity: Math.min(depth * SHADE, 0.6), ease: 'none', immediateRender: false, scrollTrigger: trigger }
            );
          });
        });
      },
      root
    );

    return () => mm.revert();
  }, [activeFilter, portfolioItems.length, images.length]);

  return (
    <section id="portfolio" className="section portfolio" ref={sectionRef}>
      <div className="bg-blob bg-blob-2" />
      <div className="z1 portfolio-wrap">
        <div className="section-head" data-reveal>
          <div className="section-label">My Work</div>
          <h2 className="section-title">Recent Projects</h2>
          <p className="section-subtitle">
            A selection of projects that showcase my skills and attention to detail.
          </p>
        </div>

        {/* Filters */}
        <div className="portfolio-filters" data-reveal>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-btn${activeFilter === cat.id ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {activeCategoryMeta?.description && (
          <div className="category-description">
            <p>{activeCategoryMeta.description}</p>
          </div>
        )}

        {/* Sticky stack */}
        <div className="stack" ref={stackRef} key={activeFilter} style={{ '--n': filteredItems.length }}>
          {filteredItems.map((item, i) => {
           const imageUrl = item.image || getImageForItem(item)?.url;
            const category = getItemCategory(item);

            return (
              <article className="stack-card" key={item.title || i} style={{ '--i': i }}>
                <div className="stack-card-inner">
                  <div className="stack-info">
                    <div className="stack-meta">
                      <span className="stack-index">
                        {pad(i + 1)}
                        <i>/{pad(filteredItems.length)}</i>
                      </span>
                      <span className="stack-cat">{category}</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    {item.tags?.length > 0 && (
                      <ul className="stack-tags">
                        {item.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}

                    <div className="stack-links">
                      {item.liveLink && (
                        <a href={item.liveLink} target="_blank" rel="noreferrer" className="stack-link stack-link--main">
                          Live preview <FiArrowUpRight aria-hidden="true" />
                        </a>
                      )}
                      {item.githubLink && (
                        <a href={item.githubLink} target="_blank" rel="noreferrer" className="stack-link">
                          <FaGithub aria-hidden="true" /> Source
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="stack-media">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title} loading="lazy" />
                    ) : (
                      <div className="stack-media-fallback" />
                    )}
                  </div>

                  <div className="stack-shade" aria-hidden="true" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;