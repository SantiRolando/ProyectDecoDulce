// src/services/api.ts
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export interface Cake {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  portions: string;
}

export interface NewCake {
  nombre: string;
  descripcion: string;
  precioBase: number;
  imagen: string;
  categoria: string;
  porciones: string;
}

export interface CakePage {
  content: Cake[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  portions?: string;
  customSize?: string;
  customFlavor?: string;
  customFilling?: string;
  customTheme?: string;
}

export interface AdminOrder {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  paymentMethod: 'TRANSFER' | 'MERCADOPAGO';
  transferReference?: string;
  transferReceiptAvailable: boolean;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}

export interface OrderPayload {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  paymentMethod: 'TRANSFER' | 'MERCADOPAGO';
  transferReference?: string;
  items: Array<{
    cakeId?: number;
    quantity: number;
    customSize?: string;
    customFlavor?: string;
    customFilling?: string;
    customTheme?: string;
  }>;
}

export interface CreatedOrder {
  id: number;
  total: number;
  status: AdminOrder['status'];
  createdAt: string;
}

interface ApiCake {
  id: number;
  nombre: string;
  descripcion: string;
  precioBase: number;
  imagen?: string;
  categoria: string;
  porciones?: string;
}

const fromApiCake = (cake: ApiCake): Cake => ({
  id: cake.id,
  name: cake.nombre,
  description: cake.descripcion,
  price: cake.precioBase,
  imageUrl: cake.imagen ? new URL(cake.imagen, API_URL).toString() : undefined,
  category: cake.categoria,
  portions: cake.porciones || '',
});

export const getCakes = async (): Promise<Cake[]> => {
  const response = await fetch(`${API_URL}/cakes`);
  if (!response.ok) throw new Error('No se pudo conectar con el catálogo del servidor.');
  const cakes: ApiCake[] = await response.json();
  return cakes.map(fromApiCake);
};

export const checkApiConnection = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) throw new Error('El backend no está disponible.');
};

export const getAdminCakes = async (token: string, page: number, size = 12): Promise<CakePage> => {
  const response = await fetch(`${API_URL}/cakes/admin/page?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`No se pudo cargar esta página del catálogo (HTTP ${response.status}).`);
  const result = await response.json();
  return { ...result, content: (result.content as ApiCake[]).map(fromApiCake) } as CakePage;
};

export const loginAdmin = async (email: string, password: string): Promise<string> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Email o contraseña incorrectos.');
  const body = await response.text();
  let tokenResponse = body;
  try {
    tokenResponse = JSON.parse(body) as string;
  } catch {
    tokenResponse = body;
  }
  const token = tokenResponse.replace(/^TOKEN:\s*/, '');
  const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  if (!['ROLE_ADMIN', 'ROLE_GESTOR'].includes(payload.role)) {
    throw new Error('Esta cuenta no tiene permisos para administrar el catálogo.');
  }
  return token;
};

export const createCake = async (cake: NewCake, token: string): Promise<Cake> => {
  const response = await fetch(`${API_URL}/cakes/newCake`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cake),
  });
  if (response.status === 401) throw new Error('La sesión venció. Cierra sesión e ingresa nuevamente.');
  if (response.status === 403) throw new Error('La cuenta no tiene permisos para crear tortas. Vuelve a ingresar con una cuenta administradora.');
  if (!response.ok) {
    const body = await response.text();
    let detail = body;
    try {
      const errorBody = JSON.parse(body) as { message?: string; detail?: string; title?: string };
      detail = errorBody.message || errorBody.detail || errorBody.title || body;
    } catch {
      detail = body;
    }
    throw new Error(detail || `El servidor rechazó la torta (HTTP ${response.status}). Revisa los datos e inténtalo otra vez.`);
  }
  return fromApiCake(await response.json());
};

export const updateCake = async (id: number, cake: NewCake, token: string): Promise<Cake> => {
  const response = await fetch(`${API_URL}/cakes/updateCake/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cake),
  });
  if (!response.ok) throw new Error(`No se pudo actualizar la torta (HTTP ${response.status}).`);
  return fromApiCake(await response.json());
};

export const uploadCakeImage = async (image: File, token: string): Promise<string> => {
  const formData = new FormData();
  formData.append('image', image);
  const response = await fetch(`${API_URL}/cakes/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const body = await response.text();
    let detail = body;
    try {
      const errorBody = JSON.parse(body) as { message?: string; detail?: string };
      detail = errorBody.message || errorBody.detail || body;
    } catch {
      detail = body;
    }
    throw new Error(detail || `No se pudo subir la imagen (HTTP ${response.status}).`);
  }
  const result: { url: string } = await response.json();
  return new URL(result.url, API_URL).toString();
};

export const createOrder = async (order: OrderPayload, proof?: File): Promise<CreatedOrder> => {
  const formData = new FormData();
  formData.append('order', new Blob([JSON.stringify(order)], { type: 'application/json' }));
  if (proof) formData.append('proof', proof);
  const response = await fetch(`${API_URL}/orders/with-proof`, { method: 'POST', body: formData });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `No se pudo registrar el pedido (HTTP ${response.status}).`);
  }
  return response.json();
};

export const getAdminOrders = async (token: string): Promise<AdminOrder[]> => {
  const response = await fetch(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`No se pudieron cargar los pedidos (HTTP ${response.status}).`);
  return response.json();
};

export const updateOrderStatus = async (id: number, status: AdminOrder['status'], token: string): Promise<AdminOrder> => {
  const response = await fetch(`${API_URL}/orders/${id}/status/${status}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`No se pudo actualizar el pedido (HTTP ${response.status}).`);
  return response.json();
};

export const getTransferProof = async (id: number, token: string): Promise<Blob> => {
  const response = await fetch(`${API_URL}/orders/${id}/transfer-proof`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`No se pudo cargar el comprobante (HTTP ${response.status}).`);
  return response.blob();
};