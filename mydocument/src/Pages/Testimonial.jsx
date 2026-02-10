import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { contentfulClient } from '../Contentfull';

// const TESTIMONIAL_IMAGE_OFFSET = 7;

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonial, setTestimonial] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    contentfulClient
      .getEntries({
        content_type: 'myportfolio',
        limit: 1,
      })
      .then((res) => {
        if (!res.items.length) return;

        const fields = res.items[0].fields;

        setTestimonial(fields.testimonial || []);
        setImages(fields.images || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!testimonial.length) return;

    const interval = setInterval(() => {
      setCurrentTestimonial(prev =>
        (prev + 1) % testimonial.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonial.length]);

  return (
    <section id="testimonials" className="section testimonials">
      <div className="bg-shape bg-circle"></div>
      <div className="bg-shape bg-triangle"></div>

      <Container>
        <h2 className="section-title">Client Testimonials</h2>
        <p className="section-subtitle">What my clients say about me</p>

        <div className="testimonial-slider">
          {testimonial.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`testimonial-item p-5 text-center ${
                index === currentTestimonial ? 'active' : 'd-none'
              }`}
            >
              <div className="testimonial-img mb-4 mx-auto">
                <img
                  src={images[index + 6]?.url}
                  alt={testimonial.name}
                  className="img-fluid rounded-circle"
                />
              </div>

              <p className="testimonial-text mb-4">
                {testimonial.text}
              </p>

              <div className="testimonial-author mb-1">
                {testimonial.name}
              </div>

              <div className="testimonial-role mb-3">
                {testimonial.role}
              </div>

              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < testimonial.rating
                        ? 'text-warning'
                        : 'text-secondary'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
