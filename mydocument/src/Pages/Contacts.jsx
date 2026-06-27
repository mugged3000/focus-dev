import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiInstagram } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram , FaCodepen } from 'react-icons/fa';
import '../css/contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section contact">
      <div className="bg-blob bg-blob-2" />
      <div className="z1" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div className="section-head">
          <div className="section-label">Contact</div>
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-subtitle">Have a project in mind? I'd love to hear about it. Let's build something great.</p>
        </div>

        <div className="contact-layout">
          {/* Info */}
          <div>
            <h3 className="contact-info-title">Get In Touch</h3>
            <p className="contact-info-desc">
              I'm currently available for freelance projects and full-time opportunities.
              Feel free to reach out — I usually respond within 24 hours.
            </p>

            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-item-icon"><FiMail /></div>
                <div>
                  <div className="contact-item-label">Email</div>
                  {/* 📌 CONTENTFUL: store this as a field "contactEmail" */}
                  <div className="contact-item-value">franciscollins42@gmail.com</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><FiPhone /></div>
                <div>
                  <div className="contact-item-label">Phone</div>
                  {/* 📌 CONTENTFUL: store as "contactPhone" */}
                  <div className="contact-item-value">
                    +2347041964380 / +2349038375620 (WhatsApp)
                  </div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><FiMapPin /></div>
                <div>
                  <div className="contact-item-label">Location</div>
                  {/* 📌 CONTENTFUL: store as "contactLocation" */}
                  <div className="contact-item-value">Enugu, Nigeria</div>
                </div>
              </div>
            </div>

            <div className="contact-social-title">Find Me Online</div>
            <div className="contact-socials">
              <a href="https://github.com/mugged3000" target="_blank" className="social-pill"><FaGithub /> GitHub</a>
              <a href="https://www.linkedin.com/in/focus-devx/" target="_blank" className="social-pill"><FaLinkedin /> LinkedIn</a>
              <a href="https://x.com/Focus_DevX" target="_blank" className="social-pill"><FaTwitter /> Twitter</a>
              <a href="https://www.instagram.com/focus.devx_global?igsh=MXA1NHBoaGt6NGViZw==" target="_blank" className="social-pill"><FiInstagram /> Instagram</a>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap">
            <h3>Send a Message</h3>
            <p>Fill the form below and I'll get back to you as soon as possible.</p>

            <form action="https://formspree.io/f/xrbprbdd" method="post">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" placeholder="john@example.com" required />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" placeholder="Project Inquiry" />
              </div>

              <div className="form-field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" placeholder="Tell me about your project..." />
              </div>

              <button type="submit" className="form-submit">Send Message →</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
