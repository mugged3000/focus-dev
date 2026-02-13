// import React, { useEffect, useState } from 'react';
import Header from './Pages/Header.jsx';
import Hero from './Pages/Hero.jsx';
import About from './Pages/About.jsx';
import Services from './Pages/Services.jsx';
import Portfolio from './Pages/Portfolio.jsx';
import Testimonials from './Pages/Testimonial.jsx';
import Contact from './Pages/Contacts.jsx';
import Footer from './Pages/Footer.jsx';
// import Loader from '../components/Loader.jsx'; // 👈 loader

import './App.css';

function App() {


  const devName = "focus-dev";

  // // loader
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 2500);

  //   return () => clearTimeout(timer);
  // }, []);

  
  // if (loading) {
  //   return <Loader />;
  // }

  
  return (
    <div className="App">
      <Header />
      <Hero />
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
