import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import { subscribeToProducts } from '../services/productService';
import { MOCK_PRODUCTS } from '../constants';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: true,
  getProductById: () => undefined,
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((newProducts) => {
      if (newProducts.length === 0) {
        // Fallback to mock products if none in Firestore
        setProducts(MOCK_PRODUCTS);
      } else {
        setProducts(newProducts);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getProductById = (id: string) => products.find(p => p.id === id);

  return (
    <ProductContext.Provider value={{ products, loading, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};
