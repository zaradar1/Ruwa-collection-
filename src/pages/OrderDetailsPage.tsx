import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, MapPin, Calendar, CreditCard, ChevronLeft, ExternalLink, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { getOrderById } from '../services/orderService';
import { useAuth } from '../components/AuthContext';

interface OrderDetailsPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ orderId, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      const data = await getOrderById(orderId);
      if (data) {
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif font-bold text-rose-950 mb-4">Order not found</h2>
        <button onClick={() => onNavigate('/profile')} className="text-rose-900 font-bold underline">Back to My Orders</button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button 
        onClick={() => onNavigate('/profile')}
        className="flex items-center gap-2 text-gray-500 hover:text-rose-900 transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Orders</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-serif font-bold text-rose-950">Order Details</h1>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-gray-500 font-medium">Order ID: <span className="text-rose-900 font-mono">#{order.id.slice(-8).toUpperCase()}</span></p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-rose-50 bg-rose-50/30">
              <h3 className="font-bold text-rose-950 flex items-center gap-2">
                <ShoppingBag size={18} />
                Items Ordered
              </h3>
            </div>
            <div className="divide-y divide-rose-50">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-6 flex gap-6">
                  <div className="w-24 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-rose-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-rose-950 text-lg">{item.name}</h4>
                      <span className="font-bold text-rose-900">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                      {item.selectedSize} • {item.selectedColor}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Quantity: {item.qty}</span>
                      <span className="text-xs text-gray-400">₹{item.price.toLocaleString()} each</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-rose-50/20 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-rose-950">₹{order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest">Free</span>
              </div>
              <div className="flex justify-between text-2xl font-serif font-bold border-t border-rose-100 pt-6 mt-2">
                <span className="text-rose-950">Total Amount</span>
                <span className="text-rose-900">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          {(order.trackingNumber || order.status === 'shipped') && (
            <div className="bg-white rounded-3xl border border-rose-100 p-8 shadow-sm">
              <h3 className="font-bold text-rose-950 mb-6 flex items-center gap-2">
                <Truck size={18} />
                Tracking Information
              </h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Carrier</p>
                    <p className="font-bold text-rose-950">{order.shippingCarrier || 'Standard Delivery'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking Number</p>
                    <p className="font-mono text-rose-900 font-bold">{order.trackingNumber || 'Pending Assignment'}</p>
                  </div>
                </div>
                {order.trackingNumber && (
                  <a 
                    href={`https://www.google.com/search?q=${order.shippingCarrier}+tracking+${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 text-rose-900 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all border border-rose-100"
                  >
                    Track Package
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Shipping & Payment */}
        <div className="space-y-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-rose-100 p-8 shadow-sm">
            <h3 className="font-bold text-rose-950 mb-6 flex items-center gap-2">
              <MapPin size={18} />
              Shipping Address
            </h3>
            <div className="space-y-1">
              <p className="font-bold text-rose-950">{user?.displayName}</p>
              <p className="text-gray-600 leading-relaxed">
                {order.address?.street}<br />
                {order.address?.city}, {order.address?.zip}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-3xl border border-rose-100 p-8 shadow-sm">
            <h3 className="font-bold text-rose-950 mb-6 flex items-center gap-2">
              <CreditCard size={18} />
              Payment Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Method</span>
                <span className="font-bold text-rose-950 uppercase text-xs tracking-widest">{order.paymentMethod || 'Card'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {order.paymentStatus || 'Paid'}
                </span>
              </div>
              {order.paymentDetails && (
                <div className="pt-4 border-t border-rose-50">
                  <div className="flex items-center gap-3 text-rose-900 mb-2">
                    <CreditCard size={16} />
                    <span className="font-bold text-sm">{order.paymentDetails.brand} •••• {order.paymentDetails.last4}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono">ID: {order.paymentDetails.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Help Box */}
          <div className="bg-rose-900 rounded-3xl p-8 text-white shadow-lg shadow-rose-900/20">
            <h4 className="font-serif font-bold text-xl mb-4">Need Help?</h4>
            <p className="text-rose-100 text-sm leading-relaxed mb-6">
              If you have any questions about your order, our concierge is here to assist you.
            </p>
            <button className="w-full py-3 bg-white text-rose-900 rounded-xl font-bold text-sm hover:bg-rose-50 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
