import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronRight, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../components/ProductContext';
import { Product, Category } from '../types';
import { CATEGORIES } from '../constants';

interface ShopPageProps {
  onNavigate: (path: string) => void;
  initialCategory?: Category | 'All';
  showNewOnly?: boolean;
  pageTitle?: string;
}

const ShopPage: React.FC<ShopPageProps> = ({
  onNavigate,
  initialCategory = 'All',
  showNewOnly = false,
  pageTitle,
}) => {
  const { products, loading } = useProducts();
  const [filter, setFilter] = useState<Category | 'All'>(initialCategory);
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
  }, [products, search]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (showNewOnly) result = result.filter(p => p.new);

    if (filter !== 'All') {
      result = result.filter(p => p.category === filter);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, filter, sort, search, showNewOnly]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-900 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-rose-950 mb-2">{pageTitle || 'Our Collection'}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span> <ChevronRight size={14} /> <span className="text-rose-900 font-bold">{pageTitle || 'Shop'}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or description..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-300 text-sm transition-all bg-white shadow-sm"
            />
            {search && (
              <button 
                onClick={() => {
                  setSearch('');
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 transition-colors"
              >
                <X size={16} />
              </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-rose-50 overflow-hidden z-50">
                {suggestions.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSearch(p.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-rose-50 flex items-center gap-3 transition-colors"
                  >
                    <img src={p.image} alt="" className="w-8 h-10 object-cover rounded shadow-sm" />
                    <div>
                      <p className="text-sm font-bold text-rose-950">{p.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{p.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-4 pr-10 py-3 rounded-2xl border border-rose-100 text-sm focus:outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-300 bg-white shadow-sm font-medium text-gray-700 cursor-pointer transition-all"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400">
              <Filter size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat as Category | 'All')}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${filter === cat ? 'bg-rose-900 text-white shadow-lg' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <Search size={48} className="mx-auto mb-4 text-rose-200" />
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <button onClick={() => {setFilter('All'); setSearch('');}} className="text-rose-900 font-bold underline mt-2">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => onNavigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
