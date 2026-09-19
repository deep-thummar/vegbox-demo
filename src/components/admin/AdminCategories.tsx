import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit3, Trash2, X, FolderTree } from 'lucide-react';
import { Category } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, showToast } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [icon, setIcon] = useState('fa-leaf');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80');
    setIcon('fa-seedling');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setIcon(cat.icon || 'fa-leaf');
    setDisplayOrder(cat.displayOrder);
    setIsActive(cat.isActive);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please provide a category name', 'warning');
      return;
    }

    const generatedSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: name.trim(),
        slug: editingCategory.slug || generatedSlug,
        description: description.trim(),
        image: image.trim(),
        icon: icon.trim(),
        displayOrder: Number(displayOrder),
        isActive,
      });
    } else {
      addCategory({
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        image: image.trim(),
        icon: icon.trim(),
        displayOrder: Number(displayOrder),
        isActive,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, catName: string) => {
    const attachedProducts = products.filter(p => p.categoryId === id);
    if (attachedProducts.length > 0) {
      showToast(`Cannot delete category "${catName}" because it has ${attachedProducts.length} vegetables attached.`, 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${catName}"?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Categories Management</h2>
          <p className="text-xs text-slate-500">
            Structure your farm catalogue, reorder displays, and group vegetables.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const catProducts = products.filter(p => p.categoryId === cat.id);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-slate-800">
                    Order #{cat.displayOrder}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold">
                    <i className={`fa-solid ${cat.icon || 'fa-leaf'}`}></i>
                    <span>{catProducts.length} Vegetables Assigned</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">ID: {cat.id}</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
              {editingCategory ? 'Edit Category' : 'Create Farm Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fresh Leafy Greens"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for customer preview..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Icon (FontAwesome)</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="fa-leaf"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-700">Active (Visible on Customer Storefront)</span>
                </label>
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
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
