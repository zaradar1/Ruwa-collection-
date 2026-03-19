import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, CreditCard, Truck, CheckCircle, ArrowRight, ChevronLeft, MapPin } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { createOrder } from '../services/orderService';
import toast from 'react-hot-toast';

import { processPayment } from '../services/paymentService';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    city: '',
    zip: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-rose-400" size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-rose-950 mb-2">Your bag is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Add some beautiful pieces to your collection before checking out.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-8 py-3 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all shadow-lg"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Process Payment if not COD
      if (paymentMethod !== 'cod') {
        const paymentSuccess = await processPayment({
          amount: total,
          currency: 'INR',
          name: 'The Boutique',
          description: `Order for ${cart.length} items`,
          email: user.email || '',
          contact: shippingInfo.phone
        });

        if (!paymentSuccess) {
          setIsProcessing(false);
          return;
        }
      }

      // 2. Create Order in Firestore
      const orderData = {
        userId: user.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        })),
        total,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        address: {
          street: shippingInfo.street,
          city: shippingInfo.city,
          zip: shippingInfo.zip
        },
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' as const : 'paid' as const,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? {
          last4: '4242',
          brand: 'Visa',
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 9)
        } : undefined
      };

      const docRef = await createOrder(orderData);
      if (docRef) {
        clearCart();
        setStep(3);
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-12 max-w-md mx-auto lg:mx-0">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= i ? 'bg-rose-900 text-white' : 'bg-rose-50 text-rose-300'}`}>
                    {step > i ? <CheckCircle size={18} /> : i}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= i ? 'text-rose-900' : 'text-gray-300'}`}>
                    {i === 1 ? 'Shipping' : i === 2 ? 'Payment' : 'Success'}
                  </span>
                </div>
                {i < 3 && <div className={`flex-1 h-[2px] mx-4 -mt-6 transition-all ${step > i ? 'bg-rose-900' : 'bg-rose-50'}`} />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-serif font-bold text-rose-950">Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Street Address</label>
                  <input
                    type="text"
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="123 Boutique Lane"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={shippingInfo.zip}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="400001"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!shippingInfo.street || !shippingInfo.city || !shippingInfo.zip}
                className="w-full py-4 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Continue to Payment
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setStep(1)} className="p-2 hover:bg-rose-50 rounded-full transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-3xl font-serif font-bold text-rose-950">Payment Method</h2>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} /> },
                  { id: 'upi', label: 'UPI / Net Banking', icon: <MapPin size={20} /> },
                  { id: 'cod', label: 'Cash on Delivery', icon: <Truck size={20} /> }
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-rose-900 bg-rose-50/30' : 'border-rose-50 hover:border-rose-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${paymentMethod === method.id ? 'bg-rose-900 text-white' : 'bg-rose-50 text-rose-400'}`}>
                        {method.icon}
                      </div>
                      <span className="font-bold text-rose-950">{method.label}</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      className="w-5 h-5 accent-rose-900"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id as any)}
                    />
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-rose-50/30 p-8 rounded-3xl border border-rose-100 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Card Number</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      placeholder="**** **** **** 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Expiry Date</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">CVV</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        placeholder="***"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-4 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Place Order • ₹{total.toLocaleString()}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-8"
            >
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <div>
                <h2 className="text-4xl font-serif font-bold text-rose-950 mb-4">Thank You!</h2>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  Your order has been placed successfully. We've sent a confirmation email to your registered address.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('/profile')}
                  className="px-8 py-4 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all shadow-lg"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="px-8 py-4 bg-white text-rose-900 border border-rose-100 rounded-full font-bold text-sm hover:bg-rose-50 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Summary */}
        {step !== 3 && (
          <div className="lg:w-96">
            <div className="bg-rose-50/30 rounded-3xl p-8 border border-rose-100 sticky top-32">
              <h3 className="text-xl font-serif font-bold text-rose-950 mb-8 flex items-center gap-2">
                <ShoppingBag size={20} />
                Order Summary
              </h3>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-white border border-rose-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-rose-950 line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                        {item.selectedSize} • {item.selectedColor}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-medium text-gray-500">Qty: {item.qty}</span>
                        <span className="font-bold text-rose-900">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-rose-100 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-rose-950">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest">Free</span>
                </div>
                <div className="flex justify-between text-lg font-serif font-bold border-t border-rose-100 pt-4 mt-4">
                  <span className="text-rose-950">Total</span>
                  <span className="text-rose-900">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
