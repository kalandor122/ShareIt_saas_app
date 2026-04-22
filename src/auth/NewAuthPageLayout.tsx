import { ReactNode } from "react";
import logo from "../client/static/Sharenet.svg";
import "./NewAuthPageLayout.css";

export function NewAuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page-wrapper">
      {/* ── BACKGROUND ORBS ── */}
      <div className="orb of oa" style={{ width: '400px', height: '400px', background: 'var(--coral)', top: '-150px', right: '-100px' }}></div>
      <div className="orb of ob" style={{ width: '300px', height: '300px', background: 'var(--sky)', bottom: '-50px', left: '-50px' }}></div>
      <div className="orb os oa" style={{ width: '250px', height: '250px', borderColor: 'var(--lime)', top: '15%', left: '10%', animationDelay: '1s' }}></div>
      <div className="orb os ob" style={{ width: '180px', height: '180px', borderColor: 'var(--pink)', bottom: '20%', right: '8%', animationDelay: '2s' }}></div>

      <div className="auth-card">
        <div className="auth-logo-container">
          <img src={logo} alt="ShareIt Logo" className="auth-logo" />
        </div>
        {children}
      </div>
    </div>
  );
}
