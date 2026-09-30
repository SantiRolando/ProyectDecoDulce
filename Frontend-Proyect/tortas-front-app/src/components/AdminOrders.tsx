import { useEffect, useState } from 'react';
import { Download, LoaderCircle, RefreshCw } from 'lucide-react';
import { getAdminOrders, getTransferProof, updateOrderStatus, type AdminOrder } from '../services/api';

const statusLabels: Record<AdminOrder['status'], string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  IN_PREPARATION: 'En preparación',
  READY: 'Listo',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const orderStatuses = Object.keys(statusLabels) as AdminOrder['status'][];

export function AdminOrders({ token, onSessionExpired }: { token: string; onSessionExpired: () => void }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proofUrls, setProofUrls] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);

  async function refreshOrders() {
    setLoading(true);
    setError('');
    try {
      setOrders(await getAdminOrders(token));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los pedidos.');
      if (loadError instanceof Error && loadError.message.includes('HTTP 401')) onSessionExpired();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshOrders();
    return () => Object.values(proofUrls).forEach(URL.revokeObjectURL);
  }, [token]);

  async function handleStatusChange(orderId: number, status: AdminOrder['status']) {
    setBusyId(orderId);
    setError('');
    try {
      const updated = await updateOrderStatus(orderId, status, token);
      setOrders((current) => current.map((order) => order.id === updated.id ? updated : order));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'No se pudo actualizar el estado.');
      if (updateError instanceof Error && updateError.message.includes('HTTP 401')) onSessionExpired();
    } finally {
      setBusyId(null);
    }
  }

  async function handleProof(orderId: number) {
    setBusyId(orderId);
    setError('');
    try {
      const proof = await getTransferProof(orderId, token);
      setProofUrls((current) => {
        if (current[orderId]) URL.revokeObjectURL(current[orderId]);
        return { ...current, [orderId]: URL.createObjectURL(proof) };
      });
    } catch (proofError) {
      setError(proofError instanceof Error ? proofError.message : 'No se pudo abrir el comprobante.');
      if (proofError instanceof Error && proofError.message.includes('HTTP 401')) onSessionExpired();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="admin-orders" aria-labelledby="orders-title">
      <div className="cake-list-heading">
        <div>
          <h2 id="orders-title">Pedidos recibidos</h2>
          <p>{orders.length} pedidos</p>
        </div>
        <button className="admin-refresh" type="button" onClick={refreshOrders} disabled={loading} title="Actualizar pedidos">
          <RefreshCw size={16} className={loading ? 'admin-spinner' : ''} /><span>Actualizar</span>
        </button>
      </div>
      {error && <p className="catalog-error" role="alert">{error}</p>}
      {loading ? <p className="catalog-empty">Cargando pedidos...</p> : orders.length === 0 ? (
        <p className="catalog-empty">Todavía no hay pedidos registrados.</p>
      ) : (
        <div className="admin-order-list">
          {orders.map((order) => (
            <article className="admin-order" key={order.id}>
              <header className="admin-order-header">
                <div><span className="admin-order-id">Pedido #{order.id}</span><time>{new Date(order.createdAt).toLocaleString('es-UY')}</time></div>
                <label className="order-status-control">
                  <span>Estado</span>
                  <select value={order.status} disabled={busyId === order.id} onChange={(event) => void handleStatusChange(order.id, event.target.value as AdminOrder['status'])}>
                    {orderStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                  </select>
                  {busyId === order.id && <LoaderCircle size={15} className="admin-spinner" />}
                </label>
              </header>
              <div className="admin-order-main">
                <div className="admin-order-customer">
                  <strong>{order.customerName}</strong><span>{order.phone}</span><span>{order.address}</span>
                  {order.notes && <p>Nota: {order.notes}</p>}
                </div>
                <div className="admin-order-items">
                  {order.items.map((item) => (
                    <div className="admin-order-line" key={item.id}>
                      <span>{item.quantity} × {item.productName}{item.portions ? ` · ${item.portions}` : ''}<small>$ {Number(item.unitPrice).toLocaleString('es-UY')} c/u</small></span>
                      <strong>$ {Number(item.unitPrice * item.quantity).toLocaleString('es-UY')}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <footer className="admin-order-footer">
                <div className="order-payment">
                  <span>{order.paymentMethod === 'TRANSFER' ? 'Transferencia bancaria' : 'Mercado Pago'}</span>
                  {order.transferReference && <small>Operación: {order.transferReference}</small>}
                </div>
                <strong className="admin-order-total">Total $ {Number(order.total).toLocaleString('es-UY')}</strong>
                {order.transferReceiptAvailable && (
                  proofUrls[order.id] ? (
                    <a className="admin-refresh proof-link" href={proofUrls[order.id]} target="_blank" rel="noreferrer"><Download size={15} /> Abrir comprobante</a>
                  ) : (
                    <button className="admin-refresh proof-link" type="button" onClick={() => void handleProof(order.id)} disabled={busyId === order.id}>
                      <Download size={15} /> Ver comprobante
                    </button>
                  )
                )}
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
