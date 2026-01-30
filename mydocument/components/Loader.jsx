import React from "react";
import "./Loader.css"; // plain CSS file for all styles

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center loader-wrapper">
      <div className="loader">
        Loading
        <span></span>
      </div>
    </div>
  );
};

export default Loader;
