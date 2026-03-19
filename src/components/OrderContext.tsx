import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '../types';
import { subscribeToUserOrders } from '../services/orderService';
import { useAuth } from './AuthContext';

interface OrderContextType {
  userOrders: Order[];
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToUserOrders(user.uid, (orders) => {
      setUserOrders(orders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <OrderContext.Provider value={{ userOrders, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
