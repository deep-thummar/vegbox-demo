import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  Star, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Truck, 
  Leaf, 
  Sparkles 
} from 'lucide-react';
import { ProductUnit } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductId, 
    setSelectedProductId, 
    products, 
    categories, 
    settings, 
    addToCart 
  } = useStore();

  const product = products.find(p => p.id === selectedProductId);
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState<ProductUnit | null>(null);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedUnit(product.unit);
    }
  }, [selectedProductId, product]);

  if (!selectedProductId || !product) return null;

  const category = categories.find(c => c.id === product.categoryId);
  const isOutOfStock = product.status === 'out_of_stock';
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id && p.status !== 'hidden')
    .slice(0, 3);

  const availableUnits: ProductUnit[] = [
    product.unit,
    ...(product.unit === '500g' ? ['1kg' as ProductUnit] : []),
    ...(product.unit === '1kg' ? ['2kg' as ProductUnit] : []),
  ];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedUnit || product.unit);
    setSelectedProductId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-slate-500 hover:text-slate-800 p-2 rounded-full shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image & Badges */}
          <div className="relative bg-slate-100 min-h-[300px] md:min-h-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isOrganic && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-md">
                  <Leaf className="w-3.5 h-3.5 mr-1" />
                  100% Organic
                </span>
              )}
              {isOutOfStock && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-600 text-white shadow-md">
                  Out of Stock
                </span>
              )}
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold truncate">{product.farmOrigin}</span>
              </div>
              <span className="text-emerald-700 font-bold">Dawn Harvest</span>
            </div>
          </div>

          {/* Details & Purchase Options */}
          <div className="p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
            
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {category?.name || 'Produce'}
                </span>
                <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {product.name}
              </h2>

              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {settings.currencySymbol}{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {settings.currencySymbol}{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium">per {selectedUnit || product.unit}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {product.description}
            </p>

            {/* Nutrition Highlights */}
            {product.nutritionHighlights && product.nutritionHighlights.length > 0 && (
              <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100 space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farm Nutrition Highlights</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {product.nutritionHighlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Unit Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Choose Packaging Unit:</label>
              <div className="flex flex-wrap gap-2">
                {availableUnits.map((u) => (
                  <button
                    key={u}
                    onClick={() => setSelectedUnit(u)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      (selectedUnit || product.unit) === u
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Quantity:</label>
                <div className="flex items-center space-x-3 bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-lg shadow-emerald-600/25'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isOutOfStock 
                    ? 'Out of Stock' 
                    : `Add to Basket • ${settings.currencySymbol}${product.price * quantity}`}
                </span>
              </button>

              <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3-Hour Dispatch</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Freshness Guarantee</span>
                </span>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Pairs Well In Today's Basket:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {relatedProducts.map(rel => (
                    <button
                      key={rel.id}
                      onClick={() => setSelectedProductId(rel.id)}
                      className="text-left bg-slate-50 hover:bg-emerald-50/50 p-2 rounded-xl border border-slate-200/70 transition-colors group"
                    >
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-14 object-cover rounded-lg mb-1"
                      />
                      <p className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-1">
                        {rel.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold">
                        {settings.currencySymbol}{rel.price}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
