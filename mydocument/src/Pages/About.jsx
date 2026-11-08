import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentfulClient } from "../Contentfull.js";
import { useReveal } from "../lib/useReveal";
import { scrollToId } from "../lib/smoothScroll";
import "../css/about.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [skills, setSkills] = useState([]);
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [whoAm, setWhoAm] = useState("");
  const [aboutImg, setAboutImg] = useState([]);

  const statsData = [
    { label: "Projects Completed", target: 40 },
    { label: "Years Experience", target: 6 },
    { label: "Client Satisfaction", target: 80 },
  ];
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const numRefs = useRef([]);

  useReveal(sectionRef, []);

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

  // Count up once, when the stats scroll into view
  useEffect(() => {
    const grid = statsRef.current;
    if (!grid) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const write = (i, v) => {
      const el = numRefs.current[i];
      if (el) el.textContent = Math.round(v);
    };

    if (reduce) {
      statsData.forEach((stat, i) => write(i, stat.target));
      return undefined;
    }

    const st = ScrollTrigger.create({
      trigger: grid,
      start: "top 85%",
      once: true,
      onEnter: () =>
        statsData.forEach((stat, i) => {
          const o = { v: 0 };
          gsap.to(o, {
            v: stat.target,
            duration: 2.2,
            delay: i * 0.12,
            ease: "power3.out",
            onUpdate: () => write(i, o.v),
          });
        }),
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="about" className="section about" ref={sectionRef}>
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="z1" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div className="section-head" data-reveal>
          <div className="section-label">About Me</div>
          <h2 className="section-title">{aboutTitle || "Who I Am"}</h2>
          <p className="section-subtitle">Get to know the person behind the code</p>
        </div>

        <div className="about-layout">
          {/* Image */}
          <div className="about-img-wrap" data-reveal>
            <div className="about-img-frame">
              {aboutImg[0]?.url ? (
                <img src={aboutImg[0].url} alt={aboutImg[0].alt || "Profile"} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "var(--gradient)", minHeight: 400 }} />
              )}
            </div>
            <div className="about-img-badge">
              <strong>6</strong>
              <span>Years Exp.</span>
            </div>
          </div>

          {/* Text */}
          <div className="about-text" data-reveal>
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
              <a href="#contact" className="btn-primary-custom" onClick={e => { e.preventDefault(); scrollToId('contact'); }}>
                Work With Me →
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" ref={statsRef}>
          {statsData.map((stat, i) => (
            <div key={stat.label} data-reveal>
              <div className="stat-card">
                <div className="stat-number">
                  <span ref={(el) => (numRefs.current[i] = el)}>0</span>
                  {stat.label === "Client Satisfaction" ? "%" : "+"}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;