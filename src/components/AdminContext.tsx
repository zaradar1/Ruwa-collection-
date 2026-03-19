import React, { createContext, useContext, useEffect, useState } from 'react';
import { Order, Product } from '../types';
import { subscribeToAllOrders } from '../services/orderService';
import { useAuth } from './AuthContext';

interface AdminContextType {
  allOrders: Order[];
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  allOrders: [],
  loading: true,
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAllOrders((orders) => {
      setAllOrders(orders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  return (
    <AdminContext.Provider value={{ allOrders, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
