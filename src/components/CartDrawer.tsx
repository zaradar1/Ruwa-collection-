import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { cart, removeFromCart, updateQty, total } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onNavigate('/checkout');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-rose-950/40 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-rose-50 flex justify-between items-center bg-rose-50/50">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-rose-900" size={24} />
                <h2 className="text-2xl font-serif font-bold text-rose-950">Your Bag ({cart.length})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-200">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-rose-950 mb-2">Your bag is empty</h3>
                  <p className="text-gray-500 mb-8">Discover our latest collections and find something special.</p>
                  <button 
                    onClick={() => { onNavigate('/shop'); onClose(); }}
                    className="px-8 py-3 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-6 group">
                    <div className="w-24 h-32 bg-rose-50 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-rose-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-rose-950 text-sm line-clamp-1">{item.name}</h3>
                          <button onClick={() => removeFromCart(idx)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{item.selectedSize} • {item.selectedColor}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center bg-rose-50 rounded-full px-3 py-1">
                          <button onClick={() => updateQty(idx, -1)} className="text-rose-900 hover:scale-125 transition-transform"><Minus size={14} /></button>
                          <span className="w-8 text-center text-xs font-bold">{item.qty}</span>
                          <button onClick={() => updateQty(idx, 1)} className="text-rose-900 hover:scale-125 transition-transform"><Plus size={14} /></button>
                        </div>
                        <span className="font-bold text-rose-900 text-sm">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-rose-50 bg-rose-50/30">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Subtotal</span>
                    <span className="font-bold text-rose-950">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
                  </div>
                  <div className="pt-4 border-t border-rose-100 flex justify-between items-center">
                    <span className="text-lg font-serif font-bold text-rose-950">Total</span>
                    <span className="text-2xl font-bold text-rose-900">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all shadow-xl hover:shadow-rose-200 flex items-center justify-center gap-2"
                >
                  Checkout Securely <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
