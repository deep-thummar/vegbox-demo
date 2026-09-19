import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ShieldCheck, Heart, Users, Target, Eye, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { cms, settings, setRoute } = useStore();
  const about = cms.aboutUs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>The VegBox Origin Story</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {about.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {about.subtitle}
        </p>
      </div>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-emerald-100 aspect-16/9 max-h-[420px] w-full">
        <img
          src={about.heroImage}
          alt="Organic vegetable farm"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Impact Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {about.stats?.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center">
            <p className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">{stat.value}</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Farm to Home Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Our Journey</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Fixing a Broken Food Chain
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
            {about.story}
          </div>
        </div>

        <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-4/3">
          <img
            src={about.teamImage}
            alt="Farmers and quality checking team"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-900 text-white p-8 rounded-3xl space-y-3 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 text-xl font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold">Our Mission</h3>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            {about.mission}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Our Vision</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {about.vision}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-extrabold">
          Taste The Living Soil Difference Today
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
          Harvested daily at 4:30 AM, packed in plastic-free crates, delivered in 3 hours.
        </p>
        <button
          onClick={() => setRoute('products')}
          className="inline-flex items-center space-x-2 bg-white hover:bg-emerald-50 text-emerald-900 font-bold px-7 py-3 rounded-xl shadow-md transition-colors cursor-pointer text-sm"
        >
          <span>Explore Farm Vegetables</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
