import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Truck, ShieldCheck, CheckCircle, Share2, Heart, ShoppingBag, Play, Eye, X, Save } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../components/CartContext';
import { useWishlist } from '../components/WishlistContext';
import { useProducts } from '../components/ProductContext';
import { getRecommendedProducts, addToRecentlyViewed } from '../services/recommendationService';
import { getProductById as fetchProductFromBackend, subscribeToReviews, addReview } from '../services/productService';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

interface ProductDetailsPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

const Badge = ({ children, color = 'rose' }: { children: React.ReactNode, color?: 'rose' | 'red' }) => (
  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${color === 'red' ? 'bg-red-100 text-red-600' : 'bg-rose-50 text-rose-600'}`}>
    {children}
  </span>
);

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId, onNavigate }) => {
  const { products } = useProducts();
  const { user, profile } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showVideo, setShowVideo] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowVideo(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductFromBackend(productId);
        if (data) {
          setProduct(data);
          setSelectedColor(data.colors[0]);
          addToRecentlyViewed(data.id);
        } else {
          // Fallback to context products (handles mock data)
          const fallbackProduct = products.find(p => p.id === productId);
          if (fallbackProduct) {
            setProduct(fallbackProduct);
            setSelectedColor(fallbackProduct.colors[0]);
            addToRecentlyViewed(fallbackProduct.id);
          } else {
            setProduct(null);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Fallback to context products on error
        const fallbackProduct = products.find(p => p.id === productId);
        if (fallbackProduct) {
          setProduct(fallbackProduct);
          setSelectedColor(fallbackProduct.colors[0]);
          addToRecentlyViewed(fallbackProduct.id);
        } else {
          toast.error("Failed to load product details");
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    const unsubscribe = subscribeToReviews(productId, (data) => {
      setReviews(data);
    });

    return () => unsubscribe();
  }, [productId, products]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      toast.error('Please sign in to leave a review');
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error('Please add a comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addReview(productId, {
        userId: user.uid,
        userName: profile.displayName || user.displayName || 'Anonymous',
        userPhoto: user.photoURL,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      toast.success('Review submitted successfully!');
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-24 bg-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-rose-100 border-t-rose-900 rounded-full mb-4"
        />
        <p className="text-rose-300 font-bold uppercase tracking-widest animate-pulse">Fetching your treasure...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-24 bg-white">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-200">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-rose-950 mb-2">Product not found</h2>
        <p className="text-gray-500 mb-8">The item you're looking for might have been moved or is no longer available.</p>
        <button 
          onClick={() => onNavigate('/shop')}
          className="px-8 py-3 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  const recommendations = getRecommendedProducts(product, products);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch (e) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => onNavigate('/shop')} className="flex items-center text-gray-500 hover:text-rose-900 mb-8 transition-colors font-bold text-sm uppercase tracking-widest">
        <ArrowRight className="rotate-180 mr-2" size={18} /> Back to Collection
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="relative group aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-rose-50">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            {product.video && (
              <button 
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-rose-900 shadow-xl scale-90 group-hover:scale-100 transition-transform duration-500">
                  <Play size={32} fill="currentColor" className="ml-1" />
                </div>
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {showVideo && product.video && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowVideo(false)}
                className="fixed inset-0 bg-rose-950/95 z-[60] flex items-center justify-center p-4 md:p-12 backdrop-blur-md"
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative"
                >
                  <button 
                    onClick={() => setShowVideo(false)} 
                    className="absolute top-4 right-4 text-white/50 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all z-10"
                  >
                    <X size={24} />
                  </button>
                  <video controls autoPlay className="w-full h-full">
                    <source src={product.video} type="video/mp4" />
                  </video>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge>{product.category}</Badge>
              {product.new && <Badge color="red">New Arrival</Badge>}
              <span className={`text-xs font-bold ${product.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                {product.stock < 5 ? `Only ${product.stock} left!` : 'In Stock'}
              </span>
            </div>
            <h1 className="text-5xl font-serif font-bold mb-6 text-rose-950 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-6 mb-8">
              <span className="text-4xl font-bold text-rose-900">₹{product.price.toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={20} fill="currentColor" />
                  <span className="text-gray-900 font-bold">{product.rating}</span>
                </div>
                <span className="text-gray-400 text-sm font-medium">({product.reviews} reviews)</span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
              {product.description}
            </p>
          </div>

          {/* Selectors */}
          <div className="space-y-8 mb-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-rose-900">Available Colors</h3>
              <div className="flex gap-4">
                {product.colors.map(color => (
                  <button 
                    key={color} 
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${selectedColor === color ? 'border-rose-900 scale-110 ring-4 ring-rose-50' : 'border-gray-200 hover:border-rose-200'}`} 
                    style={{ backgroundColor: color.toLowerCase() }} 
                    title={color} 
                  />
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-900">Select Size</h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-rose-600 underline">Size Guide</button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 font-bold transition-all ${selectedSize === size ? 'border-rose-900 bg-rose-900 text-white shadow-lg' : 'border-gray-100 hover:border-rose-900 text-gray-600'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-12">
            <button 
              className={`flex-1 py-4 rounded-full font-bold transition-all shadow-xl flex items-center justify-center gap-2 ${selectedSize ? 'bg-rose-900 text-white hover:bg-rose-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              onClick={() => selectedSize && addToCart(product, selectedSize, selectedColor)}
              disabled={!selectedSize}
            >
              <ShoppingBag size={20} />
              {selectedSize ? 'Add to Bag' : 'Select a Size'}
            </button>
            <button 
              onClick={() => toggleWishlist(product)}
              className={`w-16 h-16 flex items-center justify-center rounded-full border-2 transition-all ${isInWishlist(product.id) ? 'bg-rose-50 border-rose-500 text-rose-500' : 'border-gray-100 text-gray-400 hover:border-rose-900 hover:text-rose-900'}`}
            >
              <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={handleShare}
              className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-gray-100 text-gray-400 hover:border-rose-900 hover:text-rose-900 transition-all"
            >
              <Share2 size={24} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6 border-t border-rose-100 pt-10">
            <div className="text-center">
              <Truck className="mx-auto mb-3 text-rose-400" size={28} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Free Shipping</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="mx-auto mb-3 text-rose-400" size={28} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Quality Check</p>
            </div>
            <div className="text-center">
              <CheckCircle className="mx-auto mb-3 text-rose-400" size={28} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure Pay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-rose-100 pt-24 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-serif font-bold text-rose-950 mb-6">Customer Reviews</h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl font-bold text-rose-900">{product.rating}</div>
              <div>
                <div className="flex text-yellow-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 font-medium">Based on {reviews.length} reviews</p>
              </div>
            </div>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100">
                <h3 className="text-lg font-serif font-bold text-rose-950 mb-6">Share Your Experience</h3>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`p-2 transition-all ${newReview.rating >= star ? 'text-yellow-500 scale-110' : 'text-gray-300 hover:text-yellow-200'}`}
                      >
                        <Star size={24} fill={newReview.rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Your Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 h-32 text-sm"
                    placeholder="What did you love about this product?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-4 bg-rose-900 text-white rounded-full font-bold text-sm hover:bg-rose-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingReview ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100 text-center">
                <p className="text-gray-600 mb-4 font-medium">Please sign in to share your thoughts on this product.</p>
                <button onClick={() => onNavigate('/dashboard')} className="text-rose-900 font-bold underline">Sign In</button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-10">
              {reviews.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium italic">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-rose-50 pb-10 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={review.userPhoto || `https://ui-avatars.com/api/?name=${review.userName}&background=fdf2f2&color=9f1239`} 
                          alt={review.userName} 
                          className="w-12 h-12 rounded-full border-2 border-rose-50"
                        />
                        <div>
                          <h4 className="font-bold text-rose-950">{review.userName}</h4>
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed pl-16">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="border-t border-rose-100 pt-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-rose-950 mb-4">You May Also Love</h2>
              <p className="text-gray-500 font-medium tracking-wide">Handpicked recommendations just for you.</p>
            </div>
            <button onClick={() => onNavigate('/shop')} className="text-rose-900 font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
              View All <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map(p => (
              <div 
                key={p.id} 
                onClick={() => onNavigate(`/product/${p.id}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] bg-rose-50 rounded-3xl overflow-hidden mb-6 relative shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-rose-950/0 group-hover:bg-rose-950/10 transition-colors" />
                </div>
                <h3 className="font-serif font-bold text-rose-950 mb-2 group-hover:text-rose-900 transition-colors">{p.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-rose-900 font-bold">₹{p.price.toLocaleString()}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-gray-900 text-xs font-bold">{p.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
