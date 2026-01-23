
import React from 'react';
import Header from './Pages/Header.jsx';
import Hero from  './Pages/Hero.jsx';
import About from './Pages/About.jsx';
import Services from './Pages/Services.jsx';
import Portfolio from './Pages/Portfolio.jsx';
import Testimonials from './Pages/Testimonial.jsx';
import Contact from './Pages/Contacts.jsx';
import Footer from './Pages/Footer.jsx';
import './App.css';

function App() {
  const devNmae = "focus-dev"
  return (
    <div className="App">
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer brandName={devNmae} />

    </div>
  );
}

export default App;