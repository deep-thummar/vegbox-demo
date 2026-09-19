import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, products, setSelectedCategory, setRoute } = useStore();

  const activeCategories = categories.filter(c => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Farm Harvest Sections</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Vegetable Categories</h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Browse our curated categories, from crispy daily greens and root staples to exotic pesticide-free herbs and crunchy salad greens.
          </p>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCategories.map((cat) => {
          const categoryProducts = products.filter(p => p.categoryId === cat.id && p.status !== 'hidden');
          const inStockCount = categoryProducts.filter(p => p.status === 'available').length;

          return (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setRoute('products');
              }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                    <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {categoryProducts.length} Varieties Available
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                    <i className={`fa-solid ${cat.icon || 'fa-leaf'}`}></i>
                    <span>Category #{cat.displayOrder}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>{inStockCount} Harvested Today</span>
                <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore Produce</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
