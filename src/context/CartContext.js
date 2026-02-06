import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const addItem = (item) => {
    setCartItems((prev) => {
      const qty = prev[item.id]?.quantity || 0;
      return {
        ...prev,
        [item.id]: { ...item, quantity: qty + 1 }
      };
    });
  };

  const removeItem = (item) => {
    setCartItems((prev) => {
      const qty = prev[item.id]?.quantity || 0;
      if (qty <= 1) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      return {
        ...prev,
        [item.id]: { ...item, quantity: qty - 1 }
      };
    });
  };

  const clearCart = () => setCartItems({});

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
