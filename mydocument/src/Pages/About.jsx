import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
// import MyProfile from "/images/DP.jpg";
import { contentfulClient } from "../Contentfull.js"

const About = () => {
  const [skills, setSkills] = useState([]);
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [whoAm, setWhoAm]  = useState("");
 const [aboutImg, setAboutImg] = useState([]);

  
  // Stats configuration (UNCHANGED)
  const statsData = [
    { label: "Projects Completed", target: 3 },
    { label: "Years Experience", target: 4 },
    { label: "Client Satisfaction", target: 80 },
  ];

  const [counters, setCounters] = useState(statsData.map(() => 0));

  // 🔹 Fetch Contentful data (USING YOUR FIELD NAMES)
 useEffect(() => {
  contentfulClient
    .getEntries({
      content_type: "myportfolio",
      limit: 1,
    })
    .then((res) => {
      

      if (!res.items.length) return;

      const fields = res.items[0].fields;

      setSkills(fields.mySkill || []);
      setAboutTitle(fields.about || "");
      setAboutMe(fields.aboutMe || "");
      setWhoAm(fields.whoiam || "");
      setAboutImg(fields.images || [])
    })
    .catch((err) => console.error("Contentful error:", err));
}, []);




  // 🔹 Counter animation (UNCHANGED)
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prev) =>
        prev.map((count, i) => {
          if (count < statsData[i].target) {
            const inc = statsData[i].target > 10 ? 1 : 0.1;
            const next = Math.min(count + inc, statsData[i].target);
            return Math.round(next * 10) / 10;
          }
          return count;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="section about">
      <div className="bg-shape bg-circle"></div>
       <div className="bg-shape bg-triangle"></div>
      <Container>
        {/* About section title from Contentful */}
        <h2 className="section-title">{aboutTitle}</h2>
        <p className="section-subtitle">Get to know me better</p>

        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
             <div className="about-img">
          <img
          src={aboutImg[0]?.url || ""}
          alt={aboutImg[0]?.alt || "Profile"}
          className="img-fluid rounded"
        />

          </div>
          </div>

          <div className="col-lg-6">
            <h2>{whoAm}</h2>
            <p>{aboutMe}</p>

            {/* Skills from Contentful */}
            <div className="skills mt-5">
              <h3>My Skills</h3>
              <div className="skill-tags d-flex flex-wrap gap-2 mt-3">
                {skills.map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats (UNCHANGED) */}
        <div className="row mt-5">
          {statsData.map((stat, i) => (
            <div className="col-md-4" key={stat.label}>
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
