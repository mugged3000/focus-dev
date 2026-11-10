import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import Services from './Pages/Services.jsx';
import Portfolio from './Pages/Portfolio.jsx';
import Testimonials from './Pages/Testimonial.jsx';
import Contact from './Pages/Contacts.jsx';
import Footer from './components/Footer.jsx';
import Loader from './components/Loader.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './lib/smoothScroll';
import { prefetchPortfolio } from './Contentfull';
import './App.css';

function App() {
  const devName = "focus-devX";
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fd-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fd-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Lenis smooth scroll, wired into GSAP's ticker
  useEffect(() => initSmoothScroll(), []);

  // Content arrives async (Contentful, images, fonts): keep ScrollTrigger measurements fresh
  useEffect(() => {
    let t;
    const refresh = () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 250);
    };
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener('load', refresh);
    };
  }, []);

  // Fetch the content while the loader plays, and only reveal the site once it's ready.
  // Minimum 1.8s so the loader never flashes, maximum 6s so a slow network can't trap the user.
  useEffect(() => {
    let cancelled = false;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const ready = Promise.all([wait(1800), prefetchPortfolio().catch(() => null)]);

    Promise.race([ready, wait(6000)]).then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="App" data-theme={theme}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Home />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer brandName={devName} />
      <WhatsAppButton />
    </div>
  );
}

export default App;