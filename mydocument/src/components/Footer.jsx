import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import logo from '../../public/images/focus-devx-logo.png';
import '../css/footer.css';

const ACCESS_KEY = 'a3645da5-7933-431c-a28d-340bab8e768d';

const NAV = ['home', 'about', 'services', 'portfolio', 'contact'];
const SERVICES = ['Web Development', 'Responsive Design', 'Web Applications', 'Maintenance'];
const SOCIALS = [
  { label: 'GitHub', icon: <FaGithub />, href: 'https://github.com/mugged3000' },
  { label: 'LinkedIn', icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/focus-devx/' },
  { label: 'Twitter', icon: <FaTwitter />, href: 'https://x.com/Focus_DevX' },
  { label: 'Instagram', icon: <FaInstagram />, href: 'https://www.instagram.com/focus.devx_global?igsh=MXA1NHBoaGt6NGViZw==' },
];

const Footer = ({ brandName, theme }) => {
  const [showArrow, setShowArrow] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onScroll = () => setShowArrow(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (e.target.botcheck.checked) return; // honeypot: bots tick it, humans never see it

    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: 'New newsletter subscriber',
          from_name: 'Focus_DevX Portfolio',
          email: value,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage("Thanks! You're subscribed.");
        setEmail('');
      } else {
        throw new Error(data.message || 'Request failed');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <footer className="ft" data-theme={theme}>
        <div className="ft-wrap">
          <div className="ft-grid">
            <div className="ft-brand">
              <a href="#home" className="ft-logo" aria-label="Focus_DevX home">
                <span className="ft-mark"><img src={logo} alt="" /></span>
                <span>
                  <span className="ft-name">FOCUS<span>_DEVX</span></span>
                  <span className="ft-tag">Ideas to Reality</span>
                </span>
              </a>
              <p>Software engineer passionate about designing and developing efficient, scalable applications that deliver real-world value.</p>
            </div>

            <div className="ft-col">
              <h4>Navigation</h4>
              <ul className="ft-links">
                {NAV.map((n) => (
                  <li key={n}><a href={`#${n}`}>{n.charAt(0).toUpperCase() + n.slice(1)}</a></li>
                ))}
              </ul>
            </div>

            <div className="ft-col">
              <h4>Services</h4>
              <ul className="ft-links">
                {SERVICES.map((s) => (
                  <li key={s}><a href="#services">{s}</a></li>
                ))}
              </ul>
            </div>

            <div className="ft-col">
              <h4>Stay Updated</h4>
              <p>Get the latest updates and insights delivered to your inbox.</p>

              <form className="ft-form" onSubmit={handleSubscribe} noValidate>
                <input
                  type="checkbox"
                  name="botcheck"
                  className="ft-hp"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email address"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                <button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe →'}
                </button>
                <p className={`ft-msg ${status}`} role="status" aria-live="polite">{message}</p>
              </form>
            </div>
          </div>

          <div className="ft-bottom">
            <p>© {new Date().getFullYear()} {brandName}. All Rights Reserved.</p>
            <div className="ft-social">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <a
        href="#home"
        className={`ft-top${showArrow ? ' visible' : ''}`}
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </a>
    </>
  );
};

export default Footer;