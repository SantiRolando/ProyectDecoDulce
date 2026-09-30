import { Link, useLocation } from 'react-router-dom';
import './SiteFooter.css';

export function SiteFooter({ force = false }: { force?: boolean }) {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin') || (pathname.startsWith('/legal/') && !force)) return null;

  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <Link className="site-footer-brand" to="/" aria-label="Deco Dulce, inicio">
          <span className="site-footer-mark">DD</span>
          <span>Deco Dulce<small>TORTAS ARTESANALES</small></span>
        </Link>
        <nav className="site-footer-links" aria-label="Enlaces legales">
          <Link to="/legal/terminos">Términos y condiciones</Link>
          <Link to="/legal/privacidad">Privacidad</Link>
        </nav>
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Deco Dulce. Todos los derechos reservados.</span>
        <span>Hecho con dedicación en Uruguay</span>
      </div>
    </footer>
  );
}
