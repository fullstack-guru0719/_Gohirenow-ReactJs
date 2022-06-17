import React from "react";
import { Link } from "react-router-dom";

export default function PostProjectBanner() {
  return (
    <Link to="/post-job">
      <div className="image-banner-wrapper dashboard-banner">
        <img
          className="responsive-desktop"
          src={require("../../assets/post_desktop.png")}
          alt=""
        />
        <img
          className="responsive-mobile"
          src={require("../../assets/post_mobile.png")}
          alt=""
        />
      </div>
    </Link>
  );
}
