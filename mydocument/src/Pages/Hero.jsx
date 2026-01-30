import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return ( 
    <section id="home" className="hero">
      <div className="bg-shape bg-circle"></div>
      <div className="bg-shape bg-triangle"></div>
      <Container className="h-100 d-flex align-items-center">
        <div className="hero-content text-center">
          <h1>Hello, I'm <span>Focus-Dev</span></h1>
          <p className="lead">
            I'm a passionate Full-Stack developer, building both frontend and backend solutions. I create modern, responsive web applications that are not only visually appealing but also fully functional, efficient, and user-friendly.
          </p>
          <div className="hero-btns mt-4">
            <Button variant="light" className="me-3" onClick={() => scrollToSection('portfolio')}>View My Work</Button>
            <Button variant="outline-light" onClick={() => scrollToSection('contact')}>Hire Me</Button>
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
