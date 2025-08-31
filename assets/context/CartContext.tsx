// context/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type CartContextType = {
  count: number;
  setCount: (count: number) => void;
  increment: (qty?: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);

  const increment = (qty: number = 1) => {
    setCount(prev => prev + qty);
  };

  return (
    <CartContext.Provider value={{ count, setCount, increment }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
