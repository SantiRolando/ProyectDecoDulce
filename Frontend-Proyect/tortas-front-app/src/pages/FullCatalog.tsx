import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartDrawer } from '../components/CartDrawer';
import { getCakes } from '../services/api';
import type { Cake } from '../services/api';

export const FullCatalog: React.FC = () => {
  const { addToCart, totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('categoria') || 'Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Cake | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    getCakes()
      .then(setAllProducts)
      .catch(() => setCatalogError('No se pudo conectar con el catálogo. Comprueba que el servidor esté activo.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSelectedCategory(searchParams.get('categoria') || 'Todas');
  }, [searchParams]);

  const categories = ['Todas', 'Clásicas', 'Especiales', 'Cumpleaños', 'Personalizadas'];

  // Filtrado por categoría y texto de búsqueda
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = () => {
    if (selectedProduct) {
      // Agrega el producto al carrito con la cantidad seleccionada en el modal
      for (let i = 0; i < quantity; i++) {
        addToCart({ 
          id: selectedProduct.id, 
          name: selectedProduct.name, 
          price: selectedProduct.price, 
          image: selectedProduct.imageUrl || '' 
        });
      }
    }
    setSelectedProduct(null);
    setQuantity(1);
  };

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
          <Link to="/catalog" style={{ textDecoration: 'none', color: '#4A3525', borderBottom: '2px solid #4A3525', paddingBottom: '2px' }}>Tortas</Link>
          <Link to="/customcake" style={{ textDecoration: 'none', color: '#8C6D53' }}>Personalizadas</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#8C6D53' }}>Nosotros</Link>
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

      {/* MAIN CONTAINER */}
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* TÍTULO Y BUSCADOR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#332211' }}>Nuestro Catálogo de Tortas</h2>
            <p style={{ color: '#7D6552', fontSize: '14px', margin: 0 }}>Elegí tu favorita, mirá sus detalles o pedila personalizada.</p>
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8C6D53' }} />
            <input 
              type="text" 
              placeholder="Buscar sabor, ingrediente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '25px', border: '1px solid #EADCC9', background: 'white', outline: 'none', fontSize: '14px', color: '#4A3525' }}
            />
          </div>
        </div>

        {/* FILTROS DE CATEGORÍA */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '35px', overflowX: 'auto', paddingBottom: '5px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                const nextParams = new URLSearchParams(searchParams);
                if (cat === 'Todas') nextParams.delete('categoria');
                else nextParams.set('categoria', cat);
                setSearchParams(nextParams);
              }}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: selectedCategory === cat ? 'none' : '1px solid #EADCC9',
                background: selectedCategory === cat ? '#4A3525' : 'white',
                color: selectedCategory === cat ? 'white' : '#7D6552',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: selectedCategory === cat ? '0 4px 10px rgba(74, 53, 37, 0.2)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRILLA DE PRODUCTOS */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '60px 0' }}>Conectando con el catálogo...</p>
        ) : catalogError ? (
          <p role="alert" style={{ textAlign: 'center', padding: '60px 0', color: '#a63f35' }}>{catalogError}</p>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#7D6552' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>No encontramos tortas con ese criterio</p>
            <p style={{ fontSize: '14px' }}>Intenta buscando con otra palabra o categoría.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #EFECE6', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'pointer' }}
                onClick={() => setSelectedProduct(product)}
              >
                <div>
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <img src={product.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(74, 53, 37, 0.85)', color: 'white', fontSize: '10px', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                      {product.category}
                    </span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 'bold', color: '#332211' }}>{product.name}</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#8C6D53', fontWeight: '500' }}>{product.portions}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#7D6552', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderTop: '1px solid #F7F3EE', background: '#FFFAFA' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#332211' }}>$ {product.price}</span>
                  <span style={{ background: '#F5ECE3', color: '#4A3525', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    Ver Detalle +
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* MODAL DE DETALLE DE PRODUCTO */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '800px', width: '100%', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
            
            <button 
              onClick={() => setSelectedProduct(null)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
            >
              ✕
            </button>

            <div>
              <img src={selectedProduct.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '350px' }} />
            </div>

            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ background: '#F5ECE3', color: '#8C6D53', fontSize: '11px', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {selectedProduct.category}
                </span>
                <h2 style={{ margin: '10px 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#332211' }}>{selectedProduct.name}</h2>
                <p style={{ color: '#8C6D53', fontSize: '13px', fontWeight: '600', marginBottom: '15px' }}>Rendimiento: {selectedProduct.portions}</p>
                <p style={{ color: '#7D6552', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>{selectedProduct.description}</p>
                
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#332211', marginBottom: '8px' }}>Cantidad:</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #EADCC9', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #EADCC9', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #EFECE6', paddingTop: '20px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#8C6D53' }}>Precio Total</p>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#332211' }}>$ {selectedProduct.price * quantity}</span>
                </div>
                <button 
                  onClick={handleAddToCart}
                  style={{ background: '#4A3525', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(74, 53, 37, 0.3)' }}
                >
                  Agregar al Carrito
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* COMPONENTE DE LA BARRA LATERAL DEL CARRITO */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    </div>
  );
};