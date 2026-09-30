import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter } from '../components/SiteFooter';
import './Legal.css';

export function Legal() {
  const { pathname } = useLocation();
  const isPrivacy = pathname.endsWith('/privacidad');

  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link to="/" className="legal-back"><ArrowLeft size={17} /> Volver a la tienda</Link>
        <Link to="/" className="legal-wordmark">Deco Dulce</Link>
      </header>
      <main className="legal-content">
        <p className="legal-eyebrow">DECO DULCE · INFORMACIÓN LEGAL</p>
        <h1>{isPrivacy ? 'Política de privacidad' : 'Términos y condiciones'}</h1>
        <p className="legal-updated">Documento base · revisar y completar antes de publicar</p>
        {isPrivacy ? (
          <>
            <section><h2>Datos que recibimos</h2><p>Al realizar una consulta o pedido, podemos recibir los datos que ingreses en los formularios, como nombre, correo electrónico, teléfono, dirección e información del pedido.</p></section>
            <section><h2>Uso de los datos</h2><p>La información se utiliza para responder consultas, coordinar pedidos, gestionar entregas y mantener la comunicación vinculada a nuestros productos y servicios.</p></section>
            <section><h2>Conservación y consultas</h2><p>Define aquí el plazo de conservación, las medidas de seguridad y el canal de contacto para solicitar acceso, rectificación o eliminación de datos. Completa este texto con la información real del negocio y la normativa aplicable.</p></section>
          </>
        ) : (
          <>
            <section><h2>Pedidos y disponibilidad</h2><p>Las imágenes son ilustrativas y la disponibilidad de sabores y decoraciones debe confirmarse al coordinar cada pedido. El pedido queda sujeto a confirmación por parte de Deco Dulce.</p></section>
            <section><h2>Precios y pagos</h2><p>Los precios publicados están expresados en la moneda indicada en el catálogo. Los medios de pago, anticipos, costos de entrega y condiciones de cancelación deben acordarse antes de confirmar el pedido.</p></section>
            <section><h2>Alérgenos y personalización</h2><p>Los productos pueden contener ingredientes alergénicos o elaborarse en espacios donde se manipulan. Consulta antes de realizar el pedido y confirma por escrito los requisitos alimentarios.</p></section>
            <section><h2>Contacto y alcance</h2><p>Completa aquí la razón social o titular, domicilio, datos de contacto, política de cambios y cancelaciones y demás información exigida para la actividad. Este texto es orientativo, no sustituye una revisión jurídica local.</p></section>
          </>
        )}
      </main>
      <SiteFooter force />
    </div>
  );
}