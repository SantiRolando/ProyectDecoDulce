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

export function App() {
  
  // Si la variable está activa, muestra la pantalla de sitio en construcción
  if (import.meta.env.VITE_MAINTENANCE_MODE === 'true') {
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
        <h1>🍰 Deco Dulce</h1>
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
        <Route path="/customcake" element={<CustomCake/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='checkout' element={<Checkout/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/legal/terminos' element={<Legal/>}/>
        <Route path='/legal/privacidad' element={<Legal/>}/>
      </Routes>
      <SiteFooter />
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;