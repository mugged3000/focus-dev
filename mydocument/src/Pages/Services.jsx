import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { MdLaptopMac, MdPhoneIphone } from 'react-icons/md';
import { GrDeploy } from "react-icons/gr";
import { contentfulClient } from '../Contentfull';

const iconMap = {
  laptop: <MdLaptopMac size={48} />,
  mobile: <MdPhoneIphone size={48} />,
  deploy: <GrDeploy size={48} />
};

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    contentfulClient
      .getEntries({
        content_type: "myportfolio",
        limit: 1,
      })
      .then((res) => {
        if (!res.items.length) return;

        const fields = res.items[0].fields;
        setServices(fields.services || []);
      })
      .catch(console.error);
  }, []);

  return (
    <section id="services" className="section services">
      <div className="bg-shape bg-circle"></div>

      <Container>
        <h2 className="section-title">My Services</h2>
        <p className="section-subtitle">What I can do for you</p>

        <div className="row">
          {services.map((service, index) => (
            <div key={index} className="col-md-4 mb-4 mb-md-0">
              <div className="service-card p-4 text-center">
                <div className="service-icon mb-4">
                  {iconMap[service.icon]}
                </div>
                <h3>{service.title}</h3>
                <p className="mb-4">{service.description}</p>
                <Button variant="outline-primary">Learn More</Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Services;
