import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ruler } from 'lucide-react';

interface SizeGuidePageProps {
  onNavigate: (path: string) => void;
}

type Tab = 'Sarees' | 'Lehengas' | 'Kurtis & Suits';

const sizeData: Record<Tab, { headers: string[]; rows: string[][] }> = {
  Sarees: {
    headers: ['Size', 'Blouse Bust (in)', 'Blouse Waist (in)', 'Blouse Length (in)', 'Saree Length (m)'],
    rows: [
      ['XS', '30–32', '26–28', '14–15', '5.5'],
      ['S', '32–34', '28–30', '15–16', '5.5'],
      ['M', '34–36', '30–32', '15–16', '5.5'],
      ['L', '36–38', '32–34', '16–17', '5.5'],
      ['XL', '38–40', '34–36', '16–17', '5.5'],
      ['XXL', '40–44', '36–40', '17–18', '5.5'],
    ],
  },
  Lehengas: {
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Blouse Length (in)', 'Lehenga Length (in)'],
    rows: [
      ['XS', '30–32', '24–26', '34–36', '14', '42'],
      ['S', '32–34', '26–28', '36–38', '15', '43'],
      ['M', '34–36', '28–30', '38–40', '15', '44'],
      ['L', '36–38', '30–32', '40–42', '16', '44'],
      ['XL', '38–40', '32–34', '42–44', '16', '45'],
      ['XXL', '40–44', '34–38', '44–48', '17', '45'],
    ],
  },
  'Kurtis & Suits': {
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Kurti Length (in)', 'Shoulder (in)'],
    rows: [
      ['XS', '30–32', '24–26', '34–36', '44', '13'],
      ['S', '32–34', '26–28', '36–38', '45', '14'],
      ['M', '34–36', '28–30', '38–40', '46', '14.5'],
      ['L', '36–38', '30–32', '40–42', '47', '15'],
      ['XL', '38–40', '32–34', '42–44', '48', '15.5'],
      ['XXL', '40–44', '34–38', '44–48', '49', '16'],
    ],
  },
};

const tips = [
  { label: 'Bust', desc: 'Measure around the fullest part of your chest, keeping the tape parallel to the ground.' },
  { label: 'Waist', desc: 'Measure around your natural waistline — the narrowest part of your torso.' },
  { label: 'Hip', desc: 'Measure around the fullest part of your hips, about 8–9 inches below your waist.' },
  { label: 'Shoulder', desc: 'Measure from shoulder tip to shoulder tip across your back.' },
  { label: 'Length', desc: 'Measure from the top of your shoulder straight down to your desired hemline.' },
];

const SizeGuidePage: React.FC<SizeGuidePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Sarees');
  const table = sizeData[activeTab];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-950 to-rose-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Ruler className="mx-auto mb-4 text-rose-300" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Size Guide</h1>
            <p className="text-rose-200">Find your perfect fit with our detailed size charts.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* How to measure */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50/60 rounded-2xl border border-rose-100 p-8 mb-10"
        >
          <h2 className="text-xl font-serif font-bold text-rose-950 mb-6">How to Measure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map(tip => (
              <div key={tip.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  {tip.label[0]}
                </div>
                <div>
                  <p className="font-bold text-sm text-rose-950">{tip.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-gray-400 border-t border-rose-100 pt-4">
            All measurements are in inches unless stated otherwise. If you're between sizes, we recommend sizing up for comfort.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(Object.keys(sizeData) as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-rose-900 text-white shadow-lg' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Size Table */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-x-auto rounded-2xl border border-rose-100 shadow-sm"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rose-900 text-white">
                {table.headers.map(h => (
                  <th key={h} className="px-4 py-4 text-left text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-rose-50/40'}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-3 whitespace-nowrap ${j === 0 ? 'font-bold text-rose-900' : 'text-gray-600'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { title: 'Between sizes?', body: 'For a relaxed fit, size up. For a fitted look, stay with your exact measurements.' },
            { title: 'Custom stitching', body: 'All our garments can be custom stitched to your measurements. Select the option on the product page.' },
            { title: 'Need more help?', body: 'Contact our styling team with your measurements and we\'ll guide you to the perfect size.' },
          ].map(card => (
            <div key={card.title} className="bg-rose-50 rounded-2xl p-6">
              <h3 className="font-bold text-rose-950 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('/contact')}
            className="px-8 py-3 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-colors"
          >
            Need help finding your size? Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
