import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, MapPin, Package, Heart, LogOut, ChevronRight, Star, Clock, CheckCircle, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useOrders } from '../components/OrderContext';
import { useWishlist } from '../components/WishlistContext';
import { Order, Address } from '../types';
import { updateUserProfile } from '../services/userService';
import AuthModal from '../components/AuthModal';
import toast from 'react-hot-toast';

interface UserDashboardProps {
  onNavigate: (path: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { user, profile, logout } = useAuth();
  const { userOrders, loading: ordersLoading } = useOrders();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('orders');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhoneNumber(profile.phoneNumber || '');
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (e) {
      toast.error('Failed to logout');
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        phoneNumber
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user || !profile) return;
    const address: Address = {
      ...newAddress as Address,
      id: Math.random().toString(36).substr(2, 9),
    };

    const currentAddresses = profile.addresses || [];
    const updatedAddresses = address.isDefault 
      ? [...currentAddresses.map(a => ({ ...a, isDefault: false })), address]
      : [...currentAddresses, address];

    try {
      await updateUserProfile(user.uid, { addresses: updatedAddresses });
      toast.success('Address added successfully');
      setIsAddingAddress(false);
      setNewAddress({ label: '', street: '', city: '', state: '', zip: '', isDefault: false });
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user || !profile) return;
    const updatedAddresses = (profile.addresses || []).filter(a => a.id !== id);
    try {
      await updateUserProfile(user.uid, { addresses: updatedAddresses });
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!user || !profile) return;
    const updatedAddresses = (profile.addresses || []).map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    try {
      await updateUserProfile(user.uid, { addresses: updatedAddresses });
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-rose-50/30">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6 text-rose-300">
          <User size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-rose-950 mb-4">Your Private Sanctuary</h2>
        <p className="text-gray-500 max-w-md mb-8">Please sign in to access your orders, wishlist, and personalized style profile.</p>
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="px-10 py-4 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all shadow-xl hover:shadow-rose-200"
        >
          Sign In Now
        </button>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-rose-50 p-8 sticky top-24">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="relative mb-6">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=fdf2f2&color=9f1239`} 
                  alt={user.displayName || ''} 
                  className="w-24 h-24 rounded-full border-4 border-rose-50 shadow-sm"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-serif font-bold text-rose-950 mb-1">{profile?.displayName || user.displayName}</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{profile?.role || 'Valued Member'}</p>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-rose-900 text-white shadow-lg' : 'hover:bg-rose-50 text-rose-900'}`}
              >
                <div className="flex items-center gap-3">
                  <Package size={18} />
                  <span className="text-sm font-bold">My Orders</span>
                </div>
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'wishlist' ? 'bg-rose-900 text-white shadow-lg' : 'hover:bg-rose-50 text-rose-900'}`}
              >
                <div className="flex items-center gap-3">
                  <Heart size={18} />
                  <span className="text-sm font-bold">Wishlist</span>
                </div>
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-rose-900 text-white shadow-lg' : 'hover:bg-rose-50 text-rose-900'}`}
              >
                <div className="flex items-center gap-3">
                  <User size={18} />
                  <span className="text-sm font-bold">Profile Settings</span>
                </div>
                <ChevronRight size={16} />
              </button>
              <div className="pt-6 mt-6 border-t border-rose-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl text-rose-900 hover:bg-rose-50 transition-all"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-bold">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                  <h2 className="text-3xl font-serif font-bold text-rose-950">Order History</h2>
                  <p className="text-sm text-gray-500 font-medium">{userOrders.length} total orders</p>
                </div>

