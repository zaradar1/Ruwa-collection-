import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Star, Truck } from 'lucide-react';
import { Product } from '../types';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const Badge = ({ children, color = 'rose' }: { children: React.ReactNode, color?: 'rose' | 'red' | 'white' }) => (
  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
    color === 'red' ? 'bg-red-100 text-red-600' : 
    color === 'white' ? 'bg-white/90 text-rose-900' : 
    'bg-rose-50 text-rose-600'
  }`}>
    {children}
  </span>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {product.new && (
          <div className="absolute top-3 left-3">
            <Badge color="red">New</Badge>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            className={`p-2 bg-white rounded-full shadow-md hover:bg-rose-50 hover:text-rose-500 transition-colors ${isInWishlist(product.id) ? 'text-rose-500' : 'text-gray-400'}`}
          >
            <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart(product, product.sizes[0], product.colors[0]); }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-rose-900 hover:text-white transition-colors text-gray-400"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full py-2 bg-white text-rose-900 rounded-lg text-sm font-bold hover:bg-rose-50 transition-colors">Quick View</button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-medium text-gray-900 line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <Star size={14} fill="currentColor" />
            <span className="text-gray-600">{product.rating}</span>
          </div>
        </div>
        <p className="text-sm text-rose-500 mb-3 font-medium">{product.category}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          {product.price > 1000 && (
            <span className="text-[10px] text-rose-600 font-medium flex items-center gap-1">
              <Truck size={12} /> Free Shipping
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
