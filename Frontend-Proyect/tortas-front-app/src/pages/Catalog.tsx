import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, ArrowRight, Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartDrawer } from '../components/CartDrawer';
import { getCakes } from '../services/api';
import type { Cake } from '../services/api'; // <-- Importación estricta de tipo requerida por TypeScript

export const Catalog: React.FC = () => {
  const { addToCart, totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: 'Clásicas', subtitle: 'Los sabores de siempre', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80' },
    { id: 2, name: 'Especiales', subtitle: 'Para los más exigentes', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&q=80' },
    { id: 3, name: 'Cumpleaños', subtitle: 'Hacemos tus momentos más dulces', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=500&q=80' },
    { id: 4, name: 'Personalizadas', subtitle: 'Diseños únicos, como vos', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80' },
  ];

  // Consumimos la API a través de nuestro servicio centralizado
  useEffect(() => {
    getCakes()
      .then(data => {
        setFeaturedProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('No se pudieron cargar las tortas:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#FDFBF7', color: '#4A3525', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      
      {/* HEADER / NAVBAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', borderBottom: '1px solid #EFECE6', background: '#FDFBF7', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🍰</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', fontStyle: 'italic', color: '#4A3525' }}>Deco Dulce</h1>
            <p style={{ margin: 0, fontSize: '9px', letterSpacing: '1px', color: '#8C6D53' }}>TORTAS ARTESANALES</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '25px', fontSize: '14px', fontWeight: 500 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#4A3525', borderBottom: '2px solid #4A3525', paddingBottom: '2px' }}>Inicio</Link>
          <Link to="/catalog" style={{ textDecoration: 'none', color: '#8C6D53' }}>Tortas</Link>
          <Link to="/customcake" style={{ textDecoration: 'none', color: '#8C6D53' }}>Personalizadas</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#8C6D53' }}>Nosotros</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: '#8C6D53' }}>Contacto</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Search size={20} style={{ cursor: 'pointer', color: '#4A3525' }} />
          
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

      {/* HERO SECTION */}
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '60px 40px', background: '#F7F3EE', margin: '20px 40px', borderRadius: '16px' }}>
        <div style={{ maxWidth: '500px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#8C6D53', fontWeight: 'bold', marginBottom: '10px' }}>TORTAS ARTESANALES</p>
          <h2 style={{ fontSize: '42px', fontWeight: 'bold', color: '#332211', lineHeight: 1.1, margin: '0 0 15px 0' }}>La torta perfecta para cada ocasión</h2>
          <p style={{ color: '#7D6552', fontSize: '15px', marginBottom: '25px', lineHeight: 1.5 }}>Sabores únicos, ingredientes de calidad y todo el amor en cada detalle.</p>
          
          <button 
            onClick={() => navigate('/catalog')}
            style={{ background: '#4A3525', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            Ver nuestro catálogo <ArrowRight size={16} />
          </button>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80" alt="Torta principal" style={{ width: '400px', height: '350px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} />
        </div>
      </section>

      {/* CATEGORIES CIRCLES */}
      <section style={{ padding: '20px 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
        {categories.map(cat => (
          <Link key={cat.id} to={`/catalog?categoria=${encodeURIComponent(cat.name)}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #EADCC9', marginBottom: '10px' }}>
              <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ margin: '5px 0 2px 0', fontSize: '16px', fontWeight: 'bold' }}>{cat.name}</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#8C6D53' }}>{cat.subtitle}</p>
          </Link>
        ))}
      </section>

      {/* PRODUCTS SECTION / DESTACADOS DESDE EL BACKEND */}
      <section style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '11px', letterSpacing: '1px', color: '#8C6D53', fontWeight: 'bold' }}>NUESTRAS TORTAS</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>Destacados</h2>
          </div>
          <Link to="/catalog" style={{ fontSize: '13px', color: '#4A3525', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Ver todas las tortas <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#7D6552', padding: '30px' }}>Cargando tortas desde el servidor...</p>
        ) : featuredProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7D6552', padding: '30px' }}>No hay tortas disponibles en este momento.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {featuredProducts.map(prod => {
              const imageSrc = prod.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80';
              
              return (
                <div key={prod.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #EFECE6', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img src={imageSrc} alt={prod.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '15px' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{prod.name}</h3>
                      <p style={{ margin: 0, fontSize: '12px', color: '#7D6552', lineHeight: 1.4 }}>{prod.description}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderTop: '1px solid #F7F3EE' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>$ {prod.price}</span>
                    
                    <button 
                      onClick={() => addToCart({ id: prod.id, name: prod.name, price: prod.price, image: imageSrc })}
                      style={{ background: '#8C6D53', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* BANNER IDEA */}
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, #F5ECE3 0%, #EADCC9 100%)', margin: '20px 40px', padding: '40px', borderRadius: '16px' }}>
        <div style={{ maxWidth: '450px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', fontStyle: 'italic', margin: '0 0 10px 0', color: '#4A3525' }}>¿Tenés una idea?</h2>
          <p style={{ color: '#7D6552', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>Creamos la torta perfecta para tu evento, con el sabor y diseño que imaginas.</p>
          <button 
            onClick={() => navigate('/customcake')}
            style={{ background: '#4A3525', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '25px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Contactanos →
          </button>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&q=80" alt="Idea torta" style={{ width: '280px', height: '180px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 6px 15px rgba(0,0,0,0.08)' }} />
        </div>
      </section>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    </div>
  );
};