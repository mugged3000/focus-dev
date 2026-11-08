import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdLaptopMac, MdPhoneIphone, MdClose } from 'react-icons/md';
import { GrDeploy } from 'react-icons/gr';
import { contentfulClient } from '../Contentfull';
import '../css/service.css';

const iconMap = {
  laptop: <MdLaptopMac size={32} />,
  mobile: <MdPhoneIphone size={32} />,
  deploy: <GrDeploy size={32} />,
};

// Modal content, keyed by the same icon key used above.
// If a Contentful service includes its own `overview` / `points`, those win.
const DETAILS = {
  laptop: {
    overview:
      "I build websites and web applications from the ground up, from business sites and online stores to booking systems and custom platforms. Every project starts with what you need the site to do, then I design and build it to be fast, secure and easy to grow.",
    points: [
      'Business websites, landing pages and portfolios',
      'E-commerce stores with product management and checkout',
      'Custom web applications and admin dashboards',
      'Clean, maintainable code you can build on later',
      'Basic SEO setup and performance optimisation',
    ],
  },
  mobile: {
    overview:
      'Most visitors will open your site on a phone first, so every interface I build is designed for small screens and then scaled up cleanly to tablets and desktops.',
    points: [
      'Layouts tested across phone, tablet and desktop sizes',
      'Touch-friendly navigation and buttons',
      'Optimised images so pages load quickly on slower connections',
      'Consistent look across modern browsers',
      'Readable text sizes, contrast and keyboard support',
    ],
  },
  deploy: {
    overview:
      'Getting a project live should not be stressful. I set up hosting, domains and automated pipelines so every update is tested and published the same reliable way.',
    points: [
      'Hosting and domain setup with SSL',
      'Automated build and deploy from your Git repository',
      'Environment variables and secrets configured properly',
      'Staging and production setups when the project needs them',
      'Handover notes so you know how everything runs',
    ],
  },
};

const getDetails = (service) => {
  const base = DETAILS[service.icon] || {};
  return {
    overview: service.overview || base.overview || service.description,
    points:
      Array.isArray(service.points) && service.points.length
        ? service.points
        : base.points || [],
  };
};

/* ── Modal ── */
const ServiceModal = ({ service, index, closing, onClose }) => {
  const closeRef = useRef(null);
  const { overview, points } = getDetails(service);

  // Lock page scroll while open, and put focus on the close button
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, []);

  // Esc to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={`service-modal-overlay${closing ? ' is-closing' : ''}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        // The close button is the only focusable element, so keep focus on it
        if (e.key === 'Tab') {
          e.preventDefault();
          closeRef.current?.focus();
        }
      }}
    >
      <div
        className="service-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        <div className="service-modal-head">
          <div className="service-modal-id">
            <span className="modal-icon">
              {iconMap[service.icon] || <MdLaptopMac size={32} />}
            </span>
            <div>
              <p className="service-modal-kicker">Service 0{index + 1}</p>
              <h3 id="service-modal-title">{service.title}</h3>
            </div>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="service-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <MdClose size={22} />
          </button>
        </div>

        <div className="service-modal-body">
          <p className="service-modal-overview">{overview}</p>

          {points.length > 0 && (
            <>
              <p className="service-modal-label">What's included</p>
              <ul className="service-modal-list">
                {points.map((point, i) => (
                  <li key={i}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {point}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Section ── */
const Services = () => {
  const [services, setServices] = useState([]);
  const [active, setActive] = useState(null); // { service, index }
  const [closing, setClosing] = useState(false);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    contentfulClient
      .getEntries({ content_type: 'myportfolio', limit: 1 })
      .then((res) => {
        if (!res.items.length) return;
        setServices(res.items[0].fields.services || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openModal = (service, index, e) => {
    triggerRef.current = e.currentTarget;
    setActive({ service, index });
  };

  // Plays the exit animation, then unmounts and returns focus to the button
  const closeModal = useCallback(() => {
    if (closeTimer.current) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setActive(null);
      setClosing(false);
      closeTimer.current = null;
      triggerRef.current?.focus();
    }, 220);
  }, []);

  const fallback = [
    { icon: 'laptop', title: 'Web Development', description: 'Building fast, modern websites and web applications using the latest technologies.' },
    { icon: 'mobile', title: 'Responsive Design', description: 'Pixel-perfect interfaces that look and work beautifully on every screen size.' },
    { icon: 'deploy', title: 'Deployment & CI/CD', description: 'Seamless deployment pipelines so your product ships quickly and reliably.' },
  ];

  const items = services.length > 0 ? services : fallback;

  return (
    <section id="services" className="section services">
      <div className="bg-blob bg-blob-1" />
      <div className="z1" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div className="section-head">
          <div className="section-label">What I Do</div>
          <h2 className="section-title">My Services</h2>
          <p className="section-subtitle">Focused on delivering exceptional digital experiences from concept to deployment.</p>
        </div>

        <div className="services-grid">
          {items.map((service, index) => (
            <div key={index} className="service-card">
              <span className="service-number">0{index + 1}</span>
              <div className="service-icon-wrap">
                {iconMap[service.icon] || <MdLaptopMac size={32} />}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <button
                type="button"
                className="service-link"
                aria-haspopup="dialog"
                onClick={(e) => openModal(service, index, e)}
              >
                Learn more →
              </button>
            </div>
          ))}
        </div>
      </div>

      {active &&
        createPortal(
          <ServiceModal
            service={active.service}
            index={active.index}
            closing={closing}
            onClose={closeModal}
          />,
          document.body
        )}
    </section>
  );
};

export default Services;