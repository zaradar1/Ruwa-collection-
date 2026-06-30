import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Palette,
  Settings, LogOut, Plus, Edit, Trash2, CheckCircle, XCircle,
  Eye, Search, X, Save, Image as ImageIcon, Video, BarChart3,
  CreditCard, Truck, Bell, Shield, Lock, RefreshCw, Star,
  TrendingUp, AlertCircle, ChevronRight, Mail, Phone, UserCheck,
  Monitor, Megaphone, Type, Layers, ToggleLeft, ToggleRight,
  KeyRound, Menu, ChevronDown,
} from 'lucide-react';
import { useAdmin } from '../components/AdminContext';
import { useProducts } from '../components/ProductContext';
import { useAuth } from '../components/AuthContext';
import { addProduct, updateProduct, deleteProduct } from '../services/productService';
import { updateOrderStatus, updateOrderTracking } from '../services/orderService';
import { updateUserProfile } from '../services/userService';
import { updateSiteConfig, loadLocalConfig, SiteConfig } from '../services/siteConfigService';
import {
  auth, sendPasswordResetEmail, updatePassword,
  EmailAuthProvider, reauthenticateWithCredential,
} from '../services/firebase';
import { Product, Order, UserProfile } from '../types';
import toast from 'react-hot-toast';

// ─── helpers ─────────────────────────────────────────────────────────────────
type Section = 'overview' | 'orders' | 'products' | 'users' | 'design' | 'settings';

const statusColor: Record<string, string> = {
  delivered: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  shipped: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-red-50 text-red-600',
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{children}</p>
);

