import React, { createContext, useContext, useState, useEffect } from 'react';

const ShoppingContext = createContext();

export const useShoppingContext = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShoppingContext debe usarse dentro de ShoppingProvider');
  }
  return context;
};

export const ShoppingProvider = ({ children }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [scanHistory, setScanHistory] = useState([]);

  // Cargar historial desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('scanHistory');
    if (saved) {
      try {
        setScanHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Error al cargar historial:', error);
      }
    }
  }, []);

  // Guardar historial en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
  }, [scanHistory]);

  // Agregar un item a la compra actual
  const addItem = (price, name = '') => {
    const newItem = {
      id: Date.now(),
      price: parseFloat(price),
      name: name || `Producto ${currentItems.length + 1}`,
      timestamp: new Date().toISOString()
    };
    
    setCurrentItems(prev => [...prev, newItem]);
    setCurrentTotal(prev => prev + parseFloat(price));
    return newItem;
  };

  // Eliminar un item de la compra actual
  const removeItem = (id) => {
    const item = currentItems.find(i => i.id === id);
    if (item) {
      setCurrentItems(prev => prev.filter(i => i.id !== id));
      setCurrentTotal(prev => prev - item.price);
    }
  };

  // Actualizar el nombre de un item
  const updateItemName = (id, newName) => {
    setCurrentItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, name: newName } : item
      )
    );
  };

  // Finalizar compra y guardar en historial
  const finishShopping = (name) => {
    if (currentItems.length === 0) return false;
    
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      total: currentTotal,
      items: currentItems,
      itemCount: currentItems.length,
      name
    };
    
    setScanHistory(prev => [newSession, ...prev]);
    setCurrentItems([]);
    setCurrentTotal(0);
    return true;
  };

  // Eliminar una sesión del historial
  const deleteSession = (id) => {
    setScanHistory(prev => prev.filter(s => s.id !== id));
  };

  // Limpiar compra actual
  const clearCurrentShopping = () => {
    setCurrentItems([]);
    setCurrentTotal(0);
  };

  const value = {
    currentItems,
    currentTotal,
    scanHistory,
    addItem,
    removeItem,
    updateItemName,
    finishShopping,
    deleteSession,
    clearCurrentShopping
  };

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
};