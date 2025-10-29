// SplashCursorEffect.jsx
import React, { useEffect } from "react";
import './SplashCursorEffect.css';

export default function SplashCursorEffect() {
  useEffect(() => {
    const handleClick = (e) => {
      for (let i = 0; i < 7; i++) {
        const splash = document.createElement('div');
        splash.className = 'splash-cursor-dot';
        splash.style.left = e.pageX + 'px';
        splash.style.top = e.pageY + 'px';
        splash.style.setProperty('--i', i);
        document.body.appendChild(splash);
        setTimeout(() => splash.remove(), 700);
      }
    };
    window.addEventListener("pointerdown", handleClick);
    return () => window.removeEventListener("pointerdown", handleClick);
  }, []);
  return null;
}
