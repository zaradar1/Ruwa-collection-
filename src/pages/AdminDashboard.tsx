import React, { useState } from 'react';
import { Plus, CreditCard, Package, Users, BarChart3, Trash2, Edit, CheckCircle, XCircle, X, Save, Image as ImageIcon, Video, Eye } from 'lucide-react';
import { useAdmin } from '../components/AdminContext';
import { useProducts } from '../components/ProductContext';
import { addProduct, updateProduct, deleteProduct } from '../services/productService';
import { updateOrderStatus, updateOrderTracking } from '../services/orderService';
import { Product, Order } from '../types';
import toast from 'react-hot-toast';

const TrackingForm = ({ order, onSave, onCancel }: { order: Order, onSave: (trackingNumber: string, shippingCarrier: string) => void, onCancel: () => void }) => {
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [shippingCarrier, setShippingCarrier] = useState(order.shippingCarrier || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber || !shippingCarrier) {
      toast.error('Please fill in both fields');
      return;
    }
    onSave(trackingNumber, shippingCarrier);
  };

  return (
    <div className="fixed inset-0 bg-rose-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-rose-950">Update Tracking</h3>
          <button onClick={onCancel} className="p-2 hover:bg-rose-50 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Shipping Carrier</label>
            <input 
              type="text" 
              value={shippingCarrier}
              onChange={(e) => setShippingCarrier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
              placeholder="e.g. FedEx, DHL, BlueDart"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tracking Number</label>
            <input 
              type="text" 
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
              placeholder="Enter tracking ID"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl border border-rose-100 text-rose-900 font-bold hover:bg-rose-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-rose-900 text-white font-bold hover:bg-rose-800 transition-colors"
            >
              Save Tracking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, change }: { label: string, value: string, icon: any, color: string, change: string }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-50 hover:shadow-xl transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-rose-50 ${color}`}>
        <Icon size={28} />
      </div>
      <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{change}</span>
    </div>
    <h3 className="text-3xl font-bold text-rose-950 mb-2">{value}</h3>
    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</p>
  </div>
);

const ProductForm = ({ product, onSave, onCancel }: { product?: Product, onSave: (p: any) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    price: 0,
    category: 'Sarees',
    description: '',
    image: '',
    video: '',
    stock: 10,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red', 'Blue', 'Gold'],
    new: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-rose-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-rose-950">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-rose-50 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                placeholder="e.g. Silk Banarasi Saree"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price (₹) *</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category *</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as Product['category']})}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                {['Sarees', 'Lehengas', 'Kurtis', 'Anarkalis', 'Suits'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stock *</label>
              <input 
                type="number" 
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description *</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 h-32"
              placeholder="Describe the product details, fabric, and style..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL *</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Video URL (Optional)</label>
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={formData.video}
                  onChange={(e) => setFormData({...formData, video: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isNew"
              checked={formData.new}
              onChange={(e) => setFormData({...formData, new: e.target.checked})}
              className="w-5 h-5 rounded border-rose-100 text-rose-900 focus:ring-rose-200"
            />
            <label htmlFor="isNew" className="text-sm font-bold text-rose-950">Mark as New Arrival</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl border border-rose-100 text-rose-900 font-bold hover:bg-rose-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-rose-900 text-white font-bold hover:bg-rose-800 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} /> {product ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  onNavigate?: (path: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { allOrders, loading: ordersLoading } = useAdmin();
  const { products, loading: productsLoading } = useProducts();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
      } catch (e) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }
      setIsFormOpen(false);
      setEditingProduct(undefined);
    } catch (e) {
      toast.error('Failed to save product');
    }
  };

  const handleSaveTracking = async (trackingNumber: string, shippingCarrier: string) => {
    if (!trackingOrder) return;
    try {
      await updateOrderTracking(trackingOrder.id, trackingNumber, shippingCarrier);
      toast.success('Tracking information updated');
      setTrackingOrder(null);
    } catch (e) {
      toast.error('Failed to update tracking');
    }
  };

  if (ordersLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-900 rounded-full animate-spin mb-4"></div>
          <p className="text-rose-900 font-serif font-bold tracking-widest uppercase text-xs">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onSave={handleSaveProduct} 
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(undefined);
          }} 
        />
      )}

      {trackingOrder && (
        <TrackingForm 
          order={trackingOrder}
          onSave={handleSaveTracking}
          onCancel={() => setTrackingOrder(null)}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-rose-950 mb-2">Admin Control</h1>
          <p className="text-gray-500 font-medium">Manage your boutique's operations and analytics.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-rose-900 text-white shadow-lg' : 'bg-rose-50 text-rose-900 hover:bg-rose-100'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-rose-900 text-white shadow-lg' : 'bg-rose-50 text-rose-900 hover:bg-rose-100'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-rose-900 text-white shadow-lg' : 'bg-rose-50 text-rose-900 hover:bg-rose-100'}`}
          >
            Orders
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={CreditCard} color="text-green-600" change="+15%" />
            <StatCard label="Total Orders" value={allOrders.length.toString()} icon={Package} color="text-rose-600" change="+8%" />
            <StatCard label="Total Products" value={products.length.toString()} icon={BarChart3} color="text-purple-600" change="+2%" />
            <StatCard label="Active Users" value="854" icon={Users} color="text-orange-600" change="+12%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-rose-50 p-8">
              <h3 className="text-xl font-serif font-bold mb-8 text-rose-950">Sales Performance</h3>
              <div className="aspect-video bg-rose-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-rose-200">
                <p className="text-rose-300 font-bold uppercase tracking-widest">Analytics Chart Placeholder</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-rose-50 p-8">
              <h3 className="text-xl font-serif font-bold mb-8 text-rose-950">Recent Activity</h3>
              <div className="space-y-6">
                {allOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between pb-6 border-b border-rose-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center font-bold text-rose-500">
                        #{order.id.slice(-4)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-rose-950">Order #{order.id.slice(-4)}</p>
                        <p className="text-xs text-gray-500">{order.items.length} items • ₹{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                      order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                      order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl shadow-sm border border-rose-50 overflow-hidden">
          <div className="p-8 border-b border-rose-50 flex justify-between items-center">
            <h3 className="text-xl font-serif font-bold text-rose-950">Inventory Management</h3>
            <button 
              onClick={() => {
                setEditingProduct(undefined);
                setIsFormOpen(true);
              }}
              className="px-6 py-2 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-rose-50 text-rose-900 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4">Category</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4">Stock</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={p.image} alt="" className="w-12 h-16 object-cover rounded-lg shadow-sm" />
                        <span className="font-bold text-rose-950">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-600">{p.category}</td>
                    <td className="px-8 py-6 font-bold text-rose-900">₹{p.price.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={`font-bold text-sm ${p.stock < 5 ? 'text-red-500' : 'text-gray-600'}`}>{p.stock}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            setEditingProduct(p);
                            setIsFormOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-rose-900 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl shadow-sm border border-rose-50 overflow-hidden">
          <div className="p-8 border-b border-rose-50">
            <h3 className="text-xl font-serif font-bold text-rose-950">Order Fulfillment</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-rose-50 text-rose-900 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Total</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Tracking</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {allOrders.map(order => (
                  <tr key={order.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-8 py-6 font-bold text-rose-950">#{order.id.slice(-6)}</td>
                    <td className="px-8 py-6 text-sm text-gray-600">{order.userId.slice(0, 8)}...</td>
                    <td className="px-8 py-6 font-bold text-rose-900">₹{order.total.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                        order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {order.trackingNumber ? (
                        <div className="text-xs">
                          <p className="font-bold text-rose-950">{order.shippingCarrier}</p>
                          <p className="text-gray-500">{order.trackingNumber}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No tracking</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                        <button onClick={() => onNavigate?.(`/order/${order.id}`)} className="p-2 text-gray-400 hover:text-rose-950 transition-colors" title="View Details"><Eye size={18} /></button>
                        <button onClick={() => setTrackingOrder(order)} className="p-2 text-gray-400 hover:text-rose-950 transition-colors" title="Update Tracking"><Plus size={18} /></button>
                        <button onClick={() => handleStatusUpdate(order.id, 'shipped')} className="p-2 text-gray-400 hover:text-rose-900 transition-colors" title="Mark as Shipped"><Package size={18} /></button>
                        <button onClick={() => handleStatusUpdate(order.id, 'delivered')} className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Mark as Delivered"><CheckCircle size={18} /></button>
                        <button onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Cancel Order"><XCircle size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
