import React from 'react';
import { motion } from 'motion/react';
import { Truck, RefreshCcw, Clock, Globe, ShieldCheck, AlertCircle } from 'lucide-react';

interface ShippingReturnsPageProps {
  onNavigate: (path: string) => void;
}

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }> = ({
  icon, title, children, delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45 }}
    className="bg-white rounded-2xl border border-rose-100 shadow-sm p-8"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-rose-900 text-white rounded-xl">{icon}</div>
      <h2 className="text-xl font-serif font-bold text-rose-950">{title}</h2>
    </div>
    {children}
  </motion.div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-rose-50 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-semibold text-rose-950">{value}</span>
  </div>
);

const ShippingReturnsPage: React.FC<ShippingReturnsPageProps> = ({ onNavigate }) => (
  <div className="min-h-screen bg-rose-50/30">
    {/* Hero */}
    <div className="bg-gradient-to-br from-rose-950 to-rose-800 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Truck className="mx-auto mb-4 text-rose-300" size={40} />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Shipping & Returns</h1>
          <p className="text-rose-200">Everything you need to know about delivery and our hassle-free return policy.</p>
        </motion.div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      {/* Shipping */}
      <Section icon={<Truck size={22} />} title="Shipping Options" delay={0.05}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="pb-3 text-xs font-bold uppercase tracking-widest text-rose-400">Method</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-widest text-rose-400">Delivery Time</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-widest text-rose-400">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {[
                { method: 'Standard (India)', time: '5–7 business days', cost: 'Free on orders ₹1,000+, else ₹99' },
                { method: 'Express (India)', time: '2–3 business days', cost: '₹199' },
                { method: 'Same-Day (Select cities)', time: 'Within 8 hours', cost: '₹299' },
                { method: 'International', time: '10–15 business days', cost: 'Calculated at checkout' },
              ].map(row => (
                <tr key={row.method}>
                  <td className="py-3 font-medium text-rose-950">{row.method}</td>
                  <td className="py-3 text-gray-600">{row.time}</td>
                  <td className="py-3 text-gray-600">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-400">* Business days exclude Sundays and public holidays. Delivery times are estimates and may vary during sale seasons.</p>
      </Section>

      {/* Delivery Info */}
      <Section icon={<Clock size={22} />} title="Delivery Information" delay={0.1}>
        <div className="space-y-0">
          <Row label="Order processing time" value="1–2 business days" />
          <Row label="Tracking notification" value="Sent via email & SMS after dispatch" />
          <Row label="Delivery attempts" value="3 attempts before return to warehouse" />
          <Row label="Safe locations" value="Available — add instructions at checkout" />
          <Row label="Signature required" value="For orders above ₹5,000" />
        </div>
      </Section>

      {/* International */}
      <Section icon={<Globe size={22} />} title="International Shipping" delay={0.15}>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          We ship to 30+ countries. Import duties, taxes, and customs fees are the responsibility of the customer and are not included in the order total. Please check your country's import regulations before ordering.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['USA', 'UK', 'UAE', 'Canada', 'Australia', 'Singapore', 'Germany', 'France'].map(country => (
            <div key={country} className="text-center py-2 px-3 bg-rose-50 rounded-xl text-sm font-medium text-rose-800">
              {country}
            </div>
          ))}
        </div>
      </Section>

      {/* Returns */}
      <Section icon={<RefreshCcw size={22} />} title="Returns Policy" delay={0.2}>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>We offer a <strong className="text-rose-900">15-day return window</strong> from the date of delivery. Items must meet the following conditions:</p>
          <ul className="space-y-2">
            {[
              'Unworn and unwashed in original condition',
              'All original tags attached',
              'Original packaging intact',
              'No perfume, makeup, or stains',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-rose-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Non-returnable */}
      <Section icon={<AlertCircle size={22} />} title="Non-Returnable Items" delay={0.25}>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            'Custom-stitched or altered garments',
            'Sale or clearance items (unless defective)',
            'Lingerie, innerwear, and accessories',
            'Items marked "Final Sale" on the product page',
          ].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* Refund timeline */}
      <Section icon={<Clock size={22} />} title="Refund Timeline" delay={0.3}>
        <div className="relative pl-6">
          {[
            { step: 'Return request submitted', time: 'Day 0' },
            { step: 'Pickup scheduled', time: 'Within 48 hrs' },
            { step: 'Item received & inspected', time: '3–5 days' },
            { step: 'Refund approved', time: 'Day 5–7' },
            { step: 'Amount credited to your account', time: 'Day 7–10' },
          ].map((item, i) => (
            <div key={i} className="relative pb-5 last:pb-0">
              <div className="absolute left-[-1.25rem] top-1 w-2.5 h-2.5 rounded-full bg-rose-900" />
              {i < 4 && <div className="absolute left-[-0.875rem] top-3 w-0.5 h-full bg-rose-100" />}
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-rose-950">{item.step}</p>
                <span className="text-xs text-rose-400 font-bold ml-4 shrink-0">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/contact')}
          className="px-8 py-3 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-colors"
        >
          Still have questions? Contact Us
        </button>
      </div>
    </div>
  </div>
);

export default ShippingReturnsPage;
