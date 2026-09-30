import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  selectedSize?: string;
  selectedFlavor?: string;
  customSize?: string;
  customFlavor?: string;
  customFilling?: string;
  customTheme?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.id === newItem.id && 
                item.selectedSize === newItem.selectedSize && 
                item.selectedFlavor === newItem.selectedFlavor
      );

      const qtyToAdd = newItem.quantity || 1;

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qtyToAdd;
        return updated;
      } else {
        return [...prevCart, { ...newItem, quantity: qtyToAdd }];
      }
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};