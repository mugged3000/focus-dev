import React, { useEffect, useState } from 'react';
import { MdLaptopMac, MdPhoneIphone } from 'react-icons/md';
import { GrDeploy } from 'react-icons/gr';
import { contentfulClient } from '../Contentfull';
import '../css/service.css';

const iconMap = {
  laptop: <MdLaptopMac size={32} />,
  mobile: <MdPhoneIphone size={32} />,
  deploy: <GrDeploy size={32} />,
};

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    contentfulClient
      .getEntries({ content_type: "myportfolio", limit: 1 })
      .then((res) => {
        if (!res.items.length) return;
        setServices(res.items[0].fields.services || []);
      })
      .catch(console.error);
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
              <span className="service-link">Learn more →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
