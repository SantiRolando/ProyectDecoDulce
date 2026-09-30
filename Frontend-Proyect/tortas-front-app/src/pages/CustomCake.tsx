import React, { useState } from 'react';
import { ShoppingCart, ArrowLeft, Check, Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartDrawer } from '../components/CartDrawer';

export const CustomCake: React.FC = () => {
  const { addToCart, totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [size, setSize] = useState('10-12 porciones');
  const [flavor, setFlavor] = useState('Chocolate');
  const [filling, setFilling] = useState('Dulce de Leche');
  const [theme, setTheme] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Precios base según tamaño
  const basePrices: { [key: string]: number } = {
    '6-8 porciones': 900,
    '10-12 porciones': 1300,
    '15-20 porciones': 1800,
    '25+ porciones': 2400,
  };

  const totalPrice = basePrices[size] || 1300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Agregamos la torta personalizada directamente al carrito de compras
    addToCart({
      id: `custom-${Date.now()}`,
      name: `Torta Personalizada (${size})`,
      price: totalPrice,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
      customSize: size,
      customFlavor: flavor,
      customFilling: filling,
      customTheme: theme || 'A definir con el cliente',
    });

    setOrderSubmitted(true);
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
          <Link to="/catalog" style={{ textDecoration: 'none', color: '#8C6D53' }}>Tortas</Link>
          <Link to="/customcake" style={{ textDecoration: 'none', color: '#4A3525', borderBottom: '2px solid #4A3525', paddingBottom: '2px' }}>Personalizadas</Link>
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

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5ECE3', padding: '6px 16px', borderRadius: '20px', color: '#8C6D53', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
            <Sparkles size={14} /> DISEÑOS ÚNICOS, COMO VOS
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#332211' }}>Armá tu Torta Personalizada</h2>
          <p style={{ color: '#7D6552', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            Seleccioná las características de tu torta ideal. Nos encargaremos de hacer realidad esa idea especial para tu festejo.
          </p>
        </div>

        {orderSubmitted ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '50px', textAlign: 'center', border: '1px solid #EFECE6', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '60px', height: '60px', background: '#E5F4ED', color: '#2E7D32', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#332211', marginBottom: '10px' }}>¡Torta agregada al carrito con éxito!</h3>
            <p style={{ color: '#7D6552', fontSize: '14px', marginBottom: '25px', lineHeight: 1.5 }}>
              Guardamos los detalles de tu diseño personalizado. Ya podés revisar tu carrito o continuar agregando productos.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => setOrderSubmitted(false)}
                style={{ background: 'white', color: '#4A3525', border: '1px solid #EADCC9', padding: '10px 24px', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Diseñar otra torta
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                style={{ background: '#4A3525', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Ver Carrito
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '16px', padding: '35px', border: '1px solid #EFECE6', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', display: 'grid', gap: '30px' }}>
            
            {/* PASO 1: TAMAÑO */}
            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: 'bold', color: '#332211', marginBottom: '12px' }}>
                1. ¿Para cuántas personas es la torta?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                {Object.keys(basePrices).map((option) => (
                  <div 
                    key={option}
                    onClick={() => setSize(option)}
                    style={{ 
                      padding: '15px', 
                      borderRadius: '12px', 
                      border: size === option ? '2px solid #4A3525' : '1px solid #EADCC9', 
                      background: size === option ? '#FDF8F2' : 'white', 
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px' }}>{option}</p>
                    <span style={{ fontSize: '12px', color: '#8C6D53' }}>$ {basePrices[option]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PASO 2: BIZCOCHO */}
            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: 'bold', color: '#332211', marginBottom: '12px' }}>
                2. Elección de Bizcocho
              </label>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {['Chocolate', 'Vainilla', 'Marmoleado', 'Red Velvet'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFlavor(item)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '20px',
                      border: flavor === item ? 'none' : '1px solid #EADCC9',
                      background: flavor === item ? '#4A3525' : 'white',
                      color: flavor === item ? 'white' : '#7D6552',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* PASO 3: RELLENO */}
            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: 'bold', color: '#332211', marginBottom: '12px' }}>
                3. Relleno Principal (Hasta 2 opciones)
              </label>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {['Dulce de Leche', 'Ganache de Chocolate', 'Crema Chantilly y Frutos Rojos', 'Mousse de Maracuyá'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilling(item)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '20px',
                      border: filling === item ? 'none' : '1px solid #EADCC9',
                      background: filling === item ? '#4A3525' : 'white',
                      color: filling === item ? 'white' : '#7D6552',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* PASO 4: TEMÁTICA / DESCRIPCIÓN */}
            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: 'bold', color: '#332211', marginBottom: '8px' }}>
                4. ¿Tenés alguna temática o detalles específicos?
              </label>
              <p style={{ fontSize: '12px', color: '#8C6D53', margin: '0 0 10px 0' }}>Contanos colores, personajes, si lleva dedicatoria o alguna referencia especial.</p>
              <textarea 
                rows={4}
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ej: Torta temática de cumpleaños en tonos pasteles con detalles dorados..."
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #EADCC9', fontSize: '14px', outline: 'none', color: '#4A3525', fontFamily: 'inherit', boxSizing: 'border-box' }}
                required
              />
            </div>

            {/* RESUMEN Y BOTÓN DE ENVÍO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EFECE6', paddingTop: '25px', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#8C6D53' }}>Precio Estimado Base</p>
                <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#332211' }}>$ {totalPrice}</span>
              </div>
              <button 
                type="submit"
                style={{ background: '#4A3525', color: 'white', border: 'none', padding: '14px 30px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(74, 53, 37, 0.2)' }}
              >
                Agregar Torta Personalizada al Carrito
              </button>
            </div>

          </form>
        )}

      </main>

      {/* COMPONENTE DE LA BARRA LATERAL DEL CARRITO */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    </div>
  );
};