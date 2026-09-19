import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Star, 
  MapPin, 
  Heart,
  Eye
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    cms, 
    settings, 
    categories, 
    products, 
    testimonials, 
    setRoute, 
    setSelectedCategory, 
    setSelectedProductId, 
    addToCart 
  } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured && p.status !== 'hidden').slice(0, 8);
  const activeCategories = categories.filter(c => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  const activeTestimonials = testimonials.filter(t => t.isActive);

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-emerald-50/30 to-white pt-8 pb-16 lg:py-20 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-emerald-100/90 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{cms.hero?.badge || '100% Direct From Local Growers'}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {cms.hero?.title || 'Fresh vegetables delivered to your doorstep,'}{' '}
                <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">
                  {cms.hero?.highlightTitle || 'directly from the farm.'}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                {cms.hero?.subtitle || 'Harvested before sunrise, hydro-cleansed with pure water, and brought to your kitchen in recyclable eco-crates in under 3 hours.'}
              </p>

              {/* CTAs & Guarantee */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setRoute('products');
                  }}
                  className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all text-base cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{cms.hero?.ctaPrimary || 'Shop Farm Vegetables'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setRoute('about')}
                  className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl font-semibold transition-colors text-base"
                >
                  <span>{cms.hero?.ctaSecondary || 'Our Farm Story'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-emerald-100 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Pesticide Spray</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Same-Day Harvest</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Plastic-Free Crate Packaging</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl blur-xl opacity-20 transform -rotate-1"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-emerald-100">
                  <img
                    src={cms.hero?.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80'}
                    alt="Fresh harvested vegetables"
                    className="w-full h-80 sm:h-96 object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Today's Morning Batch</p>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">Picked: 4:30 AM • Ready for Dispatch</h4>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      In 3 Hours
                    </span>
                  </div>
                </div>

                {/* Floating Farm Stat Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-emerald-100 hidden sm:flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                    <i className="fa-solid fa-truck-ramp-box"></i>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-slate-900">{cms.hero?.statNumber || '3 Hours'}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{cms.hero?.statLabel || 'Farm harvest to kitchen'}</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-layer-group"></i>
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Explore Farm Categories
            </h2>
          </div>
          <button
            onClick={() => setRoute('categories')}
            className="text-emerald-700 hover:text-emerald-800 font-bold text-sm flex items-center space-x-1 group"
          >
            <span>View All ({categories.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setRoute('products');
              }}
              className="group bg-white rounded-2xl p-4 text-center border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-slate-100 group-hover:border-emerald-500 transition-colors shadow-xs">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {products.filter(p => p.categoryId === cat.id && p.status !== 'hidden').length} Items
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct From Harvest</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Today's Featured Farm Harvest
            </h2>
            <p className="text-sm text-slate-500 mt-1">Hand-selected produce with optimal crispness and mineral content.</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setRoute('products');
            }}
            className="self-start sm:self-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-200 transition-colors flex items-center space-x-1.5"
          >
            <span>Browse All {products.length} Produce</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const isOutOfStock = product.status === 'out_of_stock';
            const category = categories.find(c => c.id === product.categoryId);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Top Badges */}
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

                    {/* Stock Status Badge */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Quick View Button */}
                    <button
                      onClick={() => setSelectedProductId(product.id)}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                      title="Quick Details"
                    >
                      <Eye className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-emerald-700">{category?.name || 'Fresh Vegetable'}</span>
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

                {/* Bottom Price & Add to Cart */}
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
                    <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE VEGBOX (CMS Managed) */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
              The VegBox Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
              Why Customers Love VegBox
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              We cut out wholesale holding yards and synthetic preservatives so your family eats food as nature intended.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cms.whyChooseUs?.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl mb-4">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (CMS Managed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
            Transparent Logistics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            How Farm-To-Home Works
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            From the morning dew in the field straight to your kitchen table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {cms.howItWorks?.map((step) => (
            <div
              key={step.step}
              className="bg-white rounded-2xl p-6 border border-slate-200 relative flex flex-col items-center text-center shadow-xs"
            >
              <span className="absolute -top-3.5 bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shadow-md">
                {step.step}
              </span>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl my-3">
                <i className={`fa-solid ${step.icon}`}></i>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FARM TO HOME STORY SECTION (CMS Managed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
              <span className="inline-block px-3 py-1 bg-emerald-800 text-emerald-300 text-xs font-bold rounded-full">
                {cms.farmToHome?.badge || 'Direct Agro Alliance'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                {cms.farmToHome?.title || 'From soil to your skillet in less than 6 hours.'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                {cms.farmToHome?.content}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-800">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">{cms.farmToHome?.farmersCount || '120+ Partner Growers'}</p>
                  <p className="text-xs text-emerald-300 mt-0.5">Fair trade guaranteed compensation</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">{cms.farmToHome?.freshnessGuarantee || '100% Quality Assurance'}</p>
                  <p className="text-xs text-emerald-300 mt-0.5">Instant credit if not 100% satisfied</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setRoute('about')}
                  className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-colors"
                >
                  Read Our Farmer Mission
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 lg:h-full min-h-[320px] relative">
              <img
                src={cms.farmToHome?.image || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80'}
                alt="Farmer picking fresh produce"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS (From Data Layer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
            Verified Customer Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Real Stories From Kitchen Tables
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Over 8,500 families make VegBox their morning ritual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{testimonial.review}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 mt-4 border-t border-slate-100">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-[11px] text-emerald-700 font-medium">{testimonial.location}</p>
                  {testimonial.role && (
                    <p className="text-[10px] text-slate-400">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Free Delivery Promo
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Get 100% Free Doorstep Delivery Over {settings.currencySymbol}{settings.freeDeliveryThreshold}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100">
              No subscription fees, no locked-in contracts. Just pure, farm-fresh vegetables whenever you desire.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setRoute('products');
            }}
            className="shrink-0 bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-7 py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 text-sm cursor-pointer"
          >
            Start Your First Basket
          </button>
        </div>
      </section>

    </div>
  );
};
