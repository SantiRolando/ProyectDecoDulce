import React from "react";
import logoImg from "../assets/DecoDulceIMG.png";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="fw-bold"><h3 className="mt-2">DecoDulce</h3></div>
        <img  src={logoImg} alt="LogoTopBar" className="LogoTopBar" />
      <div className="actions">Mi Usuario • 🔔</div>
    </header>
  );
}