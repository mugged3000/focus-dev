import React from "react";
import logo from "../../public/images/focus-devx-logo.png";
import "./Loader.css";

const Loader = () => (
  <div className="loader-wrapper" role="status" aria-live="polite">
    <div className="loader-emblem">
      <div className="loader-ring" aria-hidden="true" />
      <div className="loader-mark">
        <img src={logo} alt="" />
      </div>
    </div>

    <div className="loader-brand">
      <div className="loader-name">
        FOCUS<span>_DEVX</span>
      </div>
      <div className="loader-tag">Ideas to Reality</div>
    </div>

    <span className="loader-sr">Loading</span>
  </div>
);

export default Loader;