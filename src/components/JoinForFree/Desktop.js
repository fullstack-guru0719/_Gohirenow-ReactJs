import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function JoinForFree() {
  return (
    <Link to="/register">
      <div className="image-banner-wrapper desktop-jff-banner">
        <img
          src={require("../../assets/join_desktop.png")}
          alt="Join For Free Banner"
        />
      </div>
    </Link>
  );
}
