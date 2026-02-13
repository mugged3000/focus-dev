import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';
import { contentfulClient } from '../Contentfull';
import Loader from '../../components/Loaderdata';

const Hero = () => {
  const [heroTittle, setHeroTittle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentfulClient
      .getEntries({
        content_type: "myportfolio",
        limit: 1,
      })
      .then((res) => {
        if (!res.items.length) return;

        const fields = res.items[0].fields;

        setHeroTittle(fields.hero || "");
        setHeroDescription(fields.heroDescription || "");

        const heroImageUrl = fields.images?.[1]?.url;

        if (heroImageUrl) {
          document.documentElement.style.setProperty(
            "--hero-bg-image",
            `url(${heroImageUrl})`
          );
        }
      })
      .catch(console.error)
      .finally(() => {
      // ✅ SIMPLE 2.5s DELAY
      setTimeout(() => {
        setLoading(false);
      }, 2200);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <section id="home" className="hero">
      <div className="bg-shape bg-circle"></div>
      <div className="bg-shape bg-triangle"></div>

      <Container className="h-100 d-flex align-items-center">
        <div className="hero-content text-center">
          <h1>{heroTittle}</h1>
          <p className="lead">{heroDescription}</p>

          <div className="hero-btns mt-4">
            <Button variant="light" className="me-3">
              View My Work
            </Button>
            <Button variant="outline-light">
              Hire Me
            </Button>
          </div>
        </div>
      </Container>

      <a href="#about" className="scroll-down">
        <FaChevronDown />
      </a>
    </section>
  );
};

export default Hero;
