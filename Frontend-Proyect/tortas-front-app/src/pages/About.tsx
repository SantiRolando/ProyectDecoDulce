import React, { useState } from 'react';
import { ArrowLeft, Heart, Award, Sparkles, MapPin, Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartDrawer } from '../components/CartDrawer';

export const About: React.FC = () => {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#FDFBF7', color: '#4A3525', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', borderBottom: '1px solid #EFECE6', background: '#FDFBF7', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#4A3525', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: '500' }}>
            <ArrowLeft size={18} /> Volver
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🍰</span>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', fontStyle: 'italic', color: '#4A3525' }}>Deco Dulce</h1>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '25px', fontSize: '14px', fontWeight: 500 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#8C6D53' }}>Inicio</Link>
          <Link to="/catalog" style={{ textDecoration: 'none', color: '#8C6D53' }}>Tortas</Link>
          <Link to="/customcake" style={{ textDecoration: 'none', color: '#8C6D53' }}>Personalizadas</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#4A3525', borderBottom: '2px solid #4A3525', paddingBottom: '2px' }}>Nosotros</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: '#8C6D53' }}>Contacto</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Search size={20} style={{ cursor: 'pointer', color: '#4A3525' }} />
          
          {/* ICONO DEL CARRITO CON CONTADOR Y APERTURA DE DRAWER */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={20} style={{ color: '#4A3525' }} />
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#8C6D53', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HERO SECCIÓN SOBRE NOSOTROS */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5ECE3', padding: '6px 16px', borderRadius: '20px', color: '#8C6D53', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
            <Heart size={14} /> NUESTRA HISTORIA Y PASIÓN
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 15px 0', color: '#332211', fontStyle: 'italic' }}>El arte de endulzar cada momento</h2>
          <p style={{ color: '#7D6552', fontSize: '16px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Creemos firmemente que cada festejo, reunión o tarde de domingo merece una torta hecha con dedicación, ingredientes reales y mucho amor.
          </p>
        </div>

        {/* IMAGEN Y BLOQUE PRINCIPAL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=80" 
              alt="Pastelería artesanal" 
              style={{ width: '100%', height: '350px', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '26px', fontWeight: 'bold', color: '#332211', marginBottom: '15px' }}>De nuestra cocina a tu mesa</h3>
            <p style={{ color: '#7D6552', fontSize: '14px', lineHeight: 1.7, marginBottom: '15px' }}>
              Deco Dulce nació como un pequeño proyecto impulsado por el amor a la repostería fina. Con los años, fuimos perfeccionando recetas clásicas y sumando propuestas modernas para convertirnos en parte de tus celebraciones más importantes.
            </p>
            <p style={{ color: '#7D6552', fontSize: '14px', lineHeight: 1.7 }}>
              Trabajamos de forma artesanal, seleccionando materias primas de primera calidad para garantizar que cada porción tenga un sabor único e inolvidable.
            </p>
          </div>
        </div>

        {/* VALORES / PILARES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '50px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #EFECE6', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '45px', height: '45px', background: '#F5ECE3', color: '#8C6D53', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
              <Sparkles size={20} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#332211', marginBottom: '10px' }}>Artesanal y Fresco</h4>
            <p style={{ fontSize: '13px', color: '#7D6552', lineHeight: 1.5, margin: 0 }}>
              Elaboramos cada pedido desde cero, asegurando frescura absoluta en bizcochos, cremas y coberturas.
            </p>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #EFECE6', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '45px', height: '45px', background: '#F5ECE3', color: '#8C6D53', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
              <Award size={20} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#332211', marginBottom: '10px' }}>Calidad Garantizada</h4>
            <p style={{ fontSize: '13px', color: '#7D6552', lineHeight: 1.5, margin: 0 }}>
              Utilizamos ingredientes seleccionados y chocolate real para lograr texturas y sabores inigualables.
            </p>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #EFECE6', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '45px', height: '45px', background: '#F5ECE3', color: '#8C6D53', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
              <MapPin size={20} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#332211', marginBottom: '10px' }}>Atención Cercana</h4>
            <p style={{ fontSize: '13px', color: '#7D6552', lineHeight: 1.5, margin: 0 }}>
              Escuchamos tus ideas para diseñar juntos la torta exacta que imaginas para tu evento.
            </p>
          </div>
        </div>

      </main>

      {/* COMPONENTE DE LA BARRA LATERAL DEL CARRITO */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    </div>
  );
};