import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, ImagePlus, LoaderCircle, LogOut, Pencil, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminOrders } from '../components/AdminOrders';
import { checkApiConnection, createCake, getAdminCakes, loginAdmin, updateCake, uploadCakeImage, type Cake } from '../services/api';
import './Admin.css';

const TOKEN_KEY = 'decodulce_admin_token';
const SESSION_EXPIRED_MESSAGE = 'La sesión expiró. Inicia sesión nuevamente para seguir administrando.';

function getStoredSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { token: '', expired: false };

  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) throw new Error('Token inválido');
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))) as { exp?: number; role?: string };
    const authorizedRole = payload.role === 'ROLE_ADMIN' || payload.role === 'ROLE_GESTOR';
    if (!authorizedRole || !payload.exp || payload.exp * 1000 <= Date.now() + 5000) {
      throw new Error('Token vencido o sin permisos');
    }
    return { token, expired: false };
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return { token: '', expired: true };
  }
}

const emptyCake = {
  nombre: '',
  descripcion: '',
  precioBase: '',
  categoria: 'Clásicas',
  porciones: '',
};

export function Admin() {
  const [initialSession] = useState(getStoredSession);
  const [token, setToken] = useState(initialSession.token);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cake, setCake] = useState(emptyCake);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [activeSection, setActiveSection] = useState<'cakes' | 'orders'>('cakes');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    initialSession.expired ? { type: 'error', text: SESSION_EXPIRED_MESSAGE } : null,
  );

  function handleSessionExpired() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setFeedback({ type: 'error', text: SESSION_EXPIRED_MESSAGE });
  }

  useEffect(() => {
    if (!token) return;
    try {
      const payloadPart = token.split('.')[1];
      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))) as { exp: number };
      const timeout = Math.max(0, payload.exp * 1000 - Date.now());
      const timer = window.setTimeout(() => {
        handleSessionExpired();
      }, timeout);
      return () => window.clearTimeout(timer);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken('');
      setFeedback({ type: 'error', text: SESSION_EXPIRED_MESSAGE });
    }
  }, [token]);

  useEffect(() => {
    checkApiConnection()
      .then(() => setApiStatus('online'))
      .catch(() => {
        setApiStatus('offline');
      })
  }, []);

  useEffect(() => {
    if (!imageFile) {
      return;
    }
    const preview = URL.createObjectURL(imageFile);
    setImagePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile]);

  useEffect(() => {
    if (!token) return;
    getAdminCakes(token, 0)
      .then((result) => {
        setCakes(result.content);
        setCurrentPage(result.number);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
        setApiStatus('online');
      })
      .catch((error: unknown) => {
        setCatalogError(error instanceof Error ? error.message : 'No se pudo cargar el catálogo.');
        if (error instanceof Error && /HTTP 40[13]/.test(error.message)) {
          handleSessionExpired();
        }
      })
      .finally(() => setCatalogLoading(false));
  }, [token]);

  async function refreshCakes(page = currentPage) {
    if (!token) return;
    setCatalogLoading(true);
    setCatalogError('');
    try {
      const result = await getAdminCakes(token, page);
      setCakes(result.content);
      setCurrentPage(result.number);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setApiStatus('online');
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'No se pudo actualizar el catálogo.');
      if (error instanceof Error && /HTTP 40[13]/.test(error.message)) {
        handleSessionExpired();
      }
    } finally {
      setCatalogLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      const adminToken = await loginAdmin(email, password);
      localStorage.setItem(TOKEN_KEY, adminToken);
      setToken(adminToken);
      setPassword('');
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'No se pudo iniciar sesión.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateCake(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      let imageUrl = editingCake?.imageUrl || '';
      if (imageFile) imageUrl = await uploadCakeImage(imageFile, token);
      if (!editingCake && !imageUrl) throw new Error('Selecciona una imagen JPG, PNG o GIF.');
      const payload = { ...cake, precioBase: Number(cake.precioBase), imagen: imageUrl };
      if (editingCake) {
        await updateCake(editingCake.id, payload, token);
      } else {
        await createCake(payload, token);
      }
      resetCakeForm();
      await refreshCakes(0);
      setFeedback({ type: 'success', text: editingCake ? 'Torta actualizada.' : 'Torta publicada. Ya está disponible en el catálogo.' });
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'No se pudo guardar la torta.' });
    } finally {
      setBusy(false);
    }
  }

  function resetCakeForm() {
    setCake(emptyCake);
    setEditingCake(null);
    setImageFile(null);
    setImagePreview('');
    if (imageInput.current) imageInput.current.value = '';
  }

  function startEditing(item: Cake) {
    setEditingCake(item);
    setCake({
      nombre: item.name,
      descripcion: item.description,
      precioBase: String(item.price),
      categoria: item.category,
      porciones: item.portions,
    });
    setImageFile(null);
    setImagePreview(item.imageUrl || '');
    setFeedback(null);
    setActiveSection('cakes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setFeedback(null);
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="admin-back" to="/" aria-label="Volver a la tienda"><ArrowLeft size={18} /></Link>
        <div className="admin-brand"><span className="admin-brand-mark">DD</span><span>Deco Dulce <small>GESTIÓN</small></span></div>
        <div className={`api-indicator api-${apiStatus}`} role="status">
          <span className="api-indicator-dot" />
          {apiStatus === 'checking' ? 'Conectando' : apiStatus === 'online' ? 'API conectada' : 'API sin conexión'}
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-heading">
          <p className="admin-eyebrow">ESPACIO DE TRABAJO</p>
          <h1>Administración</h1>
          <p>Gestiona el catálogo de Deco Dulce.</p>
        </div>

        {!token ? (
          <section className="admin-login" aria-labelledby="login-title">
            <div className="admin-section-icon"><ShieldCheck size={21} /></div>
            <div className="admin-section-copy">
              <h2 id="login-title">Acceso de administrador</h2>
              <p>Inicia sesión con una cuenta autorizada para publicar productos.</p>
            </div>
            <form className="admin-form" onSubmit={handleLogin}>
              <label htmlFor="admin-email">Correo electrónico</label>
              <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <label htmlFor="admin-password">Contraseña</label>
              <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              {feedback && <p className={`admin-feedback feedback-${feedback.type}`} role="alert">{feedback.text}</p>}
              <button className="admin-submit" type="submit" disabled={busy || apiStatus !== 'online'}>
                {busy ? <LoaderCircle className="admin-spinner" size={17} /> : <ShieldCheck size={17} />}
                {apiStatus === 'offline' ? 'Backend no disponible' : 'Ingresar'}
              </button>
            </form>
          </section>
        ) : (
          <div className="admin-workspace">
            <div className="admin-workspace-heading">
              <div>
                <span className="admin-role"><ShieldCheck size={14} /> SESIÓN AUTORIZADA</span>
                <h2>{editingCake ? `Editar: ${editingCake.name}` : 'Nuevo producto'}</h2>
              </div>
              <button className="admin-logout" type="button" onClick={handleLogout} title="Cerrar sesión"><LogOut size={17} /><span>Salir</span></button>
            </div>

            <div className="admin-section-tabs" role="tablist" aria-label="Secciones de administración">
              <button type="button" role="tab" aria-selected={activeSection === 'cakes'} className={activeSection === 'cakes' ? 'active' : ''} onClick={() => setActiveSection('cakes')}>Tortas</button>
              <button type="button" role="tab" aria-selected={activeSection === 'orders'} className={activeSection === 'orders' ? 'active' : ''} onClick={() => setActiveSection('orders')}>Pedidos</button>
            </div>

            <div className="admin-catalog-status">
              <span className="catalog-count">{totalElements}</span>
              <span>tortas en el catálogo</span>
              <span className="catalog-live"><span className="api-indicator-dot" /> Sincronizado con la tienda</span>
            </div>

            {activeSection === 'cakes' ? <>
            <form className="admin-form cake-form" onSubmit={handleCreateCake}>
              <div className="form-grid">
                <div className="form-field form-field-wide">
                  <label htmlFor="cake-name">Nombre de la torta</label>
                  <input id="cake-name" value={cake.nombre} onChange={(event) => setCake({ ...cake, nombre: event.target.value })} maxLength={120} required />
                </div>
                <div className="form-field">
                  <label htmlFor="cake-category">Categoría</label>
                  <select id="cake-category" value={cake.categoria} onChange={(event) => setCake({ ...cake, categoria: event.target.value })}>
                    <option>Clásicas</option><option>Especiales</option><option>Cumpleaños</option><option>Personalizadas</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="cake-price">Precio</label>
                  <div className="price-input"><span>$</span><input id="cake-price" type="number" min="1" step="1" value={cake.precioBase} onChange={(event) => setCake({ ...cake, precioBase: event.target.value })} required /></div>
                </div>
                <div className="form-field">
                  <label htmlFor="cake-portions">Porciones</label>
                  <input id="cake-portions" placeholder="10-12 porciones" value={cake.porciones} onChange={(event) => setCake({ ...cake, porciones: event.target.value })} maxLength={60} required />
                </div>
                <div className="form-field form-field-wide">
                  <label htmlFor="cake-image">Imagen de la torta</label>
                  <label className="image-picker" htmlFor="cake-image">
                    {imagePreview ? <img src={imagePreview} alt="Vista previa de la torta" /> : <ImagePlus size={22} />}
                    <span>{imageFile ? imageFile.name : editingCake && editingCake.imageUrl ? 'Imagen actual. Selecciona otra para reemplazarla.' : 'Elegir imagen JPG, PNG o GIF (máximo 8 MB)'}</span>
                  </label>
                  <input ref={imageInput} id="cake-image" className="image-file-input" type="file" accept="image/jpeg,image/png,image/gif" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                </div>
                <div className="form-field form-field-wide">
                  <label htmlFor="cake-description">Descripción</label>
                  <textarea id="cake-description" rows={4} value={cake.descripcion} onChange={(event) => setCake({ ...cake, descripcion: event.target.value })} maxLength={700} required />
                  <span className="field-hint">{cake.descripcion.length}/700</span>
                </div>
              </div>

              {feedback && <p className={`admin-feedback feedback-${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.type === 'success' && <Check size={16} />}{feedback.text}</p>}
              <div className="admin-form-footer">
                <span>{editingCake ? 'Los cambios se reflejarán en el catálogo.' : 'Se publicará directamente en el catálogo.'}</span>
                <div className="admin-form-actions">
                  {editingCake && <button className="admin-cancel" type="button" onClick={resetCakeForm}><X size={16} /> Cancelar edición</button>}
                  <button className="admin-submit" type="submit" disabled={busy || apiStatus !== 'online'}>
                    {busy ? <LoaderCircle className="admin-spinner" size={17} /> : <Check size={17} />}
                    {editingCake ? 'Guardar cambios' : 'Publicar torta'}
                  </button>
                </div>
              </div>
            </form>

            <section className="admin-cake-list" aria-labelledby="cake-list-title">
              <div className="cake-list-heading">
                <div>
                  <h2 id="cake-list-title">Tortas del catálogo</h2>
                  <p>{totalElements} productos publicados</p>
                </div>
                <button className="admin-refresh" type="button" onClick={() => refreshCakes()} disabled={catalogLoading} title="Actualizar catálogo">
                  <RefreshCw size={16} className={catalogLoading ? 'admin-spinner' : ''} />
                  <span>Actualizar</span>
                </button>
              </div>
              {catalogError && <p className="catalog-error" role="alert">{catalogError}</p>}
              {catalogLoading ? (
                <p className="catalog-empty">Cargando catálogo...</p>
              ) : cakes.length === 0 ? (
                <p className="catalog-empty">Todavía no hay tortas publicadas.</p>
              ) : (
                <div className="admin-cake-rows">
                  {cakes.map((item) => (
                    <article className="admin-cake-row" key={item.id}>
                      <img src={item.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=160&q=80'} alt="" />
                      <div className="admin-cake-info">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <span>{item.category}{item.portions ? ` · ${item.portions}` : ''}</span>
                      </div>
                      <strong>$ {item.price.toLocaleString('es-UY')}</strong>
                      <button className="admin-edit-cake" type="button" onClick={() => startEditing(item)} aria-label={`Editar ${item.name}`} title="Editar torta"><Pencil size={16} /></button>
                    </article>
                  ))}
                </div>
              )}
              {totalPages > 1 && (
                <div className="cake-pagination">
                  <span>Página {currentPage + 1} de {totalPages}</span>
                  <div>
                    <button type="button" onClick={() => refreshCakes(currentPage - 1)} disabled={catalogLoading || currentPage === 0} aria-label="Página anterior"><ChevronLeft size={17} /></button>
                    <button type="button" onClick={() => refreshCakes(currentPage + 1)} disabled={catalogLoading || currentPage >= totalPages - 1} aria-label="Página siguiente"><ChevronRight size={17} /></button>
                  </div>
                </div>
              )}
            </section>
            </> : <AdminOrders token={token} onSessionExpired={handleSessionExpired} />}
          </div>
        )}
      </section>
      <footer className="admin-footer">Deco Dulce <span>·</span> Panel de administración</footer>
    </main>
  );
}