import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';

interface ContactUsPageProps {
  onNavigate: (path: string) => void;
}

const ContactUsPage: React.FC<ContactUsPageProps> = ({ onNavigate }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const info = [
    { icon: <Mail size={20} />, label: 'Email', value: 'support@ruwaverse.com', sub: 'We reply within 24 hours' },
    { icon: <Phone size={20} />, label: 'Phone', value: '+91 98765 43210', sub: 'Mon–Sat, 9 AM – 6 PM IST' },
    { icon: <MapPin size={20} />, label: 'Address', value: 'RuWa Verse, 12 Fashion Street', sub: 'Mumbai, Maharashtra 400001' },
    { icon: <Clock size={20} />, label: 'Business Hours', value: 'Mon – Sat: 9 AM – 6 PM', sub: 'Closed on Sundays & holidays' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-950 to-rose-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <MessageCircle className="mx-auto mb-4 text-rose-300" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Contact Us</h1>
            <p className="text-rose-200">We'd love to hear from you. Reach out and we'll get back to you shortly.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-serif font-bold text-rose-950 mb-6">Get in Touch</h2>
            {info.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-5 bg-rose-50/60 rounded-2xl border border-rose-100"
              >
                <div className="p-2.5 bg-rose-900 text-white rounded-xl shrink-0">{item.icon}</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-0.5">{item.label}</p>
                  <p className="font-semibold text-rose-950 text-sm">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Quick links */}
            <div className="pt-2 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-3">Quick Links</p>
              {[
                { label: 'Help Center', path: '/help-center' },
                { label: 'Shipping & Returns', path: '/shipping-returns' },
                { label: 'Size Guide', path: '/size-guide' },
              ].map(link => (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className="block w-full text-left text-sm text-rose-700 hover:text-rose-900 font-medium transition-colors py-1"
                >
                  → {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-rose-100 shadow-sm p-8"
            >
              {submitted ? (
                <div className="py-16 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle size={56} className="mx-auto text-rose-500 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-bold text-rose-950 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm mb-8">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="px-6 py-3 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-serif font-bold text-rose-950 mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Priya Sharma"
                          className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm text-rose-950 placeholder:text-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="priya@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm text-rose-950 placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                      <select
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm text-rose-950 appearance-none"
                      >
                        <option value="">Select a subject</option>
                        <option value="order">Order Enquiry</option>
                        <option value="return">Return / Exchange</option>
                        <option value="product">Product Question</option>
                        <option value="shipping">Shipping & Delivery</option>
                        <option value="payment">Payment Issue</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Message</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm text-rose-950 placeholder:text-gray-300 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-rose-900 text-white rounded-2xl font-bold text-sm hover:bg-rose-800 transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
