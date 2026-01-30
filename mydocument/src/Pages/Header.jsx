import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaCode } from 'react-icons/fa';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setExpanded(false); 
    }
  };

  return (
    <header className={`fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <Navbar expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)} className="py-3">
        <Container>
          <Navbar.Brand href="#home" className="logo">
            <FaCode className="me-2" />
            Focus<span>Dev</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{border:"none",boxShadow:"none"}}/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => {scrollToSection('home'); }}>Home</Nav.Link>
              <Nav.Link onClick={() => scrollToSection('about')}>About</Nav.Link>
              <Nav.Link onClick={() => scrollToSection('services')}>Services</Nav.Link>
              <Nav.Link onClick={() => scrollToSection('portfolio')}>Portfolio</Nav.Link>
              <Nav.Link onClick={() => scrollToSection('testimonials')}>Testimonials</Nav.Link>
              <Nav.Link onClick={() => scrollToSection('contact')}>Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;