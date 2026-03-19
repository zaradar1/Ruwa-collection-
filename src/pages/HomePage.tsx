import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../components/ProductContext';
import { Product } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const Hero = ({ onShopNow }: { onShopNow: () => void }) => (
  <div className="relative h-[85vh] w-full overflow-hidden bg-rose-50">
    <div className="absolute inset-0 bg-gradient-to-r from-rose-900/80 to-transparent z-10" />
    <img 
      src="https://image.qwenlm.ai/public_source/2cea05b4-e842-4876-8e91-c3a877163ecc/122fdc590-6d5f-4dd3-b74d-de66ce389a7e.png" 
      alt="Hero" 
      className="absolute inset-0 w-full h-full object-cover object-top"
    />
    <div className="absolute inset-0 z-20 flex items-center px-4 sm:px-12 lg:px-20">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-white"
      >
        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">New Collection 2024</span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mt-6 mb-6 leading-tight">
          ETHNIC <br /> ELEGANCE
        </h1>
        <p className="text-lg text-rose-100 mb-8 max-w-lg">
          Discover the finest collection of Sarees, Lehengas, and Kurtis. 
          Crafted for the modern woman who cherishes tradition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onShopNow}
            className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-rose-900 transition-all duration-300"
          >
            Shop Collection
          </button>
          <button 
            onClick={onShopNow}
            className="px-8 py-4 bg-rose-900 text-white rounded-full font-bold hover:bg-rose-800 transition-all duration-300 shadow-xl"
          >
            View New Arrivals
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products } = useProducts();
  const trendingProducts = products.slice(0, 4);

  return (
    <div className="space-y-0">
      <Hero onShopNow={() => onNavigate('/shop')} />
      
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-rose-950 mb-4">Trending Now</h2>
            <div className="w-24 h-1 bg-rose-900 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-500 max-w-lg mx-auto">Curated ethnic picks for the season, blending timeless tradition with contemporary style.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onClick={() => onNavigate(`/product/${p.id}`)}
              />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button 
              onClick={() => onNavigate('/shop')}
              className="group inline-flex items-center gap-2 text-rose-900 font-bold hover:gap-4 transition-all"
            >
              Explore All Products <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-24 bg-rose-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <Sparkles className="mx-auto mb-6 text-rose-400" size={48} />
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">JOIN THE VOGUE CLUB</h2>
          <p className="mb-10 text-rose-200 text-lg">Get 15% off your first order and exclusive access to new collections when you sign up.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 w-full sm:w-80"
            />
            <button className="px-8 py-4 bg-white text-rose-900 rounded-full font-bold hover:bg-rose-50 transition-colors shadow-lg">
              Sign Up Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
