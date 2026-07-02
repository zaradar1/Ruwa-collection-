import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../components/ProductContext';
import { Product } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const Hero = ({ onShopNow, onNewArrivals }: { onShopNow: () => void; onNewArrivals: () => void }) => (
  <div className="relative min-h-[88vh] w-full overflow-hidden">
    {/* Deep rose gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-[#7c0d2f] to-rose-900" />

    {/* Decorative mandala-style concentric circles — right side */}
    <div className="absolute right-[-120px] top-1/2 -translate-y-1/2 pointer-events-none">
      {[700, 560, 420, 300, 180, 80].map((size, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-rose-300/20"
          style={{ width: size, height: size, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      ))}
      <div className="absolute w-20 h-20 rounded-full bg-rose-400/10" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
    </div>

    {/* Diagonal silk-weave texture */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fda4af 0, #fda4af 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }}
    />

    {/* Left-to-right gradient vignette so text stays readable */}
    <div className="absolute inset-0 bg-gradient-to-r from-rose-950/95 via-rose-950/70 to-transparent" />

    {/* Bottom fade to white */}
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

    {/* Content */}
    <div className="absolute inset-0 z-10 flex items-center px-6 sm:px-12 lg:px-24">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-2xl text-white"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-rose-300" />
          <span className="text-rose-300 text-[11px] font-bold uppercase tracking-[0.3em]">New Collection 2024</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] tracking-tight mb-6">
          ETHNIC<br /><span className="text-rose-300">ELEGANCE</span>
        </h1>
        <p className="text-base md:text-lg text-rose-100/80 mb-10 max-w-md leading-relaxed">
          Discover the finest collection of Sarees, Lehengas, and Kurtis.
          Crafted for the modern woman who cherishes tradition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onShopNow}
            className="px-8 py-4 bg-white text-rose-950 rounded-full font-bold hover:bg-rose-50 transition-all duration-300 shadow-2xl shadow-rose-950/40"
          >
            Shop Collection
          </button>
          <button
            onClick={onNewArrivals}
            className="px-8 py-4 border-2 border-rose-300/50 text-white rounded-full font-bold hover:border-white hover:bg-white/10 transition-all duration-300"
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
      <Hero onShopNow={() => onNavigate('/shop')} onNewArrivals={() => onNavigate('/new-arrivals')} />
      
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