const Field: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <Label>{label}</Label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm text-rose-950 bg-white"
    />
  </div>
);

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
  { id: 'products', label: 'Products', icon: <ShoppingBag size={18} /> },
  { id: 'users', label: 'Users', icon: <Users size={18} /> },
  { id: 'design', label: 'Design Studio', icon: <Palette size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

const Sidebar: React.FC<{ active: Section; onSelect: (s: Section) => void; user: any; profile: any; logout: () => void; collapsed: boolean; onToggle: () => void }> = ({
  active, onSelect, user, profile, logout, collapsed, onToggle,
}) => (
  <div className={`${collapsed ? 'w-16' : 'w-64'} bg-rose-950 text-white flex flex-col transition-all duration-300 shrink-0`}>
    <div className={`p-4 border-b border-rose-900 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
      {!collapsed && <span className="text-lg font-serif font-bold">Admin Panel</span>}
      <button onClick={onToggle} className="p-1.5 hover:bg-rose-900 rounded-lg transition-colors">
        <Menu size={18} />
      </button>
    </div>

    <nav className="flex-1 p-3 space-y-1">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
            active === item.id ? 'bg-white/15 text-white font-bold' : 'text-rose-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="shrink-0">{item.icon}</span>
          {!collapsed && <span className="text-sm">{item.label}</span>}
        </button>
      ))}
    </nav>

    {!collapsed && (
      <div className="p-4 border-t border-rose-900">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'Admin'}&background=881337&color=fff`}
            alt=""
            className="w-9 h-9 rounded-full border-2 border-rose-700"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{profile?.displayName || 'Admin'}</p>
            <p className="text-[10px] text-rose-400 uppercase tracking-widest">Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:bg-white/5 hover:text-white transition-all text-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    )}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; change: string; positive?: boolean }> = ({
  label, value, icon, change, positive = true,
}) => (
  <div className="bg-white rounded-2xl border border-rose-50 p-6 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-rose-50 rounded-xl text-rose-700">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{change}</span>
    </div>
    <p className="text-2xl font-bold text-rose-950 mb-1">{value}</p>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
  </div>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const MiniBarChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-rose-200 rounded-t-md transition-all duration-500"
            style={{ height: `${(v / max) * 80}px` }}
          />
          <span className="text-[9px] text-gray-400 font-bold">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Product Form Modal ───────────────────────────────────────────────────────
const ProductModal: React.FC<{ product?: Product; onSave: (p: any) => void; onCancel: () => void }> = ({
  product, onSave, onCancel,
}) => {
  const [form, setForm] = useState<Partial<Product>>(product || {
    name: '', price: 0, category: 'Sarees', description: '', image: '',
    video: '', stock: 10, sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Blue'], new: true,
  });

  const set = (k: keyof Product, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image || !form.description) {
      toast.error('Fill in all required fields');
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-rose-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif font-bold text-rose-950">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-rose-50 rounded-full"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name *" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Silk Banarasi Saree" />
            <Field label="Price (₹) *" type="number" value={form.price} onChange={e => set('price', parseFloat(e.target.value))} />
            <div>
              <Label>Category *</Label>
              <select value={form.category} onChange={e => set('category', e.target.value as any)} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm bg-white">
                {['Sarees', 'Lehengas', 'Kurtis', 'Anarkalis', 'Suits'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Stock *" type="number" value={form.stock} onChange={e => set('stock', parseInt(e.target.value))} />
          </div>
          <div>
            <Label>Description *</Label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Image URL *</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 text-gray-300" size={16} />
                <input type="text" value={form.image} onChange={e => set('image', e.target.value)} className="w-full pl-9 pr-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label>Video URL (optional)</Label>
              <div className="relative">
                <Video className="absolute left-3 top-3 text-gray-300" size={16} />
                <input type="text" value={form.video} onChange={e => set('video', e.target.value)} className="w-full pl-9 pr-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" placeholder="https://..." />
              </div>
            </div>
          </div>
          {form.image && (
            <div className="rounded-xl overflow-hidden h-32 bg-rose-50">
              <img src={form.image} alt="preview" className="w-full h-full object-cover object-top" />
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.new} onChange={e => set('new', e.target.checked)} className="w-4 h-4 rounded border-rose-200 text-rose-900" />
            <span className="text-sm font-bold text-rose-950">Mark as New Arrival</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl border border-rose-100 text-rose-900 font-bold text-sm hover:bg-rose-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-rose-900 text-white font-bold text-sm hover:bg-rose-800 flex items-center justify-center gap-2">
              <Save size={16} /> {product ? 'Update' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Tracking Modal ───────────────────────────────────────────────────────────
const TrackingModal: React.FC<{ order: Order; onSave: (t: string, c: string) => void; onCancel: () => void }> = ({
  order, onSave, onCancel,
}) => {
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [carrier, setCarrier] = useState(order.shippingCarrier || '');
  return (
    <div className="fixed inset-0 bg-rose-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif font-bold text-rose-950">Update Tracking</h3>
          <button onClick={onCancel} className="p-2 hover:bg-rose-50 rounded-full"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Carrier" value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="FedEx, DHL, BlueDart..." />
          <Field label="Tracking Number" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Enter tracking ID" />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-rose-100 text-rose-900 font-bold text-sm hover:bg-rose-50">Cancel</button>
          <button onClick={() => onSave(tracking, carrier)} className="flex-1 py-3 rounded-xl bg-rose-900 text-white font-bold text-sm hover:bg-rose-800">Save Tracking</button>
        </div>
      </div>
    </div>
  );
};

// ─── Edit User Modal ──────────────────────────────────────────────────────────
const EditUserModal: React.FC<{ user: UserProfile; onSave: (u: Partial<UserProfile>) => void; onCancel: () => void; onResetPassword: (email: string) => void }> = ({
  user, onSave, onCancel, onResetPassword,
}) => {
  const [form, setForm] = useState({ displayName: user.displayName, phoneNumber: user.phoneNumber || '', role: user.role });
  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 bg-rose-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif font-bold text-rose-950">Edit User</h3>
          <button onClick={onCancel} className="p-2 hover:bg-rose-50 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 bg-rose-50/60 rounded-2xl">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=fdf2f2&color=9f1239`}
            alt=""
            className="w-12 h-12 rounded-full border-2 border-rose-100"
          />
          <div>
            <p className="font-bold text-rose-950">{user.displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Field label="Display Name" value={form.displayName} onChange={e => set('displayName', e.target.value)} />
          <Field label="Phone Number" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} placeholder="+91 98765 43210" />
          <div>
            <Label>Role</Label>
            <div className="flex gap-3">
              {(['user', 'admin'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => set('role', r)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.role === r ? 'bg-rose-900 text-white border-rose-900' : 'border-rose-100 text-rose-700 hover:bg-rose-50'}`}
                >
                  {r === 'admin' ? '🔑 Admin' : '👤 User'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-xs font-bold text-amber-700 mb-2">Password Reset</p>
          <button
            onClick={() => onResetPassword(user.email)}
            className="w-full py-2 rounded-lg bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 flex items-center justify-center gap-2"
          >
            <Mail size={14} /> Send Password Reset Email
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-rose-100 text-rose-900 font-bold text-sm hover:bg-rose-50">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3 rounded-xl bg-rose-900 text-white font-bold text-sm hover:bg-rose-800 flex items-center justify-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── OVERVIEW SECTION ─────────────────────────────────────────────────────────
const OverviewSection: React.FC<{ orders: Order[]; products: Product[]; users: UserProfile[]; onNavigate: (s: Section) => void }> = ({
  orders, products, users, onNavigate,
}) => {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'pending').length;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const revenueData = months.map((_, i) => Math.floor(Math.random() * 80000 + 20000));

  const topProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-rose-950">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here's what's happening.</p>
      </div>

      {pending > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle size={18} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 font-medium"><strong>{pending} orders</strong> are pending fulfillment.</p>
          <button onClick={() => onNavigate('orders')} className="ml-auto text-xs font-bold text-amber-700 hover:underline whitespace-nowrap">View Orders →</button>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<CreditCard size={20} />} change="+15%" />
        <StatCard label="Total Orders" value={orders.length.toString()} icon={<Package size={20} />} change="+8%" />
        <StatCard label="Products" value={products.length.toString()} icon={<ShoppingBag size={20} />} change="+2%" />
        <StatCard label="Users" value={users.length.toString()} icon={<Users size={20} />} change="+12%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-rose-50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-rose-950">Revenue Trend</h3>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Last 6 months</span>
          </div>
          <MiniBarChart data={revenueData} labels={months} />
          <div className="mt-4 flex gap-6 text-sm">
            <div><p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Peak Month</p><p className="font-bold text-rose-900">{months[revenueData.indexOf(Math.max(...revenueData))]}</p></div>
            <div><p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Avg / Month</p><p className="font-bold text-rose-900">₹{Math.floor(revenueData.reduce((a, b) => a + b, 0) / 6).toLocaleString()}</p></div>
            <div><p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total</p><p className="font-bold text-rose-900">₹{revenueData.reduce((a, b) => a + b, 0).toLocaleString()}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-50 p-6 shadow-sm">
          <h3 className="font-serif font-bold text-rose-950 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-rose-950">#{order.id.slice(-6)}</p>
                  <p className="text-xs text-gray-400">₹{order.total.toLocaleString()}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>{order.status}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>}
          </div>
          <button onClick={() => onNavigate('orders')} className="mt-4 w-full text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center justify-center gap-1">
            View all orders <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-rose-50 p-6 shadow-sm">
          <h3 className="font-serif font-bold text-rose-950 mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt="" className="w-10 h-12 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-rose-950 truncate">{p.name}</p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={11} fill="currentColor" />
                    <span className="text-xs text-gray-500">{p.rating} ({p.reviews})</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-rose-900">₹{p.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-50 p-6 shadow-sm">
          <h3 className="font-serif font-bold text-rose-950 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Product', icon: <Plus size={18} />, action: () => onNavigate('products') },
              { label: 'View Orders', icon: <Package size={18} />, action: () => onNavigate('orders') },
              { label: 'Manage Users', icon: <Users size={18} />, action: () => onNavigate('users') },
              { label: 'Design Studio', icon: <Palette size={18} />, action: () => onNavigate('design') },
            ].map(q => (
              <button
                key={q.label}
                onClick={q.action}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors text-rose-900"
              >
                {q.icon}
                <span className="text-xs font-bold">{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ORDERS SECTION ──────────────────────────────────────────────────────────
const OrdersSection: React.FC<{ orders: Order[]; onNavigate?: (path: string) => void }> = ({ orders, onNavigate }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const filtered = useMemo(() =>
    orders.filter(o =>
      (statusFilter === 'all' || o.status === statusFilter) &&
      (!search || o.id.toLowerCase().includes(search.toLowerCase()) || o.userId.toLowerCase().includes(search.toLowerCase()))
    ), [orders, statusFilter, search]);

  const handleStatus = async (id: string, status: Order['status']) => {
    try { await updateOrderStatus(id, status); toast.success(`Marked as ${status}`); }
    catch { toast.error('Failed to update status'); }
  };

  const handleTracking = async (tracking: string, carrier: string) => {
    if (!trackingOrder) return;
    try { await updateOrderTracking(trackingOrder.id, tracking, carrier); toast.success('Tracking updated'); setTrackingOrder(null); }
    catch { toast.error('Failed to update tracking'); }
  };

  return (
    <>
      {trackingOrder && <TrackingModal order={trackingOrder} onSave={handleTracking} onCancel={() => setTrackingOrder(null)} />}

      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-serif font-bold text-rose-950">Order Management</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-300" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order / user ID…" className="pl-9 pr-4 py-2 rounded-xl border border-rose-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 w-60" />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${statusFilter === s ? 'bg-rose-900 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}>
              {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-rose-50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-rose-50">
                <tr>
                  {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Tracking', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-rose-700 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-rose-50/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-rose-950">#{order.id.slice(-6)}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[120px] truncate">{order.userId.slice(0, 10)}…</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600">{order.items.length}</td>
                    <td className="px-4 py-3 font-bold text-rose-900">₹{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {order.trackingNumber
                        ? <div className="text-xs"><p className="font-bold">{order.shippingCarrier}</p><p className="text-gray-400">{order.trackingNumber}</p></div>
                        : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button title="View" onClick={() => onNavigate?.(`/order/${order.id}`)} className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-900"><Eye size={15} /></button>
                        <button title="Add/Edit Tracking" onClick={() => setTrackingOrder(order)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600"><Truck size={15} /></button>
                        <button title="Mark Shipped" onClick={() => handleStatus(order.id, 'shipped')} className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-900"><Package size={15} /></button>
                        <button title="Mark Delivered" onClick={() => handleStatus(order.id, 'delivered')} className="p-1.5 hover:bg-green-50 rounded-lg text-gray-400 hover:text-green-600"><CheckCircle size={15} /></button>
                        <button title="Cancel" onClick={() => handleStatus(order.id, 'cancelled')} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"><XCircle size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Package size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── PRODUCTS SECTION ─────────────────────────────────────────────────────────
const ProductsSection: React.FC<{ products: Product[] }> = ({ products }) => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: any) => {
    try {
      if (editing) { await updateProduct(editing.id, data); toast.success('Product updated'); }
      else { await addProduct(data); toast.success('Product added'); }
      setShowForm(false); setEditing(undefined);
    } catch { toast.error('Failed to save product'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Product deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const lowStock = products.filter(p => p.stock < 5);

  return (
    <>
      {showForm && <ProductModal product={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(undefined); }} />}

      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-serif font-bold text-rose-950">Product Inventory</h2>
          <button onClick={() => { setEditing(undefined); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-900 text-white rounded-xl font-bold text-sm hover:bg-rose-800">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {lowStock.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700"><strong>{lowStock.length} products</strong> have low stock (less than 5 units)</p>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-300" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-rose-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" />
        </div>

        <div className="bg-white rounded-2xl border border-rose-50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-rose-50">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-rose-700 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-rose-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-13 object-cover rounded-lg" style={{ height: '52px' }} />
                        <span className="font-bold text-rose-950 max-w-[140px] truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category}</td>
                    <td className="px-4 py-3 font-bold text-rose-900">₹{p.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${p.stock < 5 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs text-gray-600">{p.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.new && <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full">New</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-900"><Edit size={15} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── USERS SECTION ────────────────────────────────────────────────────────────
const UsersSection: React.FC<{ users: UserProfile[] }> = ({ users }) => {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<UserProfile | null>(null);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

  const filtered = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (!search || u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = async (data: Partial<UserProfile>) => {
    if (!editing) return;
    try { await updateUserProfile(editing.uid, data); toast.success('User updated'); setEditing(null); }
    catch { toast.error('Failed to update user'); }
  };

  const handleResetPassword = async (email: string) => {
    try { await sendPasswordResetEmail(auth, email); toast.success(`Password reset email sent to ${email}`); }
    catch { toast.error('Failed to send reset email'); }
  };

  return (
    <>
      {editing && (
        <EditUserModal
          user={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          onResetPassword={handleResetPassword}
        />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-serif font-bold text-rose-950">User Database</h2>
            <p className="text-sm text-gray-500 mt-0.5">{users.length} registered accounts</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: users.length, icon: <Users size={18} /> },
            { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: <Shield size={18} /> },
            { label: 'Customers', value: users.filter(u => u.role === 'user').length, icon: <UserCheck size={18} /> },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-rose-50 p-5 shadow-sm flex items-center gap-4">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-700">{s.icon}</div>
              <div>
                <p className="text-xl font-bold text-rose-950">{s.value}</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-gray-300" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-rose-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" />
          </div>
          <div className="flex gap-2">
            {(['all', 'admin', 'user'] as const).map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize ${roleFilter === r ? 'bg-rose-900 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-rose-50">
                <tr>
                  {['User', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-rose-700 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {filtered.map(u => (
                  <tr key={u.uid} className="hover:bg-rose-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName || 'U'}&background=fdf2f2&color=9f1239`}
                          alt=""
                          className="w-8 h-8 rounded-full border border-rose-100"
                        />
                        <span className="font-bold text-rose-950">{u.displayName || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.phoneNumber || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-rose-50 text-rose-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setEditing(u)} className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-900"><Edit size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Users size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── DESIGN STUDIO ────────────────────────────────────────────────────────────
const DesignStudio: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>(loadLocalConfig());
  const [saving, setSaving] = useState(false);
  const [designTab, setDesignTab] = useState<'hero' | 'announcement' | 'theme' | 'layout' | 'footer'>('hero');

  const update = (k: keyof SiteConfig, v: any) => setConfig(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try { await updateSiteConfig(config); toast.success('Site design saved! Refresh to see changes.'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const themes: Array<{ id: SiteConfig['colorScheme']; label: string; preview: string }> = [
    { id: 'rose', label: 'Rose Boutique', preview: '#9f1239' },
    { id: 'purple', label: 'Royal Purple', preview: '#7c3aed' },
    { id: 'amber', label: 'Golden Amber', preview: '#b45309' },
    { id: 'emerald', label: 'Emerald Silk', preview: '#065f46' },
  ];

  const designTabs = [
    { id: 'hero' as const, label: 'Hero Banner', icon: <Monitor size={16} /> },
    { id: 'announcement' as const, label: 'Announcement', icon: <Megaphone size={16} /> },
    { id: 'theme' as const, label: 'Color Theme', icon: <Palette size={16} /> },
    { id: 'layout' as const, label: 'Layout', icon: <Layers size={16} /> },
    { id: 'footer' as const, label: 'Footer', icon: <Type size={16} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-serif font-bold text-rose-950">Design Studio</h2>
          <p className="text-sm text-gray-500 mt-0.5">Customize your site appearance — plug & play</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-900 text-white rounded-xl font-bold text-sm hover:bg-rose-800 disabled:opacity-60">
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          Save & Publish
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {designTabs.map(tab => (
          <button key={tab.id} onClick={() => setDesignTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${designTab === tab.id ? 'bg-rose-900 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Controls */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-rose-100 p-6 shadow-sm space-y-5">
          {designTab === 'hero' && (
            <>
              <h3 className="font-bold text-rose-950 flex items-center gap-2"><Monitor size={18} /> Hero Banner</h3>
              <div className="space-y-4">
                <div>
                  <Label>Hero Image URL</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-3 text-gray-300" size={15} />
                      <input value={config.heroImage} onChange={e => update('heroImage', e.target.value)} className="w-full pl-9 pr-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" placeholder="https://..." />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Headline Text</Label>
                  <input value={config.heroTitle} onChange={e => update('heroTitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" />
                </div>
                <div>
                  <Label>Subheading</Label>
                  <textarea value={config.heroSubtitle} onChange={e => update('heroSubtitle', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm resize-none" />
                </div>
                <div>
                  <Label>CTA Button Text</Label>
                  <input value={config.heroCTA} onChange={e => update('heroCTA', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" />
                </div>
                <div>
                  <Label>Logo / Brand Name</Label>
                  <input value={config.logoText} onChange={e => update('logoText', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" />
                </div>
              </div>
            </>
          )}

          {designTab === 'announcement' && (
            <>
              <h3 className="font-bold text-rose-950 flex items-center gap-2"><Megaphone size={18} /> Announcement Banner</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl">
                  <div>
                    <p className="font-bold text-rose-950 text-sm">Announcement Bar</p>
                    <p className="text-xs text-gray-500">Displays a banner at the top of the site</p>
                  </div>
                  <button onClick={() => update('announcementEnabled', !config.announcementEnabled)}
                    className={`transition-colors ${config.announcementEnabled ? 'text-rose-900' : 'text-gray-300'}`}>
                    {config.announcementEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>
                <div>
                  <Label>Announcement Text</Label>
                  <input
                    value={config.announcementText}
                    onChange={e => update('announcementText', e.target.value)}
                    disabled={!config.announcementEnabled}
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="e.g. 🎉 Free shipping on orders above ₹1,000!"
                  />
                </div>
                {config.announcementEnabled && (
                  <div className="p-3 bg-rose-900 text-white text-sm text-center rounded-xl font-medium">
                    {config.announcementText || 'Your announcement will appear here'}
                  </div>
                )}
              </div>
            </>
          )}

          {designTab === 'theme' && (
            <>
              <h3 className="font-bold text-rose-950 flex items-center gap-2"><Palette size={18} /> Color Theme</h3>
              <div className="grid grid-cols-2 gap-4">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => update('colorScheme', theme.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${config.colorScheme === theme.id ? 'border-rose-900 shadow-md' : 'border-rose-50 hover:border-rose-200'}`}
                  >
                    <div className="w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: theme.preview }} />
                    <div>
                      <p className="font-bold text-rose-950 text-sm">{theme.label}</p>
                      {config.colorScheme === theme.id && <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-0.5">Active</p>}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">Color theme changes the primary accent color across the entire site.</p>
            </>
          )}

          {designTab === 'layout' && (
            <>
              <h3 className="font-bold text-rose-950 flex items-center gap-2"><Layers size={18} /> Layout Controls</h3>
              <div className="space-y-4">
                {[
                  { key: 'showNewArrivals' as const, label: 'New Arrivals Section', desc: 'Show "New Arrivals" grid on the homepage' },
                  { key: 'showFeatured' as const, label: 'Featured Products', desc: 'Show featured products section on homepage' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-rose-50/60 rounded-xl">
                    <div>
                      <p className="font-bold text-rose-950 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button onClick={() => update(item.key, !(config[item.key] as boolean))}
                      className={`transition-colors ${config[item.key] ? 'text-rose-900' : 'text-gray-300'}`}>
                      {config[item.key] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {designTab === 'footer' && (
            <>
              <h3 className="font-bold text-rose-950 flex items-center gap-2"><Type size={18} /> Footer Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label>Footer Tagline</Label>
                  <textarea value={config.footerTagline} onChange={e => update('footerTagline', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm resize-none" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-sm">
            <div className="p-3 bg-rose-50 border-b border-rose-100 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-400 font-medium mx-auto">Live Preview</span>
            </div>

            {/* Mini site preview */}
            <div className="text-[10px] overflow-hidden">
              {/* Nav */}
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100">
                <span className="font-bold text-rose-950" style={{ fontSize: '9px' }}>{config.logoText}</span>
                <div className="flex gap-2 text-gray-400" style={{ fontSize: '8px' }}>Home Shop Contact</div>
              </div>

              {/* Announcement */}
              {config.announcementEnabled && (
                <div className="bg-rose-900 text-white text-center py-1 px-2 truncate" style={{ fontSize: '8px' }}>
                  {config.announcementText}
                </div>
              )}

              {/* Hero */}
              <div className="relative h-24 overflow-hidden bg-rose-900">
                {config.heroImage && (
                  <img src={config.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover object-top opacity-60" />
                )}
                <div className="absolute inset-0 flex flex-col justify-center px-3">
                  <p className="font-bold text-white truncate" style={{ fontSize: '9px' }}>{config.heroTitle}</p>
                  <p className="text-rose-200 line-clamp-2 leading-tight mt-0.5" style={{ fontSize: '7px' }}>{config.heroSubtitle}</p>
                  <div className="mt-1.5 inline-flex">
                    <span className="bg-white text-rose-900 rounded px-1.5 py-0.5 font-bold" style={{ fontSize: '7px' }}>{config.heroCTA}</span>
                  </div>
                </div>
              </div>

              {/* Sections toggle */}
              <div className="px-3 py-2 space-y-1.5">
                {config.showNewArrivals && (
                  <div>
                    <p className="font-bold text-rose-950 mb-1" style={{ fontSize: '8px' }}>New Arrivals</p>
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3].map(i => <div key={i} className="h-8 bg-rose-50 rounded" />)}
                    </div>
                  </div>
                )}
                {config.showFeatured && (
                  <div>
                    <p className="font-bold text-rose-950 mb-1" style={{ fontSize: '8px' }}>Featured</p>
                    <div className="grid grid-cols-2 gap-1">
                      {[1, 2].map(i => <div key={i} className="h-6 bg-rose-50 rounded" />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer preview */}
              <div className="bg-rose-950 px-3 py-2">
                <p className="font-bold text-white" style={{ fontSize: '8px' }}>{config.logoText}</p>
                <p className="text-rose-300 line-clamp-2 mt-0.5" style={{ fontSize: '7px' }}>{config.footerTagline}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-1">Tip</p>
            <p className="text-xs text-amber-600">Click "Save & Publish" to apply changes. Visitors will see updated design on next page load.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SETTINGS SECTION ─────────────────────────────────────────────────────────
const SettingsSection: React.FC<{ user: any; profile: any }> = ({ user, profile }) => {
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleProfileSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { displayName });
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPw(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPw);
      toast.success('Password changed successfully');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (e: any) {
      toast.error(e.code === 'auth/wrong-password' ? 'Current password is incorrect' : 'Failed to change password');
    } finally { setChangingPw(false); }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset email sent to your inbox');
    } catch { toast.error('Failed to send reset email'); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-serif font-bold text-rose-950">Account Settings</h2>

      {/* Admin Profile */}
      <div className="bg-white rounded-2xl border border-rose-50 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-700"><Shield size={20} /></div>
          <h3 className="font-bold text-rose-950">Admin Profile</h3>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'Admin'}&background=fdf2f2&color=9f1239`}
            alt=""
            className="w-16 h-16 rounded-full border-2 border-rose-100"
          />
          <div>
            <p className="font-bold text-rose-950">{profile?.displayName || 'Admin'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full uppercase tracking-widest">Administrator</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Display Name</Label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" />
          </div>
          <div>
            <Label>Email Address</Label>
            <input value={user?.email || ''} disabled className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed" />
          </div>
        </div>
        <button onClick={handleProfileSave} disabled={saving}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-rose-900 text-white rounded-xl font-bold text-sm hover:bg-rose-800 disabled:opacity-60">
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          Save Profile
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-rose-50 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-700"><KeyRound size={20} /></div>
          <div>
            <h3 className="font-bold text-rose-950">Change Password</h3>
            <p className="text-xs text-gray-400 mt-0.5">Only available for email/password accounts</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" placeholder="••••••••" />
          </div>
          <div>
            <Label>New Password</Label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" placeholder="••••••••" />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm" placeholder="••••••••" />
          </div>
          {newPw && confirmPw && newPw !== confirmPw && (
            <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={handlePasswordChange} disabled={changingPw || !currentPw || !newPw || newPw !== confirmPw}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-900 text-white rounded-xl font-bold text-sm hover:bg-rose-800 disabled:opacity-50">
            {changingPw ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
            Update Password
          </button>
          <button onClick={handlePasswordReset}
            className="flex items-center gap-2 px-5 py-2.5 border border-rose-100 text-rose-700 rounded-xl font-bold text-sm hover:bg-rose-50">
            <Mail size={16} /> Email Reset Link
          </button>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-white rounded-2xl border border-rose-50 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-700"><Bell size={20} /></div>
          <h3 className="font-bold text-rose-950">Session Info</h3>
        </div>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Auth Provider', value: user?.providerData?.[0]?.providerId || 'N/A' },
            { label: 'Email Verified', value: user?.emailVerified ? '✅ Verified' : '❌ Not verified' },
            { label: 'UID', value: user?.uid?.slice(0, 20) + '…' },
            { label: 'Last Sign-in', value: user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A' },
          ].map(row => (
            <div key={row.label} className="flex justify-between py-2 border-b border-rose-50 last:border-0">
              <span className="text-gray-500">{row.label}</span>
              <span className="font-medium text-rose-950">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ADMIN DASHBOARD ─────────────────────────────────────────────────────
interface AdminDashboardProps {
  onNavigate?: (path: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { allOrders, allUsers, loading } = useAdmin();
  const { products } = useProducts();
  const { user, profile, logout } = useAuth();
  const [section, setSection] = useState<Section>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-rose-900 font-bold text-xs uppercase tracking-widest">Loading Admin Panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-rose-50/20">
      <Sidebar
        active={section}
        onSelect={setSection}
        user={user}
        profile={profile}
        logout={logout}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {section === 'overview' && (
                <OverviewSection orders={allOrders} products={products} users={allUsers} onNavigate={setSection} />
              )}
              {section === 'orders' && (
                <OrdersSection orders={allOrders} onNavigate={onNavigate} />
              )}
              {section === 'products' && (
                <ProductsSection products={products} />
              )}
              {section === 'users' && (
                <UsersSection users={allUsers} />
              )}
              {section === 'design' && (
                <DesignStudio />
              )}
              {section === 'settings' && (
                <SettingsSection user={user} profile={profile} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
