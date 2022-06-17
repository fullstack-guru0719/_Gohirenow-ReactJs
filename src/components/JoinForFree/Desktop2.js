import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function JoinForFree() {
  return (
    <Link to="/register">
      <div className="image-banner-wrapper edit-profile-banner">
        <img
          src={require("../../assets/join_desktop2.png")}
          alt="Join For Free Banner"
        />
      </div>
    </Link>
  );
}
