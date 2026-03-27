import React, { useState, useEffect } from 'react';
import { FaGithub, FaLink } from 'react-icons/fa';
import { contentfulClient } from '../Contentfull';
import '../css/portfolio.css';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    contentfulClient
      .getEntries({ content_type: "myportfolio", limit: 1 })
      .then((res) => {
        if (!res.items.length) return;
        const fields = res.items[0].fields;
        setPortfolioItems(fields.portfolioView || []);
        setImages(fields.images || []);
      })
      .catch(console.error);
  }, []);

  const filters = ['all', 'web', 'app', 'ecommerce', 'gym'];

  const filteredItems = activeFilter === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="section portfolio">
      <div className="bg-blob bg-blob-2" />
      <div className="z1" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div className="section-head">
          <div className="section-label">My Work</div>
          <h2 className="section-title">Recent Projects</h2>
          <p className="section-subtitle">A selection of projects that showcase my skills and attention to detail.</p>
        </div>

        {/* Filters */}
        <div className="portfolio-filters">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-btn${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="portfolio-grid">
          {filteredItems.map((item, index) => (
            <div key={item.id || index} className="portfolio-card">
              <div className="portfolio-img">
                {images[index + 2]?.url ? (
                  <img src={images[index + 2].url} alt={item.title} />
                ) : (
                  <div style={{ width:'100%', height:'100%', background:'var(--gradient)', opacity:0.6 }} />
                )}
                <div className="portfolio-overlay">
                  {item.githubLink && (
                    <a href={item.githubLink} target="_blank" rel="noreferrer" className="overlay-btn" aria-label="GitHub">
                      <FaGithub />
                    </a>
                  )}
                  {item.liveLink && (
                    <a href={item.liveLink} target="_blank" rel="noreferrer" className="overlay-btn" aria-label="Live preview">
                      <FaLink />
                    </a>
                  )}
                </div>
              </div>

              <div className="portfolio-info">
                {item.category && <div className="portfolio-category">{item.category}</div>}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="portfolio-tags">
                  {item.tags?.map(tag => <span key={tag} className="p-tag">{tag}</span>)}
                </div>
                {item.liveLink && (
                  <a href={item.liveLink} target="_blank" rel="noreferrer" className="portfolio-preview-btn">
                    Live Preview →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
