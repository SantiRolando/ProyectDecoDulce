import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Catalog } from './pages/Catalog';
import { FullCatalog } from './pages/FullCatalog';
import { CustomCake } from './pages/CustomCake';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { CartProvider } from './context/CartContext';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';
import { Legal } from './pages/Legal';
import { SiteFooter } from './components/SiteFooter';
import { useEffect, useState } from 'react';

// Importación del logo desde la carpeta assets
import decoLogo from './assets/DecoLogo.jpeg';

export function App() {
  
  const [bypass, setBypass] = useState(false);

  useEffect(() => {
    // Lee el token secreto configurado en las variables de entorno
    const secretToken = import.meta.env.VITE_ADMIN_BYPASS_TOKEN;
    const params = new URLSearchParams(window.location.search);
    const urlAccessKey = params.get('admin_access');

    // 1. Si la clave pasada por la URL coincide con el token de entorno
    if (secretToken && urlAccessKey === secretToken) {
      localStorage.setItem('dev_bypass_token', secretToken);
      setBypass(true);
      // Limpia la URL para no dejar la clave expuesta en la barra de direcciones del navegador
      window.history.replaceState({}, document.title, window.location.pathname);
    } 
    // 2. Si ya existía un token guardado previamente en este navegador
    else if (secretToken && localStorage.getItem('dev_bypass_token') === secretToken) {
      setBypass(true);
    }
  }, []);


  // Si el modo mantenimiento está activo Y el cliente no tiene el bypass validado
  if (import.meta.env.VITE_MAINTENANCE_MODE === 'true' && !bypass) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        backgroundColor: '#fff5f7',
        color: '#d63384',
        textAlign: 'center',
        padding: '20px'
      }}>
        {/* Logo de DecoDulce */}
        <img 
          src={decoLogo} 
          alt="Deco Dulce Logo" 
          style={{ 
            width: '200px', 
            height: 'auto', 
            marginBottom: '1.5rem',
            borderRadius: '12px' 
          }} 
        />
        <h2>Estamos preparando algo delicioso...</h2>
        <p>Nuestro sitio web estará disponible muy pronto.</p>
      </div>
    );
  }


  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Página de Inicio */}
          <Route path="/" element={<Catalog />} />
          
          {/* Página del Catálogo Completo y Detallado */}
          <Route path="/catalog" element={<FullCatalog />} />
          <Route path="/customcake" element={<CustomCake />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/legal/terminos" element={<Legal />} />
          <Route path="/legal/privacidad" element={<Legal />} />
        </Routes>
        <SiteFooter />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;