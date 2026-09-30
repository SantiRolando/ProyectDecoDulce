import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Check, Send, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartDrawer } from '../components/CartDrawer';

export const Contact: React.FC = () => {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <Link to="/customcake" style={{ textDecoration: 'none', color: '#8C6D53' }}>Personalizadas</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#8C6D53' }}>Nosotros</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: '#4A3525', borderBottom: '2px solid #4A3525', paddingBottom: '2px' }}>Contacto</Link>
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
        
        {/* TÍTULO SECCIÓN */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5ECE3', padding: '6px 16px', borderRadius: '20px', color: '#8C6D53', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
            <Mail size={14} /> ESTAMOS EN CONTACTO
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#332211', fontStyle: 'italic' }}>Hablemos de tu próximo evento</h2>
          <p style={{ color: '#7D6552', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            ¿Tenés alguna consulta sobre nuestros productos, querés encargar una torta o coordinar un pedido especial? Escribinos.
          </p>
        </div>

        {/* GRILLA DE INFORMACIÓN Y FORMULARIO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'start' }}>
          
          {/* INFORMACIÓN DE CONTACTO */}
          <div style={{ background: '#F7F3EE', padding: '35px', borderRadius: '16px', border: '1px solid #EADCC9', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#332211', margin: 0 }}>Información útil</h3>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ background: 'white', padding: '10px', borderRadius: '50%', color: '#8C6D53', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', fontWeight: 'bold', color: '#332211' }}>Zona de entrega</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#7D6552' }}>Piriápolis y Maldonado, Uruguay.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ background: 'white', padding: '10px', borderRadius: '50%', color: '#8C6D53', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
                <Phone size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', fontWeight: 'bold', color: '#332211' }}>WhatsApp / Teléfono</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#7D6552' }}>+598 99 000 000</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ background: 'white', padding: '10px', borderRadius: '50%', color: '#8C6D53', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
                <Mail size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', fontWeight: 'bold', color: '#332211' }}>Correo electrónico</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#7D6552' }}>contacto@dulcemomento.uy</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ background: 'white', padding: '10px', borderRadius: '50%', color: '#8C6D53', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', fontWeight: 'bold', color: '#332211' }}>Horario de atención</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#7D6552' }}>Lunes a Sábados: 09:00 - 19:00 hs</p>
              </div>
            </div>
          </div>

          {/* FORMULARIO DE CONTACTO */}
          <div style={{ background: 'white', padding: '35px', borderRadius: '16px', border: '1px solid #EFECE6', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '55px', height: '55px', background: '#E5F4ED', color: '#2E7D32', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#332211', marginBottom: '10px' }}>¡Mensaje enviado!</h3>
                <p style={{ color: '#7D6552', fontSize: '14px', marginBottom: '20px' }}>
                  Gracias por comunicarte. Te responderemos a la brevedad.
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '' }); }}
                  style={{ background: '#4A3525', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '25px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#332211', margin: '0 0 5px 0' }}>Envianos un mensaje</h3>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#332211', marginBottom: '6px' }}>Nombre y Apellido</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Tu nombre"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #EADCC9', fontSize: '14px', outline: 'none', color: '#4A3525', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#332211', marginBottom: '6px' }}>Correo electrónico</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="tucorreo@email.com"
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #EADCC9', fontSize: '14px', outline: 'none', color: '#4A3525', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#332211', marginBottom: '6px' }}>Teléfono / Celular</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="099 123 456"
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #EADCC9', fontSize: '14px', outline: 'none', color: '#4A3525', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#332211', marginBottom: '6px' }}>Mensaje o consulta</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    placeholder="Contanos qué necesitas..."
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #EADCC9', fontSize: '14px', outline: 'none', color: '#4A3525', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>

                <button 
                  type="submit"
                  style={{ background: '#4A3525', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginTop: '5px' }}
                >
                  Enviar mensaje <Send size={15} />
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      {/* COMPONENTE DE LA BARRA LATERAL DEL CARRITO */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    </div>
  );
};