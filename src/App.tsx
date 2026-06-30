import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import SystemDesignPage from './pages/SystemDesignPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import SizeGuidePage from './pages/SizeGuidePage';
import ContactUsPage from './pages/ContactUsPage';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './components/AuthContext';

// Simple Router implementation
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>(window.location.pathname);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, profile, loading: authLoading } = useAuth();

  useEffect(() => {
    const handlePopState = () => setCurrentPage(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPage(path);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50/30">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-900 rounded-full animate-spin mb-4"></div>
            <p className="text-rose-900 font-serif font-bold tracking-widest uppercase text-xs">Entering the Boutique...</p>
          </div>
        </div>
      );
    }

    if (currentPage === '/') return <HomePage onNavigate={navigate} />;
    if (currentPage === '/shop') return <ShopPage onNavigate={navigate} />;
    if (currentPage.startsWith('/product/')) {
      const id = currentPage.split('/').pop();
      return <ProductDetailsPage productId={id || ''} onNavigate={navigate} />;
    }
    if (currentPage === '/checkout') {
      if (!user) {
        navigate('/');
        return null;
      }
      return <CheckoutPage onNavigate={navigate} />;
    }
    if (currentPage.startsWith('/order/')) {
      const id = currentPage.split('/').pop();
      if (!user) {
        navigate('/');
        return null;
      }
      return <OrderDetailsPage orderId={id || ''} onNavigate={navigate} />;
    }
    if (currentPage === '/admin') {
      if (profile?.role !== 'admin') {
        navigate('/');
        return null;
      }
      return <AdminDashboard onNavigate={navigate} />;
    }
    if (currentPage === '/profile') {
      if (!user) {
        navigate('/');
        return null;
      }
      return <UserDashboard onNavigate={navigate} />;
    }
    if (currentPage === '/system-design') return <SystemDesignPage onNavigate={navigate} />;
    if (currentPage === '/new-arrivals') return <ShopPage onNavigate={navigate} showNewOnly pageTitle="New Arrivals" />;
    if (currentPage === '/sarees') return <ShopPage onNavigate={navigate} initialCategory="Sarees" pageTitle="Sarees" />;
    if (currentPage === '/lehengas') return <ShopPage onNavigate={navigate} initialCategory="Lehengas" pageTitle="Lehengas" />;
    if (currentPage === '/kurtis') return <ShopPage onNavigate={navigate} initialCategory="Kurtis" pageTitle="Kurtis" />;
    if (currentPage === '/help-center') return <HelpCenterPage onNavigate={navigate} />;
    if (currentPage === '/shipping-returns') return <ShippingReturnsPage onNavigate={navigate} />;
    if (currentPage === '/size-guide') return <SizeGuidePage onNavigate={navigate} />;
    if (currentPage === '/contact') return <ContactUsPage onNavigate={navigate} />;
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white font-sans text-rose-950 selection:bg-rose-100 selection:text-rose-900">
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#1c0a0a',
              borderRadius: '1.5rem',
              padding: '1rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: '1px solid #fdf2f2',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
        <Navbar onNavigate={navigate} onOpenCart={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={navigate} />
        
        <main className="pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer onNavigate={navigate} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
