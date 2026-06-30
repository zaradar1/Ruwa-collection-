import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, Menu, X, Search, LogIn, LogOut, Settings } from 'lucide-react';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';

interface NavbarProps {
  onNavigate: (page: string) => void;
  onOpenCart: () => void;
  currentPage: string;
}

const RWMonogram = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="21" cy="21" r="20" fill="#9f1239" />
    <circle cx="21" cy="21" r="18.5" stroke="#fecdd3" strokeWidth="0.8" />
    <circle cx="21" cy="21" r="16" stroke="#fda4af" strokeWidth="0.4" strokeDasharray="2 2" />
    <text
      x="21" y="26"
      textAnchor="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontSize="14"
      fontWeight="700"
      letterSpacing="1.5"
      fill="#fff1f2"
    >
      RW
    </text>
  </svg>
);

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'New Arrivals', path: '/new-arrivals' },
];

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenCart, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, profile, isAdmin, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-3" onClick={() => onNavigate('/')}>
            <RWMonogram />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-serif font-bold tracking-wide text-rose-950">RuWa Verse</span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-rose-400 font-medium">Ethnic Boutique</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {NAV_ITEMS.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => onNavigate(path)}
                className={`text-sm font-medium transition-colors ${currentPage === path ? 'text-rose-900' : 'text-gray-500 hover:text-rose-900'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-600 hover:text-rose-900 transition-colors">
              <Search size={20} />
            </button>

            <div className="relative cursor-pointer" onClick={() => onNavigate('/profile')}>
              <Heart size={20} className="text-gray-600 hover:text-rose-500 transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </div>

            <div className="relative cursor-pointer" onClick={onOpenCart}>
              <ShoppingBag size={20} className="text-gray-600 hover:text-rose-900 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            <div className="relative group">
              {user ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => onNavigate('/profile')} className="relative">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=fdf2f2&color=9f1239`} alt="" className="w-8 h-8 rounded-full border border-rose-100" />
                  </button>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-rose-950">{profile?.displayName}</p>
                    <button onClick={logout} className="text-[10px] text-gray-500 hover:text-rose-600 flex items-center gap-1">
                      <LogOut size={10} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="text-gray-600 hover:text-rose-900 flex items-center gap-2">
                  <LogIn size={20} />
                  <span className="hidden lg:block text-sm font-medium">Login</span>
                </button>
              )}
            </div>

            {isAdmin && (
              <button onClick={() => onNavigate('/admin')} className="p-2 bg-rose-50 text-rose-900 rounded-full hover:bg-rose-100 transition-colors">
                <Settings size={20} />
              </button>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-rose-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {NAV_ITEMS.map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => {
                    onNavigate(path);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:bg-rose-50 rounded-md"
                >
                  {label}
                </button>
              ))}
              {user ? (
                <>
                  <button onClick={() => { onNavigate('/profile'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:bg-rose-50 rounded-md">Profile</button>
                  {isAdmin && <button onClick={() => { onNavigate('/admin'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:bg-rose-50 rounded-md">Admin Dashboard</button>}
                  <button onClick={logout} className="block w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Logout</button>
                </>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="block w-full text-left px-3 py-3 text-base font-medium text-rose-900 hover:bg-rose-50 rounded-md">Login</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
