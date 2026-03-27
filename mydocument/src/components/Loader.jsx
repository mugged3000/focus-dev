import React from "react";
import "./Loader.css";

const Loader = () => (
  <div className="loader-wrapper">
    <div className="loader-logo">Focus<span>Dev</span></div>
    <div className="loader-ring" />
    <div className="loader-text">Loading...</div>
  </div>
);

export default Loader;
