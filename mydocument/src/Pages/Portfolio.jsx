import React, { useState, useEffect } from 'react';
import { FaGithub, FaLink } from 'react-icons/fa';
import { contentfulClient } from '../Contentfull';
import '../css/portfolio.css';

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

// ─── Foundation keywords ───────────────────────────────────────────────────────
// Any project whose title includes one of these goes to Foundation.
// Everything else is Professional automatically.
// Only Food Recipe and E-Commerce Platform are Foundation tier.
// Everything else (Full-stack, Gym, End-to-End Commerce) is Professional automatically.
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

// ─── Image mapping ─────────────────────────────────────────────────────────────
// images[0] = profile dp
// images[1] = hero
// images[2..N] = project images, in the same order as portfolioView
// images[N+1], [N+2] = testimonial images (at the end)
// So project at portfolioView index i → images[i + 2]
// When you add a new project in Contentful, add its image at the matching
// position in the images array (before the testimonial images at the end).

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [images, setImages] = useState([]);

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
  // This is more reliable than relying on array order in Contentful
  const getImageForItem = (item) => {
    const titleLower = (item.title || '').toLowerCase();
    return images.find((img) => {
      const alt = (img.alt || '').toLowerCase();
      if (titleLower.includes('food') || titleLower.includes('recipe')) return alt.includes('food') || alt.includes('recipe');
      if (titleLower.includes('gym') || titleLower.includes('powerfit')) return alt.includes('gym') || alt.includes('powerfit');
      if (titleLower.includes('end-to-end') || titleLower.includes('platform')) return alt.includes('platform') || alt.includes('platform');
      if (titleLower.includes('e-commerce') || titleLower.includes('ecommerce')) return alt.includes('e-commerce') || alt.includes('shopping') || alt.includes('shooping');
      if (titleLower.includes('full-stack') || titleLower.includes('vanilla') || titleLower.includes('portfolio')) return alt.includes('vanilla') || alt.includes('portfolio');
      return false;
    });
  };

  const filteredItems =
    activeFilter === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => getItemCategory(item) === activeFilter);

  const activeCategoryMeta = CATEGORIES.find((c) => c.id === activeFilter);

  return (
    <section id="portfolio" className="section portfolio">
      <div className="bg-blob bg-blob-2" />
      <div className="z1" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div className="section-head">
          <div className="section-label">My Work</div>
          <h2 className="section-title">Recent Projects</h2>
          <p className="section-subtitle">
            A selection of projects that showcase my skills and attention to detail.
          </p>
        </div>

        {/* Filters */}
        <div className="portfolio-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn${activeFilter === cat.id ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Category description banner */}
        {activeCategoryMeta?.description && (
          <div className="category-description">
            <p>{activeCategoryMeta.description}</p>
          </div>
        )}

        {/* Grid */}
        <div className="portfolio-grid">
          {filteredItems.map((item) => {
            const imageUrl = getImageForItem(item)?.url;

            return (
              <div className="portfolio-card">
                <div className="portfolio-img">
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.title} />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'var(--gradient)',
                        opacity: 0.6,
                      }}
                    />
                  )}
                  <div className="portfolio-overlay">
                    {item.githubLink && (
                      <a
                        href={item.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="overlay-btn"
                        aria-label="GitHub"
                      >
                        <FaGithub />
                      </a>
                    )}
                    {item.liveLink && (
                      <a
                        href={item.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="overlay-btn"
                        aria-label="Live preview"
                      >
                        <FaLink />
                      </a>
                    )}
                  </div>
                </div>

                <div className="portfolio-info">
                  <div className="portfolio-category">
                    {getItemCategory(item)}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="portfolio-tags">
                    {item.tags?.map((tag) => (
                      <span key={tag} className="p-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {item.liveLink && (
                    <a
                      href={item.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="portfolio-preview-btn"
                    >
                      Live Preview →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;