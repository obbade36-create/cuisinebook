import React, { useState } from 'react';
import { X, Clock, Users, Play, ChefHat, Bookmark, Sparkles, MapPin, Check, Plus, Minus, Share2 } from 'lucide-react';
import { Recipe } from '../types/cuisine';
import { soundEngine } from '../utils/audioEffects';

interface RecipeDetailModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onOpenStepVideo: (recipe: Recipe, stepIndex: number) => void;
  isSaved?: boolean;
  onToggleSave?: (recipeId: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onOpenStepVideo,
  isSaved = false,
  onToggleSave,
}) => {
  const [servings, setServings] = useState<number>(recipe.baseServings);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const ratio = servings / recipe.baseServings;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    soundEngine.playClick();
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-stone-900">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 border-b border-stone-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                {recipe.origin}
              </span>
              <span>·</span>
              <span>Préparation {recipe.prepTime}</span>
              <span>·</span>
              <span>Cuisson {recipe.cookTime}</span>
            </div>

            <div className="flex items-center gap-2">
              {onToggleSave && (
                <button
                  onClick={() => {
                    onToggleSave(recipe.id);
                    soundEngine.playClick();
                  }}
                  className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                    isSaved
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={isSaved ? 'Enregistré' : 'Enregistrer'}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Partager"
              >
                <Share2 className="h-4 w-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-colors"
                title="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold font-serif text-white mt-2 leading-snug">
            {recipe.title}
          </h2>
          <p className="text-sm text-amber-100/80 mt-1 max-w-2xl leading-relaxed">
            {recipe.subtitle}
          </p>

          {/* Quick Start Short Videos CTA */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenStepVideo(recipe, 0)}
              className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold rounded-xl text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Lancer le Mode Cuisine (Vidéos pas à pas)</span>
            </button>

            <span className="text-xs text-amber-200/90 font-medium">
              🎬 {recipe.steps.length} vidéos courtes incluses avec minuteurs
            </span>
          </div>
        </div>

        {copied && (
          <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium">
            ✓ Recette partagée : lien copié dans le presse-papier !
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Chef Quote & Heritage story */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-950 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <ChefHat className="h-4 w-4 text-amber-700" />
              <span>Héritage & Mémoire Culinaire</span>
            </div>
            <p className="text-xs md:text-sm text-stone-700 leading-relaxed italic">
              {recipe.chefQuote}
            </p>
            <p className="text-xs text-stone-600 leading-relaxed mt-1">
              {recipe.traditionStory}
            </p>
          </div>

          {/* Ingredients Section with dynamic Portions Calculator */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Ingrédients & Épices Nobles
                </h3>
                <span className="text-xs text-stone-500">
                  Les proportions s'ajustent automatiquement
                </span>
              </div>

              {/* Servings calculator controls */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
                <Users className="h-4 w-4 text-amber-700" />
                <span className="text-xs font-semibold text-stone-700">Portions :</span>
                <button
                  disabled={servings <= 2}
                  onClick={() => {
                    setServings(Math.max(2, servings - 2));
                    soundEngine.playClick();
                  }}
                  className="p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-sm font-bold text-stone-900 w-6 text-center tabular-nums">
                  {servings}
                </span>
                <button
                  disabled={servings >= 16}
                  onClick={() => {
                    setServings(Math.min(16, servings + 2));
                    soundEngine.playClick();
                  }}
                  className="p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <span className="text-xs text-stone-500">pers.</span>
              </div>
            </div>

            {/* Ingredients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {recipe.ingredients.map((ing, idx) => {
                const scaledAmount = Math.round(ing.amount * ratio * 10) / 10;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200/60"
                  >
                    <span className="text-stone-800 font-medium">{ing.name}</span>
                    <span className="font-mono font-bold text-amber-800 shrink-0 ml-2">
                      {scaledAmount} {ing.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preparation Steps with Video Launchers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Étapes de Préparation ({recipe.steps.length} Étapes)
                </h3>
                <span className="text-xs text-stone-500">
                  Cliquez sur n'importe quelle étape pour ouvrir la vidéo explicative correspondante
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {recipe.steps.map((st, sIdx) => (
                <div
                  key={st.id}
                  onClick={() => onOpenStepVideo(recipe, sIdx)}
                  className="group p-4 rounded-xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/30 transition-all cursor-pointer shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                      {st.stepNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-900">
                          {st.title}
                        </h4>
                        <span className="text-[11px] text-stone-400">· {st.durationMinutes} min</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {st.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-700 mt-1.5 font-medium">
                        <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                        <span className="line-clamp-1">{st.chefSecret}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="self-end md:self-center px-3 py-1.5 rounded-lg bg-amber-100 group-hover:bg-amber-500 text-amber-900 group-hover:text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Voir la vidéo</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Drink & Accompaniment Pairing */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700">Accord Boisson Traditionnel :</span>
            <span className="font-bold text-amber-900">{recipe.drinkPairing}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
