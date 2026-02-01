import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import MyProfile from "/images/DP.jpg";

const About = () => {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "Node.js/Express.js",
    "React.js",
    "Vue.js",
    "React-Bootstrap",
    "Bootstrap",
    "Git",
    "Responsive Design",
    "GitHub",
    "Vite",
  ];

  // Stats configuration
  const statsData = [
    { label: "Projects Completed", target: 3 },
    { label: "Years Experience", target: 4 },
    { label: "Client Satisfaction", target: 80 },
  ];

  // State for dynamic counters
  const [counters, setCounters] = useState(statsData.map(() => 0));

 useEffect(() => {
  const interval = setInterval(() => {
    setCounters((prev) =>
      prev.map((count, i) => {
        if (count < statsData[i].target) {
          const increment = statsData[i].target > 10 ? 1 : 0.1; // small increment for small numbers
          const newCount = Math.min(count + increment, statsData[i].target);
          return Math.round(newCount * 10) / 10; // round to 1 decimal
        }
        return count;
      })
    );
  }, 100); // slower interval
  return () => clearInterval(interval);
}, []);


  return (
    <section id="about" className="section about">
      <div className="bg-shape bg-circle"></div>
      <div className="bg-shape bg-triangle"></div>
      <Container>
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">Get to know me better</p>

        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="about-img">
              <img
                src={MyProfile}
                alt="Your Name"
                className="img-fluid rounded"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-text">
              <h2>Who am I?</h2>
              <p>
                I'm <strong>Focus-Dev</strong>, a Software developer. building
                modern, responsive web applications. I work across frontend and
                backend, creating efficient, maintainable code while ensuring a
                smooth and user-friendly experience.
              </p>
              <p>
                My approach combines technical expertise with an eye for
                design, delivering projects that are both functional and
                visually engaging.
              </p>

              <div className="skills mt-5">
                <h3>My Skills</h3>
                <div className="skill-tags d-flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Counters */}
        <div className="row mt-5">
          {statsData.map((stat, i) => (
            <div className="col-md-4 mb-4 mb-md-0" key={stat.label}>
              <div className="stat-item text-center p-4">
                <div className="stat-number">
                  {counters[i]}
                  {stat.label === "Client Satisfaction" ? "%" : "+"}
                </div>
                <div className="stat-text">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default About;
