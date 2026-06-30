import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, ShoppingBag, Truck, RefreshCcw, CreditCard, User, MessageCircle } from 'lucide-react';

interface HelpCenterPageProps {
  onNavigate: (path: string) => void;
}

const faqs = [
  {
    category: 'Orders',
    icon: <ShoppingBag size={20} />,
    items: [
      { q: 'How do I place an order?', a: 'Browse our collection, select your size and colour, then click "Add to Cart". Proceed to checkout, fill in your delivery details, and complete payment. You\'ll receive a confirmation email instantly.' },
      { q: 'Can I modify or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. Contact our support team via the Contact Us page with your order ID and we\'ll help you right away.' },
      { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an email with a tracking number. You can also view live tracking under My Orders in your profile dashboard.' },
    ],
  },
  {
    category: 'Shipping',
    icon: <Truck size={20} />,
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 business days across India. Express delivery (2–3 days) is available at checkout for an additional fee. International orders take 10–15 business days.' },
      { q: 'Do you offer free shipping?', a: 'Yes! Orders above ₹1,000 qualify for free standard shipping across India. International orders have a flat shipping fee based on destination.' },
      { q: 'Do you ship internationally?', a: 'We ship to over 30 countries. Select your country at checkout to see shipping options and estimated delivery times.' },
    ],
  },
  {
    category: 'Returns & Exchanges',
    icon: <RefreshCcw size={20} />,
    items: [
      { q: 'What is your return policy?', a: 'We offer a 15-day hassle-free return policy. Items must be unworn, unwashed, and in original packaging with all tags attached. Custom or sale items are not eligible for return.' },
      { q: 'How do I initiate a return?', a: 'Go to My Orders in your profile, select the item you wish to return, and click "Request Return". Our team will schedule a pickup within 48 hours.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount is credited back to your original payment method.' },
    ],
  },
  {
    category: 'Payments',
    icon: <CreditCard size={20} />,
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI, net banking, and cash on delivery for orders up to ₹5,000.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. All transactions are secured with 256-bit SSL encryption. We never store your card details on our servers.' },
      { q: 'Can I use multiple discount codes?', a: 'Only one discount code can be applied per order. However, discount codes can be combined with loyalty points earned through your account.' },
    ],
  },
  {
    category: 'Account',
    icon: <User size={20} />,
    items: [
      { q: 'How do I create an account?', a: 'Click the Login icon in the top navigation and select "Sign Up". You can register with your email or sign in instantly with Google.' },
      { q: 'I forgot my password. What should I do?', a: 'On the login screen, click "Forgot Password". Enter your email and we\'ll send you a reset link within a few minutes.' },
      { q: 'How do I update my delivery address?', a: 'Go to your Profile dashboard and navigate to "My Addresses". You can add, edit, or delete addresses and set a default one for faster checkout.' },
    ],
  },
];

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-rose-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-semibold text-rose-950 text-sm">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-rose-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = faqs.map(group => ({
    ...group,
    items: group.items.filter(
      item =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(group =>
    (activeCategory === 'All' || group.category === activeCategory) &&
    group.items.length > 0
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-950 to-rose-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <MessageCircle className="mx-auto mb-4 text-rose-300" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Help Center</h1>
            <p className="text-rose-200 mb-8">Find answers to the most common questions below.</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={18} />
              <input
                type="text"
                placeholder="Search for answers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-rose-950 bg-white focus:outline-none focus:ring-4 focus:ring-rose-300 text-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-10">
          {['All', ...faqs.map(f => f.category)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-rose-900 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ groups */}
        <div className="space-y-8">
          {filtered.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-rose-50/50 rounded-2xl border border-rose-100 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-900 text-white rounded-xl">{group.icon}</div>
                <h2 className="text-lg font-serif font-bold text-rose-950">{group.category}</h2>
              </div>
              <div>
                {group.items.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search size={40} className="mx-auto mb-4 text-rose-200" />
              <p className="text-gray-500">No results found. Try a different search term.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-rose-900 rounded-3xl p-8 text-center text-white">
          <h3 className="text-xl font-serif font-bold mb-2">Still need help?</h3>
          <p className="text-rose-200 text-sm mb-6">Our support team is available Mon–Sat, 9 AM – 6 PM IST.</p>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-8 py-3 bg-white text-rose-900 rounded-full font-bold text-sm hover:bg-rose-50 transition-colors"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
