import React, { createContext, useContext, useEffect, useState } from 'react';
import { Order } from '../types';
import { UserProfile } from '../types';
import { subscribeToAllOrders } from '../services/orderService';
import { subscribeToAllUsers } from '../services/userService';
import { useAuth } from './AuthContext';

interface AdminContextType {
  allOrders: Order[];
  allUsers: UserProfile[];
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  allOrders: [],
  allUsers: [],
  loading: true,
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const unsubOrders = subscribeToAllOrders((orders) => {
      setAllOrders(orders);
      setLoading(false);
    });

    const unsubUsers = subscribeToAllUsers((users) => {
      setAllUsers(users);
    });

    return () => {
      unsubOrders();
      unsubUsers();
    };
  }, [isAdmin]);

  return (
    <AdminContext.Provider value={{ allOrders, allUsers, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
