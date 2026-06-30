import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { ProductProvider } from './ProductContext';
import { AdminProvider } from './AdminContext';
import { OrderProvider } from './OrderContext';
import { SiteConfigProvider } from './SiteConfigContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                <AdminProvider>
                  {children}
                </AdminProvider>
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
};
