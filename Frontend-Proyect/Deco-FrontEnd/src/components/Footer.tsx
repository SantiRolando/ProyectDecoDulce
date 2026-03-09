// src/components/Footer.tsx
import React from 'react';
export default function Footer(){
  return (
    <footer className="footer">
      <small>© {new Date().getFullYear()} MiApp — Todos los derechos reservados</small>
    </footer>
  );
}