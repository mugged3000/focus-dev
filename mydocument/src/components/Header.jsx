import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../../public/images/focus-devx-logo.png';
import '../css/header.css';
const NAV_ITEMS = ['home', 'about', 'services', 'portfolio', 'testimonials', 'contact'];

const Header = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} data-theme={theme}>
      <div className="header-inner">
        {/* Logo */}
        <a
          href="#home"
          className="logo-wrap"
          aria-label="Focus_DevX home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('home');
          }}
        >
          <span className="logo-mark">
            <img src={logo} alt="" />
          </span>
          <span className="logo-text">
            FOCUS<span>_DEVX</span>
          </span>
        </a>

        {/* Nav */}
        <nav aria-label="Main navigation">
          <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a
                  href={`#${item}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item);
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            data-mode={theme}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <span className="toggle-thumb">
              {theme === 'light' ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
            </span>
          </button>

          <button
            type="button"
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;