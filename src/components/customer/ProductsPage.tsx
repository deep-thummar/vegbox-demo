import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Star, 
  MapPin, 
  Eye, 
  X, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Product } from '../../types';

export const ProductsPage: React.FC = () => {
  const { 
    products, 
    categories, 
    settings, 
    selectedCategory, 
    setSelectedCategory, 
    setSelectedProductId, 
    addToCart,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(150);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Hide inactive/hidden products
        if (product.status === 'hidden') return false;

        // Category filter
        if (selectedCategory && product.categoryId !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchOrigin = product.farmOrigin.toLowerCase().includes(q);
          const matchTags = product.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchOrigin && !matchTags) return false;
        }

        // In Stock filter
        if (inStockOnly && product.status === 'out_of_stock') {
          return false;
        }

        // Organic filter
        if (organicOnly && !product.isOrganic) {
          return false;
        }

        // Price range
        if (product.price > priceRange) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default: featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, organicOnly, priceRange, sortBy]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Farm Direct Produce
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">
            {activeCategoryObj ? activeCategoryObj.name : 'All Fresh Farm Vegetables'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            {activeCategoryObj 
              ? activeCategoryObj.description 
              : 'Crisp greens, fresh roots, seasonal staples and certified organic produce harvested daily.'}
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        
        {/* Top Controls: Search and Sort */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by vegetable name, farm or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl py-2 pl-9 pr-9 text-xs sm:text-sm outline-hidden"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort and Quick Toggles */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            
            {/* In-Stock Toggle */}
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>In Stock Only</span>
            </label>

            {/* Organic Toggle */}
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Organic Only</span>
            </label>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === null
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Vegetables ({products.filter(p => p.status !== 'hidden').length})
          </button>
          
          {categories.filter(c => c.isActive).map((cat) => {
            const count = products.filter(p => p.categoryId === cat.id && p.status !== 'hidden').length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Bar & Reset */}
        {(selectedCategory || searchQuery || inStockOnly || organicOnly) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700">Showing {filteredProducts.length} results</span>
              {selectedCategory && (
                <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-medium flex items-center space-x-1">
                  <span>Category: {activeCategoryObj?.name}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
                </span>
              )}
              {searchQuery && (
                <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-medium flex items-center space-x-1">
                  <span>Keyword: "{searchQuery}"</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setInStockOnly(false);
                setOrganicOnly(false);
                setSortBy('featured');
              }}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.status === 'out_of_stock';
            const cat = categories.find(c => c.id === product.categoryId);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isOrganic && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                          Organic
                        </span>
                      )}
                      {product.tags?.[0] && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                          {product.tags[0]}
                        </span>
                      )}
                    </div>

                    {/* Stock status overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Quick view button */}
                    <button
                      onClick={() => setSelectedProductId(product.id)}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-emerald-700">{cat?.name}</span>
                      <span className="flex items-center space-x-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedProductId(product.id)}
                      className="text-sm font-bold text-slate-900 hover:text-emerald-700 line-clamp-1 cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 pt-1">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{product.farmOrigin}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Add to Cart */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-lg font-black text-slate-900">
                        {settings.currencySymbol}{product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {settings.currencySymbol}{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">per {product.unit}</span>
                  </div>

                  <button
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product, 1)}
                    className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            <i className="fa-solid fa-seedling"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Vegetables Found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any produce matching your current search or filters. Try adjusting your search query or reset the filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
              setInStockOnly(false);
              setOrganicOnly(false);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            View All Vegetables
          </button>
        </div>
      )}

    </div>
  );
};
