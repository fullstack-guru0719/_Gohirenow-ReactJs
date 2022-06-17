import React from "react";
import { Link } from "react-router-dom";

export default function UpgradeSmall() {
  return (
    <Link to="/pricing" style={{ width: "100%" }}>
      <div
        className="image-banner-wrapper"
        style={{ border: "1px solid rgb(225, 225, 225)" }}
      >
        <img src={require("../../assets/upgrade_small.png")} alt="" />
      </div>
    </Link>
  );
}
