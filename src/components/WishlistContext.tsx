import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    const existing = wishlist.find(p => p.id === product.id);
    if (existing) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      toast.error('Removed from wishlist');
    } else {
      setWishlist(prev => [...prev, product]);
      toast.success('Added to wishlist');
    }
  };

  const isInWishlist = (id: string) => wishlist.some(p => p.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
