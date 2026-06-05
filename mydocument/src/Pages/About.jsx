import React, { useState, useEffect } from "react";
import { contentfulClient } from "../Contentfull.js";
import "../css/about.css";

const About = () => {
  const [skills, setSkills] = useState([]);
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [whoAm, setWhoAm] = useState("");
  const [aboutImg, setAboutImg] = useState([]);

  const statsData = [
    { label: "Projects Completed", target: 40 },
    { label: "Years Experience", target: 5 },
    { label: "Client Satisfaction", target: 80 },
  ];
  const [counters, setCounters] = useState(statsData.map(() => 0));

  useEffect(() => {
    contentfulClient
      .getEntries({ content_type: "myportfolio", limit: 1 })
      .then((res) => {
        if (!res.items.length) return;
        const fields = res.items[0].fields;
        setSkills(fields.mySkill || []);
        setAboutTitle(fields.about || "");
        setAboutMe(fields.aboutMe || "");
        setWhoAm(fields.whoiam || "");
        setAboutImg(fields.images || []);
      })
      .catch((err) => console.error("Contentful error:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prev) =>
        prev.map((count, i) => {
          if (count < statsData[i].target) {
            const inc = statsData[i].target > 10 ? 1 : 0.1;
            return Math.min(Math.round((count + inc) * 10) / 10, statsData[i].target);
          }
          return count;
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="section about">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="z1" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div className="section-head">
          <div className="section-label">About Me</div>
          <h2 className="section-title">{aboutTitle || "Who I Am"}</h2>
          <p className="section-subtitle">Get to know the person behind the code</p>
        </div>

        <div className="about-layout">
          {/* Image */}
          <div className="about-img-wrap">
            <div className="about-img-frame">
              {aboutImg[0]?.url ? (
                <img src={aboutImg[0].url} alt={aboutImg[0].alt || "Profile"} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "var(--gradient)", minHeight: 400 }} />
              )}
            </div>
            <div className="about-img-badge">
              <strong>5+</strong>
              <span>Years Exp.</span>
            </div>
          </div>

          {/* Text */}
          <div className="about-text">
            <h2>{whoAm || "Front-End Developer & UI Craftsman"}</h2>
            <p>{aboutMe || "I'm a passionate developer who turns ideas into polished, user-centered digital products."}</p>

            <div className="skills-section">
              <h3>My Skills</h3>
              <div className="skill-tags">
                {skills.length > 0
                  ? skills.map((skill, i) => <span key={i} className="skill-tag">{skill}</span>)
                  : ["React","JavaScript","CSS","HTML","Node.js","Figma"].map((s, i) => (
                      <span key={i} className="skill-tag">{s}</span>
                    ))}
              </div>
            </div>

            <div style={{ marginTop: 36 }}>
              <a href="#contact" className="btn-primary-custom" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Work With Me →
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {statsData.map((stat, i) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-number">
                {counters[i]}{stat.label === "Client Satisfaction" ? "%" : "+"}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
