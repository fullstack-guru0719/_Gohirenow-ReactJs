import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function UpgradeNow() {
  return (
    <Link to="/pricing">
      <div className="image-banner-wrapper">
        <img
          className="responsive-desktop"
          src={require("../../assets/upgrade_desktop.png")}
          alt=""
        />
        <img
          className="responsive-mobile"
          src={require("../../assets/upgrade_mobile.png")}
          alt=""
        />
      </div>
    </Link>
  );
}
