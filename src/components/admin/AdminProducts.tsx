import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Star, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Leaf,
  Sparkles
} from 'lucide-react';
import { Product, ProductUnit, ProductStatus } from '../../types';

export const AdminProducts: React.FC = () => {
  const { 
    products, 
    categories, 
    settings, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    showToast 
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState(60);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(75);
  const [formUnit, setFormUnit] = useState<ProductUnit>('500g');
  const [formStatus, setFormStatus] = useState<ProductStatus>('available');
  const [formIsOrganic, setFormIsOrganic] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formFarmOrigin, setFormFarmOrigin] = useState('Green Horizon Organic Farm, Pune');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
  const [formTags, setFormTags] = useState('Morning Fresh, Organic');
  const [formHighlights, setFormHighlights] = useState('Rich in Iron, High Fiber, 100% Pesticide Free');

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || 'cat-greens');
    setFormDescription('');
    setFormPrice(60);
    setFormOriginalPrice(75);
    setFormUnit('500g');
    setFormStatus('available');
    setFormIsOrganic(true);
    setFormIsFeatured(false);
    setFormFarmOrigin('Green Horizon Organic Farm, Pune');
    setFormImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
    setFormTags('Farm Fresh, Direct Harvest');
    setFormHighlights('Vitamin C, Zero Chemical Spray');
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategoryId(product.categoryId);
    setFormDescription(product.description);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormUnit(product.unit);
    setFormStatus(product.status);
    setFormIsOrganic(product.isOrganic);
    setFormIsFeatured(product.isFeatured);
    setFormFarmOrigin(product.farmOrigin);
    setFormImage(product.image);
    setFormTags(product.tags?.join(', ') || '');
    setFormHighlights(product.nutritionHighlights?.join(', ') || '');
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formCategoryId || !formDescription.trim()) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const highlightsArray = formHighlights
      .split(',')
      .map(h => h.trim())
      .filter(Boolean);

    const generatedSlug = formName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formName.trim(),
        slug: editingProduct.slug || generatedSlug,
        stock: editingProduct.stock || 50,
        categoryId: formCategoryId,
        description: formDescription.trim(),
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        unit: formUnit,
        status: formStatus,
        isOrganic: formIsOrganic,
        isFeatured: formIsFeatured,
        farmOrigin: formFarmOrigin.trim(),
        image: formImage.trim(),
        tags: tagsArray,
        nutritionHighlights: highlightsArray,
      });
    } else {
      addProduct({
        name: formName.trim(),
        slug: generatedSlug,
        stock: 50,
        categoryId: formCategoryId,
        description: formDescription.trim(),
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        unit: formUnit,
        status: formStatus,
        isOrganic: formIsOrganic,
        isFeatured: formIsFeatured,
        farmOrigin: formFarmOrigin.trim(),
        image: formImage.trim(),
        rating: 4.8,
        reviewsCount: 12,
        tags: tagsArray,
        nutritionHighlights: highlightsArray,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
      deleteProduct(id);
    }
  };

  // Filtered Products
  const filtered = products.filter(p => {
    if (filterCategory !== 'all' && p.categoryId !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.farmOrigin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Products Catalog Management</h2>
          <p className="text-xs text-slate-500">
            Control harvest inventory, pricing, packaging units, and organic certification tags.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vegetable</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search produce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs text-slate-500 font-semibold shrink-0">Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-4">Vegetable</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Unit</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4">Farm Origin</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => {
                const category = categories.find(c => c.id === product.categoryId);

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{product.name}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{product.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {category?.name || 'Unassigned'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">
                        {settings.currencySymbol}{product.price}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium"> / {product.unit}</span>
                      {product.originalPrice && (
                        <p className="text-[10px] text-slate-400 line-through">
                          {settings.currencySymbol}{product.originalPrice}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        product.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : product.status === 'out_of_stock'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {product.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isOrganic && (
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                            Organic
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-200">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-600 max-w-xs truncate">
                      {product.farmOrigin}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Produce"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
              {editingProduct ? 'Edit Vegetable Produce' : 'Add New Farm Vegetable'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Produce Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Organic Baby Spinach (Palak)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Packaging Unit *</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as ProductUnit)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  >
                    <option value="250g">250g</option>
                    <option value="500g">500g</option>
                    <option value="1kg">1kg</option>
                    <option value="2kg">2kg</option>
                    <option value="bunch">bunch</option>
                    <option value="pack">pack</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ({settings.currencySymbol}) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (Strikeout)</label>
                  <input
                    type="number"
                    min="1"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 80"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inventory Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ProductStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  >
                    <option value="available">Available / In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="hidden">Hidden / Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Farm Origin / Grower</label>
                  <input
                    type="text"
                    value={formFarmOrigin}
                    onChange={(e) => setFormFarmOrigin(e.target.value)}
                    placeholder="e.g. Green Horizon Agro, Pune"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Freshness details, taste profile, and harvest notes..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nutrition Highlights (Comma Separated)</label>
                  <input
                    type="text"
                    value={formHighlights}
                    onChange={(e) => setFormHighlights(e.target.value)}
                    placeholder="e.g. High Fiber, Vitamin A, Zero Chemicals"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsOrganic}
                      onChange={(e) => setFormIsOrganic(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-700">100% Certified Organic</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-700">Display on Homepage (Featured)</span>
                  </label>
                </div>

              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
