import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;


  const handleGoToCheckout = () => {
  onClose(); // Cierra el drawer del carrito si está abierto
  navigate('/checkout'); // Redirige a tu nueva página
};

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Fondo oscuro transparente */}
      <div 
        onClick={onClose} 
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(2px)' }} 
      />

      {/* Contenedor del panel lateral */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', backgroundColor: '#FDFBF7', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', zIndex: 1001, boxSizing: 'border-box' }}>
        
        {/* Cabecera del panel */}
        <div style={{ padding: '20px', borderBottom: '1px solid #EFECE6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#4A3525" />
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#4A3525' }}>Tu Carrito</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A3525', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Lista de productos */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '80px', color: '#8C6D53' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>🛒</span>
              <p style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#332211' }}>Tu carrito está vacío</p>
              <p style={{ fontSize: '13px', margin: 0 }}>Agregá algunas tortas deliciosas para empezar.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '12px', background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #EFECE6', alignItems: 'center' }}>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: '#332211' }}>{item.name}</h4>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#8C6D53' }}>$ {item.price}</p>
                  
                  {/* Control de cantidad */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ background: '#F7F3EE', border: '1px solid #EADCC9', width: '22px', height: '22px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#4A3525' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ background: '#F7F3EE', border: '1px solid #EADCC9', width: '22px', height: '22px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: '#B25A42', cursor: 'pointer', padding: '5px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer del Carrito (Total y botones) */}
        {cart.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid #EFECE6', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#7D6552', fontWeight: '500' }}>Total estimado:</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#332211' }}>$ {totalPrice}</span>
            </div>

            <button 
              onClick={handleGoToCheckout}
              style={{ width: '100%', background: '#4A3525', color: 'white', border: 'none', padding: '14px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px', boxShadow: '0 4px 12px rgba(74, 53, 37, 0.15)' }}
            >
              Finalizar Pedido
            </button>
            <button 
              onClick={clearCart}
              style={{ width: '100%', background: 'none', border: 'none', color: '#8C6D53', fontSize: '12px', cursor: 'pointer', padding: '5px' }}
            >
              Vaciar carrito
            </button>
          </div>
        )}

      </div>
    </div>
  );
};