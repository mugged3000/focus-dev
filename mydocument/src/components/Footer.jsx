import React, { useState, useEffect } from 'react';
import { FaCode, FaArrowUp, FaGithub, FaLinkedin, FaTwitter, FaDribbble, FaCodepen } from 'react-icons/fa';

const Footer = ({ brandName }) => {
  const [showArrow, setShowArrow] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => setShowArrow(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <a href="#home" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                <div className="logo-icon"><FaCode /></div>
                Focus<span style={{ color: 'var(--accent)' }}>Dev</span>
              </a>
              <p>Software engineer passionate about designing and developing efficient, scalable applications that deliver real-world value.</p>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul className="footer-list">
                {['home','about','services','portfolio','contact'].map(item => (
                  <li key={item}><a href={`#${item}`}>{item.charAt(0).toUpperCase() + item.slice(1)}</a></li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="footer-col">
              <h4>Services</h4>
              <ul className="footer-list">
                <li><a href="#services">Web Development</a></li>
                <li><a href="#services">Responsive Design</a></li>
                <li><a href="#services">Web Applications</a></li>
                <li><a href="#services">Maintenance</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-col">
              <h4>Stay Updated</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 16 }}>
                Get the latest updates and insights delivered to your inbox.
              </p>
              <div className="footer-newsletter">
                <input type="email" placeholder="your@email.com" />
                <button>Subscribe →</button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {year} {brandName}. All Rights Reserved. Crafted with care.</p>
            <div className="footer-social">
              <a href="#" aria-label="GitHub"><FaGithub /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Dribbble"><FaDribbble /></a>
              <a href="#" aria-label="CodePen"><FaCodepen /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <a
        href="#home"
        className={`back-to-top${showArrow ? ' visible' : ''}`}
        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </a>
    </>
  );
};

export default Footer;
