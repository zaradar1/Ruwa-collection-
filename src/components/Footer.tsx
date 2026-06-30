import React from 'react';
import { Sparkles, ArrowRight, Smartphone, CreditCard, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => (
  <footer className="bg-rose-950 text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <button onClick={() => onNavigate('/')} className="flex items-center gap-2 mb-6">
            <Sparkles className="text-rose-400" size={24} />
            <h2 className="text-2xl font-serif font-bold tracking-tight">RuWa Verse</h2>
          </button>
          <p className="text-rose-200 text-sm leading-relaxed">
            Celebrating the rich heritage of South Asian fashion.
            From the looms of Banaras to the embroidery of Lucknow.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-rose-100 uppercase text-xs tracking-widest">Shop</h3>
          <ul className="space-y-2 text-rose-300 text-sm">
            {[
              { label: 'New Arrivals', path: '/new-arrivals' },
              { label: 'Sarees', path: '/sarees' },
              { label: 'Lehengas', path: '/lehengas' },
              { label: 'Kurtis', path: '/kurtis' },
            ].map(link => (
              <li key={link.path}>
                <button onClick={() => onNavigate(link.path)} className="hover:text-white transition-colors text-left">
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-rose-100 uppercase text-xs tracking-widest">Support</h3>
          <ul className="space-y-2 text-rose-300 text-sm">
            {[
              { label: 'Help Center', path: '/help-center' },
              { label: 'Shipping & Returns', path: '/shipping-returns' },
              { label: 'Size Guide', path: '/size-guide' },
              { label: 'Contact Us', path: '/contact' },
            ].map(link => (
              <li key={link.path}>
                <button onClick={() => onNavigate(link.path)} className="hover:text-white transition-colors text-left">
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-rose-100 uppercase text-xs tracking-widest">Stay Updated</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-rose-900 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-rose-400 text-white placeholder-rose-400"
            />
            <button className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-400 transition-colors">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-rose-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-rose-400 text-[10px] uppercase tracking-widest">© 2024 RuWa Verse Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <Smartphone size={20} className="text-rose-400 hover:text-white cursor-pointer transition-colors" />
          <CreditCard size={20} className="text-rose-400 hover:text-white cursor-pointer transition-colors" />
          <ShieldCheck size={20} className="text-rose-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
