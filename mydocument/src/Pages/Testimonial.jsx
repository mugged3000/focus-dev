import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { contentfulClient } from '../Contentfull';
import '../css/testimonail.css';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    contentfulClient
      .getEntries({ content_type: 'myportfolio', limit: 1 })
      .then((res) => {
        if (!res.items.length) return;
        const fields = res.items[0].fields;
        setTestimonials(fields.testimonial || []);
        setImages(fields.images || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const prev = () => setCurrent(p => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(p => (p + 1) % testimonials.length);

  return (
    <section id="testimonials" className="section testimonials">
      <div className="bg-blob bg-blob-1" />
      <div className="z1" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div className="section-head">
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">What Clients Say</h2>
          <p className="section-subtitle">Real feedback from the people I've had the pleasure of working with.</p>
        </div>

        <div className="testimonials-wrapper">
          {testimonials.map((t, index) => (
            <div key={t.id || index} className={`testimonial-card${index === current ? ' active' : ''}`}>
              <div className="testimonial-avatar">
                {images[index + 6]?.url
                  ? <img src={images[index + 6].url} alt={t.name} />
                  : <div className="testimonial-avatar-placeholder">{t.name?.[0] || 'C'}</div>
                }
              </div>

              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star${i < t.rating ? ' filled' : ''}`}>★</span>
                ))}
              </div>

              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-name">{t.name}</div>
              <div className="testimonial-role">{t.role}</div>
            </div>
          ))}

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button key={i} className={`t-dot${i === current ? ' active' : ''}`} onClick={() => setCurrent(i)} aria-label={`Go to testimonial ${i + 1}`} />
              ))}
            </div>
          )}

          {/* Arrows */}
          {testimonials.length > 1 && (
            <div className="testimonial-nav">
              <button className="t-arrow" onClick={prev} aria-label="Previous"><FaChevronLeft /></button>
              <button className="t-arrow" onClick={next} aria-label="Next"><FaChevronRight /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
