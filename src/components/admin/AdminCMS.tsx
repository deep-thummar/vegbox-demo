import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { CMSContent } from '../../types';

export const AdminCMS: React.FC = () => {
  const { cms, updateCMS, showToast } = useStore();

  const [activeSubtab, setActiveSubtab] = useState<'hero' | 'why' | 'how' | 'farm' | 'about'>('hero');
  const [formData, setFormData] = useState<CMSContent>(JSON.parse(JSON.stringify(cms)));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS(formData);
    showToast('Storefront content updated successfully! Check Customer website to see instant updates.', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Website Content Management (CMS)</h2>
          <p className="text-xs text-slate-500">
            Edit titles, banners, copy, and farm stories without touching code.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes Live</span>
        </button>
      </div>

      {/* Subtab navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'hero', label: '1. Homepage Hero' },
          { id: 'why', label: '2. Why Choose VegBox' },
          { id: 'how', label: '3. How It Works' },
          { id: 'farm', label: '4. Farm-to-Home Story' },
          { id: 'about', label: '5. About Us Page' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubtab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeSubtab === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
        
        {/* HERO SECTION */}
        {activeSubtab === 'hero' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Homepage Hero Section
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pill Badge Text</label>
                <input
                  type="text"
                  value={formData.hero.badge}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, badge: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={formData.hero.ctaPrimary}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, ctaPrimary: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Title (Part 1)</label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Highlighted Title (Green & Underlined)</label>
                <input
                  type="text"
                  value={formData.hero.highlightTitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, highlightTitle: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-semibold text-emerald-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={formData.hero.subtitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Hero Fresh Produce Image URL</label>
                <input
                  type="url"
                  value={formData.hero.image}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, image: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Floating Stat Number</label>
                <input
                  type="text"
                  value={formData.hero.statNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, statNumber: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Floating Stat Label</label>
                <input
                  type="text"
                  value={formData.hero.statLabel}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, statLabel: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* WHY CHOOSE US */}
        {activeSubtab === 'why' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Why Choose VegBox (4 Selling Points)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.whyChooseUs.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800">Benefit #{idx + 1}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{item.icon}</span>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const copy = [...formData.whyChooseUs];
                        copy[idx].title = e.target.value;
                        setFormData({ ...formData, whyChooseUs: copy });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const copy = [...formData.whyChooseUs];
                        copy[idx].description = e.target.value;
                        setFormData({ ...formData, whyChooseUs: copy });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOW IT WORKS */}
        {activeSubtab === 'how' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              How It Works (4 Steps)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.howItWorks.map((step, idx) => (
                <div key={step.step} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-emerald-800">Step {step.step}</span>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Step Title</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const copy = [...formData.howItWorks];
                        copy[idx].title = e.target.value;
                        setFormData({ ...formData, howItWorks: copy });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) => {
                        const copy = [...formData.howItWorks];
                        copy[idx].description = e.target.value;
                        setFormData({ ...formData, howItWorks: copy });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-hidden"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FARM TO HOME STORY */}
        {activeSubtab === 'farm' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Farm-to-Home Highlight Banner
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Story Badge</label>
                <input
                  type="text"
                  value={formData.farmToHome.badge}
                  onChange={(e) => setFormData({
                    ...formData,
                    farmToHome: { ...formData.farmToHome, badge: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={formData.farmToHome.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    farmToHome: { ...formData.farmToHome, title: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Story Content</label>
                <textarea
                  rows={4}
                  value={formData.farmToHome.content}
                  onChange={(e) => setFormData({
                    ...formData,
                    farmToHome: { ...formData.farmToHome, content: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Farmer Metric Label</label>
                <input
                  type="text"
                  value={formData.farmToHome.farmersCount}
                  onChange={(e) => setFormData({
                    ...formData,
                    farmToHome: { ...formData.farmToHome, farmersCount: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Freshness Metric Label</label>
                <input
                  type="text"
                  value={formData.farmToHome.freshnessGuarantee}
                  onChange={(e) => setFormData({
                    ...formData,
                    farmToHome: { ...formData.farmToHome, freshnessGuarantee: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Farmer Feature Image URL</label>
                <input
                  type="url"
                  value={formData.farmToHome.image}
                  onChange={(e) => setFormData({
                    ...formData,
                    farmToHome: { ...formData.farmToHome, image: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABOUT US PAGE */}
        {activeSubtab === 'about' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              About Us Page Content
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">About Title</label>
                <input
                  type="text"
                  value={formData.aboutUs.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutUs: { ...formData.aboutUs, title: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">About Subtitle</label>
                <input
                  type="text"
                  value={formData.aboutUs.subtitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutUs: { ...formData.aboutUs, subtitle: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Our Journey / Story</label>
                <textarea
                  rows={4}
                  value={formData.aboutUs.story}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutUs: { ...formData.aboutUs, story: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mission Statement</label>
                <textarea
                  rows={3}
                  value={formData.aboutUs.mission}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutUs: { ...formData.aboutUs, mission: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vision Statement</label>
                <textarea
                  rows={3}
                  value={formData.aboutUs.vision}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutUs: { ...formData.aboutUs, vision: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Content Updates</span>
          </button>
        </div>

      </form>

    </div>
  );
};
