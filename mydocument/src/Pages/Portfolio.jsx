import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaGithub, FaLink } from 'react-icons/fa';
import { contentfulClient } from '../Contentfull';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    contentfulClient
      .getEntries({
        content_type: "myportfolio",
        limit: 1,
      })
      .then((res) => {
        if (!res.items.length) return;

        const fields = res.items[0].fields;

        setPortfolioItems(fields.portfolioView || []);
        setImages(fields.images || []);
      })
      .catch(console.error);
  }, []);

  const filteredItems =
    activeFilter === 'all'
      ? portfolioItems
      : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="section portfolio">
      <div className="bg-shape bg-circle"></div>
      <div className="bg-shape bg-triangle"></div>

      <Container>
        <h2 className="section-title">My Portfolio</h2>
        <p className="section-subtitle">Some of my recent work</p>

        {/* FILTER BUTTONS */}
        <div className="portfolio-filter d-flex justify-content-center flex-wrap mb-5">
          {["all", "web", "app", "ecommerce", "gym"].map(type => (
            <Button
              key={type}
              variant={activeFilter === type ? 'primary' : 'outline-primary'}
              className="me-2 mb-2"
              onClick={() => setActiveFilter(type)}
            >
              {type === "all" ? "All" : type}
            </Button>
          ))}
        </div>

        {/* PORTFOLIO GRID */}
        <div className="row">
          {filteredItems.map((item, index) => (
            <div key={item.id} className="col-lg-4 col-md-6 mb-4">
              <div className="portfolio-item">

                <div className="portfolio-img">
                  <img
                    src={images[index + 2]?.url}
                    alt={item.title}
                    className="img-fluid"
                  />

                  <div className="portfolio-overlay d-flex align-items-center justify-content-center">
                    {item.githubLink && (
                      <a href={item.githubLink} target="_blank" rel="noreferrer">
                        <FaGithub />
                      </a>
                    )}
                    {item.liveLink && (
                      <a href={item.liveLink} target="_blank" rel="noreferrer">
                        <FaLink />
                      </a>
                    )}
                  </div>
                </div>

                <div className="portfolio-info p-4">
                  <h3>{item.title}</h3>
                  <p className="mb-3">{item.description}</p>

                  <div className="portfolio-tags d-flex flex-wrap gap-2">
                    {item.tags?.map(tag => (
                      <span key={tag} className="portfolio-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    className="mt-3"
                    href={item.liveLink}
                    target="_blank"
                  >
                    Preview
                  </Button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Portfolio;
