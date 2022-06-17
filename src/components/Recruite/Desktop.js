import React from "react";
import { Link } from "react-router-dom";

export default function Recurite() {
  return (
    <a
      href="https://www.gohirenow.com/p/virtual-assistant-recruiting-service.html"
      style={{ width: "100%" }}
    >
      <div className="image-banner-wrapper rMargin">
        <img
          src={require("../../assets/recruite_desktop.png")}
          alt="Recruite Banner"
        />
      </div>
    </a>
  );
}
