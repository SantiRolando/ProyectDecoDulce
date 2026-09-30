import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

export const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  // Solo manejamos 'mercadopago' o 'transfer'
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transfer'>('mercadopago');
  const [stepFinished, setStepFinished] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const receiptInput = useRef<HTMLInputElement>(null);

  // Datos del formulario de envío / contacto
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    transferReference: '' // ID de transferencia para validar el pago
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    if (paymentMethod === 'transfer' && !receiptFile) {
      setOrderError('Adjunta el comprobante de transferencia para continuar.');
      return;
    }

    setSubmitting(true);
    setOrderError('');
    try {
      const items = cart.map((item) => {
        if (typeof item.id === 'number') return { cakeId: item.id, quantity: item.quantity };
        return {
          quantity: item.quantity,
          customSize: item.customSize || item.selectedSize,
          customFlavor: item.customFlavor || item.selectedFlavor,
          customFilling: item.customFilling,
          customTheme: item.customTheme,
        };
      });
      const result = await createOrder({
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        paymentMethod: paymentMethod === 'transfer' ? 'TRANSFER' : 'MERCADOPAGO',
        transferReference: paymentMethod === 'transfer' ? formData.transferReference : undefined,
        items,
      }, paymentMethod === 'transfer' ? receiptFile || undefined : undefined);
      setCreatedOrderId(result.id);
      setStepFinished(true);
      clearCart();
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'No se pudo registrar el pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  if (stepFinished) {
    return (
      <div style={{ backgroundColor: '#FDFBF7', color: '#4A3525', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', maxWidth: '500px', width: '100%', textAlign: 'center', border: '1px solid #EFECE6', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
          <CheckCircle2 size={50} color="#2E7D32" style={{ margin: '0 auto 15px auto' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#332211', marginBottom: '10px' }}>¡Pedido realizado con éxito!</h2>
          <p style={{ color: '#7D6552', fontSize: '14px', lineHeight: 1.6, marginBottom: '25px' }}>
            {paymentMethod === 'transfer' && 'Guardamos el pedido y el comprobante. Revisaremos la transferencia antes de confirmar la preparación.'}
            {paymentMethod === 'mercadopago' && 'El pedido quedó registrado como pendiente. El pago en línea con Mercado Pago todavía debe integrarse.'}
          </p>
          {createdOrderId && <p style={{ color: '#4A3525', fontWeight: 'bold' }}>Número de pedido: #{createdOrderId}</p>}
          <Link 
            to="/" 
            style={{ display: 'inline-block', background: '#4A3525', color: 'white', padding: '12px 30px', borderRadius: '25px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FDFBF7', color: '#4A3525', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <Link to="/catalog" style={{ textDecoration: 'none', color: '#4A3525', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: '500', marginBottom: '20px' }}>
          <ArrowLeft size={18} /> Volver al catálogo
        </Link>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#332211', marginBottom: '30px' }}>Finalizar Compra</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
          
          {/* FORMULARIO DE DATOS Y PAGO */}
          <form onSubmit={handleProcessOrder} style={{ display: 'grid', gap: '25px' }}>
            
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #EFECE6', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#332211', marginBottom: '15px' }}>1. Tus Datos de Contacto y Envío</h3>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nombre y Apellido</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Ej: María Pérez" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EADCC9', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Teléfono / WhatsApp</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Ej: 099 123 456" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EADCC9', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Dirección de Entrega</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="Calle, número y ciudad (Piriápolis/Maldonado)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EADCC9', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #EFECE6', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#332211', marginBottom: '15px' }}>2. Método de Pago</h3>

              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                
                {/* OPCIÓN MERCADO PAGO */}
                <div 
                  onClick={() => setPaymentMethod('mercadopago')}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px', border: paymentMethod === 'mercadopago' ? '2px solid #4A3525' : '1px solid #EADCC9', background: paymentMethod === 'mercadopago' ? '#FDF8F2' : 'white', cursor: 'pointer' }}
                >
                  <CreditCard size={22} color="#009ee3" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>Mercado Pago (Tarjetas / Redes de cobranza)</p>
                    <span style={{ fontSize: '12px', color: '#7D6552' }}>Pago seguro online con tarjeta de crédito, débito o Abitab/Redpagos.</span>
                  </div>
                </div>

                {/* OPCIÓN TRANSFERENCIA */}
                <div 
                  onClick={() => setPaymentMethod('transfer')}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px', border: paymentMethod === 'transfer' ? '2px solid #4A3525' : '1px solid #EADCC9', background: paymentMethod === 'transfer' ? '#FDF8F2' : 'white', cursor: 'pointer' }}
                >
                  <Building2 size={22} color="#8C6D53" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>Transferencia Bancaria</p>
                    <span style={{ fontSize: '12px', color: '#7D6552' }}>BROU / Itaú. Deberás ingresar el número de operación para validarlo.</span>
                  </div>
                </div>

              </div>

              {/* CAMPO CONDICIONAL PARA TRANSFERENCIA */}
              {paymentMethod === 'transfer' && (
                <div style={{ background: '#F7F3EE', padding: '15px', borderRadius: '10px', border: '1px solid #EADCC9' }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Datos de la cuenta:</p>
                  <p style={{ fontSize: '12px', color: '#7D6552', margin: '0 0 10px 0' }}>Caja de Ahorro BROU: 000123456-00001 (A nombre de Decodulce)</p>
                  
                  <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Número de Operación / Comprobante de Transferencia *</label>
                  <input 
                    type="text" 
                    name="transferReference" 
                    required={paymentMethod === 'transfer'}
                    value={formData.transferReference} 
                    onChange={handleChange} 
                    placeholder="Ej: 98765432" 
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #EADCC9', outline: 'none', background: 'white', boxSizing: 'border-box' }} 
                  />
                  <span style={{ fontSize: '11px', color: '#8C6D53', display: 'block', marginTop: '4px' }}>Esto nos permite verificar de forma segura el ingreso real en el banco.</span>
                  <label htmlFor="transfer-proof" style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', margin: '14px 0 5px' }}>Archivo del comprobante *</label>
                  <input
                    ref={receiptInput}
                    id="transfer-proof"
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    required={paymentMethod === 'transfer'}
                    onChange={(event) => setReceiptFile(event.target.files?.[0] || null)}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                  <span style={{ fontSize: '11px', color: '#8C6D53', display: 'block', marginTop: '4px' }}>PDF, JPG o PNG, hasta 8 MB. Solo el equipo administrador podrá verlo.</span>
                </div>
              )}

            </div>

            {orderError && <p role="alert" style={{ margin: 0, color: '#a63f35', fontSize: '13px' }}>{orderError}</p>}
            {paymentMethod === 'mercadopago' && <p style={{ margin: 0, color: '#806447', fontSize: '12px' }}>Mercado Pago todavía no está conectado. El pedido se guardará pendiente de pago.</p>}
            <button 
              type="submit"
              disabled={submitting}
              style={{ background: '#4A3525', color: 'white', border: 'none', padding: '15px', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1, boxShadow: '0 4px 12px rgba(74, 53, 37, 0.2)' }}
            >
              {submitting ? 'Guardando pedido...' : `Confirmar y Realizar Pedido ($ ${totalPrice})`}
            </button>

          </form>

          {/* RESUMEN DEL CARRITO AL COSTADO */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #EFECE6', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', position: 'sticky', top: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#332211', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} /> Resumen del Pedido
            </h3>

            <div style={{ display: 'grid', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '5px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F7F3EE', paddingBottom: '10px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>{item.name}</p>
                    <span style={{ fontSize: '11px', color: '#7D6552' }}>Cant: {item.quantity}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>$ {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px solid #EFECE6', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#7D6552' }}>Total a pagar:</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#332211' }}>$ {totalPrice}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};