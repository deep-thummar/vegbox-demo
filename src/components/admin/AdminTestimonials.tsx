import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit3, Trash2, X, Star } from 'lucide-react';
import { Testimonial } from '../../types';

export const AdminTestimonials: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, showToast } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('Home Chef');
  const [location, setLocation] = useState('Baner, Pune');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setName('');
    setRole('Farm Advocate & Mom');
    setLocation('Koregaon Park, Pune');
    setAvatar('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80');
    setRating(5);
    setReview('');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setName(t.name);
    setRole(t.role || '');
    setLocation(t.location);
    setAvatar(t.avatar);
    setRating(t.rating);
    setReview(t.review);
    setIsActive(t.isActive);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) {
      showToast('Please fill in name and review content.', 'warning');
      return;
    }

    if (editingTestimonial) {
      updateTestimonial({
        ...editingTestimonial,
        name: name.trim(),
        role: role.trim() || undefined,
        location: location.trim(),
        avatar: avatar.trim(),
        rating,
        review: review.trim(),
        isActive,
      });
    } else {
      addTestimonial({
        name: name.trim(),
        role: role.trim() || undefined,
        location: location.trim(),
        avatar: avatar.trim(),
        rating,
        review: review.trim(),
        isActive,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, author: string) => {
    if (window.confirm(`Delete review from "${author}"?`)) {
      deleteTestimonial(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Customer Testimonials & Social Proof</h2>
          <p className="text-xs text-slate-500">
            Control the verified customer quotes displayed on the storefront home page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {item.isActive ? 'Active on Home' : 'Hidden'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{item.review}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2.5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[10px] text-emerald-700 font-medium">{item.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
              {editingTestimonial ? 'Edit Testimonial' : 'Add Customer Testimonial'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Persona</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Nutritionist"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location / Area</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Koregaon Park"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Good)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Review Statement *</label>
                <textarea
                  required
                  rows={3}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="What did this customer say about crispness, delivery and taste?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                ></textarea>
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-700">Display Live on Customer Homepage</span>
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
                  {editingTestimonial ? 'Save Changes' : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
