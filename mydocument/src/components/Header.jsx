import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaTimes } from 'react-icons/fa';
import logo from '../../public/images/focus-devx-logo.png';
import { scrollToId } from '../lib/smoothScroll';
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

  // While the menu is open: lock page scroll, close on Esc,
  // and close automatically if the screen grows to desktop size
  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const mq = window.matchMedia('(min-width: 901px)');
    const onChange = (e) => {
      if (e.matches) setMenuOpen(false);
    };

    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  const scrollTo = (id) => {
  scrollToId(id);
  setMenuOpen(false);
};

  const handleNav = (e, id) => {
    e.preventDefault();
    scrollTo(id);
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} data-theme={theme}>
        <div className="header-inner">
          {/* Logo */}
          <a
            href="#home"
            className="logo-wrap"
            aria-label="Focus_DevX home"
            onClick={(e) => handleNav(e, 'home')}
          >
            <span className="logo-mark">
              <img src={logo} alt="" />
            </span>
            <span className="logo-text">
              FOCUS<span>_DEVX</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Main navigation">
            <ul className="nav-links">
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <a href={`#${item}`} onClick={(e) => handleNav(e, item)}>
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
              className="hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <div
        className={`nav-backdrop${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-menu"
        className={`nav-drawer${menuOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="drawer-head">
          <span className="drawer-title">Menu</span>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <nav>
          <ul className="drawer-links">
            {NAV_ITEMS.map((item, i) => (
              <li key={item} style={{ '--i': i }}>
                <a href={`#${item}`} onClick={(e) => handleNav(e, item)}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="drawer-foot">Ideas to Reality</p>
      </aside>
    </>
  );
};

export default Header;