                {ordersLoading ? (
                  <div className="p-24 text-center text-rose-300 font-bold uppercase tracking-widest">Fetching your treasures...</div>
                ) : userOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border border-rose-50 shadow-sm">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-200">
                      <ShoppingBag size={40} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-rose-950 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-8">Your journey with us is just beginning. Start exploring our collections.</p>
                    <button className="px-8 py-3 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-3xl border border-rose-50 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="p-6 bg-rose-50/50 flex flex-wrap justify-between items-center gap-4 border-b border-rose-50">
                          <div className="flex gap-8">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                              <p className="text-sm font-bold text-rose-950">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                              <p className="text-sm font-bold text-rose-900">₹{order.total.toLocaleString()}</p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                              <p className="text-sm font-bold text-rose-950">#{order.id.slice(-8)}</p>
                            </div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {order.status === 'delivered' ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {order.status}
                          </div>
                        </div>
                        <div className="p-6">
                          {/* Tracking Progress Bar */}
                          {order.status !== 'cancelled' && (
                            <div className="mb-8 px-4">
                              <div className="relative h-1.5 bg-rose-50 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: order.status === 'delivered' ? '100%' :
                                           order.status === 'shipped' ? '66%' : '33%' 
                                  }}
                                  className={`absolute top-0 left-0 h-full transition-all duration-1000 ${
                                    order.status === 'delivered' ? 'bg-emerald-500' :
                                    order.status === 'shipped' ? 'bg-blue-500' :
                                    'bg-amber-500'
                                  }`}
                                />
                              </div>
                              <div className="flex justify-between mt-3">
                                <div className="text-center">
                                  <p className={`text-[9px] font-bold uppercase tracking-widest ${order.status === 'pending' || order.status === 'shipped' || order.status === 'delivered' ? 'text-rose-900' : 'text-gray-300'}`}>Pending</p>
                                </div>
                                <div className="text-center">
                                  <p className={`text-[9px] font-bold uppercase tracking-widest ${order.status === 'shipped' || order.status === 'delivered' ? 'text-rose-900' : 'text-gray-300'}`}>Shipped</p>
                                </div>
                                <div className="text-center">
                                  <p className={`text-[9px] font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'text-rose-900' : 'text-gray-300'}`}>Delivered</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {order.trackingNumber && (
                            <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                                  <Package size={20} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Tracking Information</p>
                                  <p className="text-sm font-bold text-blue-900">{order.shippingCarrier}: {order.trackingNumber}</p>
                                </div>
                              </div>
                              <a 
                                href={`https://www.google.com/search?q=${order.shippingCarrier}+tracking+${order.trackingNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md"
                              >
                                Track Package
                              </a>
                            </div>
                          )}

                          <div className="space-y-6">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-6">
                                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-xl shadow-sm" />
                                <div className="flex-1">
                                  <h4 className="font-bold text-rose-950 mb-1">{item.name}</h4>
                                  <p className="text-xs text-gray-500 mb-2">Size: {item.selectedSize || item.size} • Color: {item.selectedColor || item.color} • Qty: {item.qty || item.quantity}</p>
                                  <p className="text-sm font-bold text-rose-900">₹{item.price.toLocaleString()}</p>
                                </div>
                                <button className="hidden sm:block px-6 py-2 border border-rose-100 text-rose-900 rounded-full text-xs font-bold hover:bg-rose-50 transition-all">
                                  Write Review
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center mt-8 pt-8 border-t border-rose-50">
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                              <span className="text-2xl font-serif font-bold text-rose-900">₹{order.total.toLocaleString()}</span>
                            </div>
                            <button 
                              onClick={() => onNavigate(`/order/${order.id}`)}
                              className="px-6 py-3 bg-rose-900 text-white rounded-full font-bold text-xs hover:bg-rose-800 transition-all shadow-lg flex items-center gap-2"
                            >
                              View Details
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-serif font-bold text-rose-950">My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border border-rose-50 shadow-sm">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-200">
                      <Heart size={40} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-rose-950 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-8">Save items you love to keep track of them for later.</p>
                    <button className="px-8 py-3 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all">
                      Explore Collections
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlist.map((product) => (
                      <div key={product.id} className="bg-white rounded-3xl border border-rose-50 shadow-sm overflow-hidden group">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="px-6 py-2 bg-white text-rose-950 rounded-full font-bold text-xs shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                              View Product
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold text-rose-950 mb-1">{product.name}</h4>
                          <p className="text-rose-900 font-bold mb-4">₹{product.price.toLocaleString()}</p>
                          <button className="w-full py-3 bg-rose-50 text-rose-900 rounded-xl font-bold text-xs hover:bg-rose-900 hover:text-white transition-all">
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-serif font-bold text-rose-950">Profile Settings</h2>
                <div className="bg-white rounded-3xl border border-rose-50 shadow-sm p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                        <input 
                          type="text" 
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-6 py-4 bg-rose-50/50 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium text-rose-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                        <input 
                          type="email" 
                          defaultValue={user.email || ''} 
                          disabled
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-6 py-4 bg-rose-50/50 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium text-rose-950"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Preferred Language</label>
                        <select className="w-full px-6 py-4 bg-rose-50/50 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium text-rose-950 appearance-none">
                          <option>English</option>
                          <option>Hindi</option>
                          <option>Bengali</option>
                          <option>Urdu</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-rose-50 flex justify-end">
                    <button 
                      onClick={handleUpdateProfile}
                      disabled={isSaving}
                      className="px-10 py-4 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all shadow-xl hover:shadow-rose-200 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-rose-50 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-rose-50 rounded-2xl text-rose-900">
                        <MapPin size={24} />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-rose-950">Shipping Addresses</h3>
                    </div>
                    {!isAddingAddress && (
                      <button 
                        onClick={() => setIsAddingAddress(true)}
                        className="flex items-center gap-2 text-rose-900 font-bold text-sm hover:underline"
                      >
                        <Plus size={18} /> Add New
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isAddingAddress && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 p-8 bg-rose-50/30 rounded-3xl border border-rose-100 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Label (e.g. Home, Office)</label>
                            <input 
                              type="text"
                              value={newAddress.label}
                              onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                              className="w-full px-6 py-4 bg-white border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium text-rose-950"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Street Address</label>
                            <input 
                              type="text"
                              value={newAddress.street}
                              onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                              className="w-full px-6 py-4 bg-white border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium text-rose-950"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">City</label>
                            <input 
                              type="text"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                              className="w-full px-6 py-4 bg-white border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium text-rose-950"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">State</label>
                              <input 
                                type="text"
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                className="w-full px-6 py-4 bg-white border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium text-rose-950"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">ZIP Code</label>
                              <input 
                                type="text"
                                value={newAddress.zip}
                                onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                                className="w-full px-6 py-4 bg-white border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 font-medium text-rose-950"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-8">
                          <input 
                            type="checkbox" 
                            id="isDefault"
                            checked={newAddress.isDefault}
                            onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                            className="w-5 h-5 rounded border-rose-200 text-rose-900 focus:ring-rose-900" 
                          />
                          <label htmlFor="isDefault" className="text-sm font-medium text-rose-950">Set as default address</label>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={handleAddAddress}
                            className="px-8 py-3 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all"
                          >
                            Save Address
                          </button>
                          <button 
                            onClick={() => setIsAddingAddress(false)}
                            className="px-8 py-3 bg-white border border-rose-100 text-rose-900 rounded-full font-bold text-sm hover:bg-rose-50 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(profile.addresses || []).map((address) => (
                      <div 
                        key={address.id} 
                        className={`p-6 border-2 rounded-3xl relative transition-all ${address.isDefault ? 'border-rose-900 bg-rose-50/10' : 'border-rose-50 hover:border-rose-200'}`}
                      >
                        <div className="absolute top-6 right-6 flex gap-2">
                          {!address.isDefault && (
                            <button 
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="p-2 text-gray-400 hover:text-rose-900 transition-colors"
                              title="Set as default"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete address"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        {address.isDefault && (
                          <p className="text-[10px] font-bold text-rose-900 uppercase tracking-widest mb-2">Default Address</p>
                        )}
                        <p className="font-bold text-rose-950 mb-1">{address.label}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {address.street}<br />
                          {address.city}, {address.state} {address.zip}
                        </p>
                      </div>
                    ))}
                    
                    {!isAddingAddress && (
                      <button 
                        onClick={() => setIsAddingAddress(true)}
                        className="p-6 border-2 border-dashed border-rose-100 rounded-3xl flex flex-col items-center justify-center text-rose-300 hover:border-rose-300 hover:text-rose-500 transition-all group min-h-[160px]"
                      >
                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Plus size={24} />
                        </div>
                        <span className="font-bold text-sm">Add New Address</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
