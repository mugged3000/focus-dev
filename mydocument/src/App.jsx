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
import './App.css';

function App() {
  const devName = "focus-dev";
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
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
    </div>
  );
}

export default App;
