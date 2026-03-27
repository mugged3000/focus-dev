import React, { useState, useEffect } from 'react';
import { FaCode } from 'react-icons/fa';

const Header = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const navItems = ['home','about','services','portfolio','testimonials','contact'];

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        {/* Logo */}
        <a href="#home" className="logo-wrap" onClick={e => { e.preventDefault(); scrollTo('home'); }}>
          <div className="logo-icon"><FaCode /></div>
          Focus<span>Dev</span>
        </a>

        {/* Nav */}
        <nav>
          <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
            {navItems.map(item => (
              <li key={item}>
                <a
                  href={`#${item}`}
                  onClick={e => { e.preventDefault(); scrollTo(item); }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <div className="toggle-thumb">
              {theme === 'light' ? '☀️' : '🌙'}
            </div>
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
