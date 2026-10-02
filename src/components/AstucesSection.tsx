import React, { useState } from 'react';
import { Sparkles, ThumbsUp, AlertCircle, CheckCircle2, Search, HelpCircle, Share2 } from 'lucide-react';
import { CULINARY_TIPS } from '../data/tipsData';
import { soundEngine } from '../utils/audioEffects';

export const AstucesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedTips, setLikedTips] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les astuces' },
    { id: 'tajine', label: 'Cuisson Tajine' },
    { id: 'semoule', label: 'Semoule Couscous' },
    { id: 'sauces', label: 'Sauces & Daghmira' },
    { id: 'patisserie', label: 'Pastilla & Gâteaux' },
    { id: 'the', label: 'Thé à la Menthe' },
    { id: 'epices', label: 'Épices & Ras El Hanout' },
  ];

  const filteredTips = CULINARY_TIPS.filter((tip) => {
    const matchesCat = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.solvedProblem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const toggleLike = (tipId: string) => {
    setLikedTips((prev) => ({
      ...prev,
      [tipId]: !prev[tipId],
    }));
    soundEngine.playClick();
  };

  const handleShareTip = (tipTitle: string) => {
    navigator.clipboard?.writeText(`${tipTitle} - Découvert sur Cuisinemarocbook !`);
    setToastMessage(`Astuce copiée !`);
    soundEngine.playClick();
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl shadow-lg font-medium">
          ✓ {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Secrets des Maâlemat & Grands Chefs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif leading-tight">
            Les Astuces Culinaires Ancestrales
          </h2>
          <p className="text-xs md:text-sm text-amber-100/80 mt-2 leading-relaxed">
            La gastronomie marocaine ne s'improvise pas : elle repose sur des gestes précis transmis de génération en génération. Maîtrisez le diffuseur thermique, la daghmira sans farine, le couscous trois vapeurs et le rituel du thé en cascade.
          </p>

          {/* Quick Problem Solver Trigger Buttons */}
          <div className="mt-5 pt-4 border-t border-amber-800/60">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2.5">
              <HelpCircle className="h-4 w-4" />
              <span>Besoin d'un secours express en cuisine ?</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Sauce tajine trop liquide', query: 'sauce' },
                { label: 'Tajine qui risque de fissurer', query: 'terre cuite' },
                { label: 'Semoule de couscous collante', query: 'semoule' },
                { label: 'Pastilla pas assez croustillante', query: 'warqa' },
                { label: 'Thé à la menthe trop amer', query: 'thé' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setSearchQuery(chip.query);
                    soundEngine.playClick();
                  }}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-medium transition-colors"
                >
                  ⚡ {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une astuce (ex: smen, daghmira, semoule, diffuseur, épices...)"
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-semibold"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                soundEngine.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => {
          const isLiked = !!likedTips[tip.id];
          const totalLikes = tip.likes + (isLiked ? 1 : 0);

          return (
            <article
              key={tip.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Solved problem flag */}
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                    {tip.categoryLabel}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-500 font-medium truncate">
                    Résout : {tip.solvedProblem}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 leading-snug mb-2">
                  {tip.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {tip.explanation}
                </p>

                {/* Golden Rule Highlight */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/70 mb-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>La Règle d'Or Inviolable</span>
                  </div>
                  <p className="text-emerald-950 leading-relaxed">
                    {tip.goldenRule}
                  </p>
                </div>

                {/* Common Mistake to avoid */}
                <div className="p-3 rounded-xl bg-red-50 border border-red-200/70 mb-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-red-800 mb-1">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span>L'Erreur Classique à Bannir</span>
                  </div>
                  <p className="text-red-950 leading-relaxed">
                    {tip.commonMistake}
                  </p>
                </div>
              </div>

              {/* Card Footer with Likes and Share */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => toggleLike(tip.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isLiked
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="tabular-nums">{totalLikes} Utile</span>
                </button>

                <button
                  onClick={() => handleShareTip(tip.title)}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 p-1.5"
                  title="Partager cette astuce"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Partager</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
