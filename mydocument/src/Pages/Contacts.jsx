import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaTwitter, FaDribbble, FaCodepen } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="section contact">
      <div className="bg-shape bg-circle"></div>
      <div className="bg-shape bg-triangle"></div>
      <Container>
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">Let's work together</p>
        
        <div className="row">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="contact-info">
              <h3 className="mb-4">Contact Information</h3>
              <p className="contact-text mb-4">I'm currently available for freelance work. If you have a project you'd like to discuss or just want to say hello, feel free to contact me.</p>
              
              <div className="contact-details mb-5">
                <div className="contact-item d-flex mb-4">
                  <div className="contact-icon me-3">
                    <FiMail size={24} />
                  </div>
                  <div className="contact-item-text">
                    <h4>Email</h4>
                    <p>franciscollins42@gmail.com</p>
                  </div>
                </div>
                <div className="contact-item d-flex mb-4">
                  <div className="contact-icon me-3">
                    <FiPhone size={24} />
                  </div>
                  <div className="contact-item-text">
                    <h4>Phone</h4>
                    <p>+2347041964380  or <br />
                        +2349038375620  (WhatsApp)
                    </p>
                  </div>
                </div>
                <div className="contact-item d-flex">
                  <div className="contact-icon me-3">
                    <FiMapPin size={24} />
                  </div>
                  <div className="contact-item-text">
                    <h4>Location</h4>
                    <p>Enugu Nigerial</p>
                  </div>
                </div>
              </div>
              
              <h3 className="mb-4">Follow Me</h3>
              <div className="social-links d-flex gap-3">
                <a href="#" className="social-link"><FaGithub /></a>
                <a href="#" className="social-link"><FaLinkedin /></a>
                <a href="#" className="social-link"><FaTwitter /></a>
                <a href="#" className="social-link"><FaDribbble /></a>
                <a href="#" className="social-link"><FaCodepen /></a>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <form className="contact-form" action="https://formspree.io/f/xrbprbdd" method="post">
              <div className="mb-4">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input type="text" className="form-control" id="name" placeholder="Name" required />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Your Email</label>
                <input type="email" className="form-control" id="email" placeholder="colins@example.com" required />
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input type="text" className="form-control" id="subject" placeholder="Place Word" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="form-label">Your Message</label>
                <textarea className="form-control" id="message" rows="5" placeholder="Hello, I'd like to talk about..."></textarea>
              </div>
              <Button type="submit" variant="primary">Send Message</Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Contact;