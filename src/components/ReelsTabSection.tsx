import React, { useState } from 'react';
import { Play, Sparkles, Clock, Film, ChefHat, Filter } from 'lucide-react';
import { Recipe, RecipeStep } from '../types/cuisine';
import { RECIPES_DATA } from '../data/recipesData';
import { StepVideoCanvas } from './StepVideoCanvas';
import { soundEngine } from '../utils/audioEffects';

interface ReelsTabSectionProps {
  onOpenStepVideoModal: (recipe: Recipe, stepIndex: number) => void;
}

export const ReelsTabSection: React.FC<ReelsTabSectionProps> = ({
  onOpenStepVideoModal,
}) => {
  const [selectedRecipeFilter, setSelectedRecipeFilter] = useState<string>('all');
  const [activeInlineStep, setActiveInlineStep] = useState<{ recipe: Recipe; stepIdx: number }>({
    recipe: RECIPES_DATA[0],
    stepIdx: 0,
  });

  const filteredRecipes = selectedRecipeFilter === 'all'
    ? RECIPES_DATA
    : RECIPES_DATA.filter((r) => r.id === selectedRecipeFilter);

  // Flatten all steps for reel cards
  const allReelItems = filteredRecipes.flatMap((rec) =>
    rec.steps.map((st, sIdx) => ({
      recipe: rec,
      step: st,
      stepIndex: sIdx,
    }))
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950 to-stone-900 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-stone-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Film className="h-4 w-4" />
            <span>Format Court · Reels & Étape par Étape</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-white">
            Toutes les Vidéos de Préparation Pas à Pas
          </h2>
          <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-xl leading-relaxed">
            Chaque geste culinaire traditionnel marocain décortiqué en vidéo courte : découvrez le secret du son, de la texture et du minuteur adapté.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-900/80 p-2.5 rounded-xl border border-stone-800 text-xs">
          <ChefHat className="h-5 w-5 text-amber-400 shrink-0" />
          <span className="text-stone-300 font-medium">
            <strong className="text-amber-300 tabular-nums">{allReelItems.length}</strong> vidéos courtes disponibles
          </span>
        </div>
      </div>

      {/* Filter by recipe buttons */}
      <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5 shrink-0 px-2">
          <Filter className="h-3.5 w-3.5 text-amber-700" />
          <span>Filtrer par plat :</span>
        </span>

        <button
          onClick={() => {
            setSelectedRecipeFilter('all');
            soundEngine.playClick();
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedRecipeFilter === 'all'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Tous les plats ({RECIPES_DATA.reduce((acc, r) => acc + r.steps.length, 0)})
        </button>

        {RECIPES_DATA.map((r) => (
          <button
            key={r.id}
            onClick={() => {
              setSelectedRecipeFilter(r.id);
              soundEngine.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedRecipeFilter === r.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {r.title.split(' ')[0]} {r.title.split(' ')[1]} ({r.steps.length})
          </button>
        ))}
      </div>

      {/* Featured Spotlight Active Video Player */}
      <div className="bg-stone-950 rounded-2xl border border-stone-800 p-4 md:p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="w-full lg:w-7/12">
            <StepVideoCanvas
              step={activeInlineStep.recipe.steps[activeInlineStep.stepIdx]}
              recipeTitle={activeInlineStep.recipe.title}
              autoPlay={true}
            />
          </div>

          <div className="w-full lg:w-5/12 space-y-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                {activeInlineStep.recipe.origin} · Étape {activeInlineStep.stepIdx + 1} sur {activeInlineStep.recipe.steps.length}
              </span>
              <h3 className="text-xl font-bold font-serif text-white">
                {activeInlineStep.recipe.steps[activeInlineStep.stepIdx]?.title}
              </h3>
              <p className="text-xs text-amber-200 font-medium mt-0.5">
                Plat : {activeInlineStep.recipe.title}
              </p>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                {activeInlineStep.recipe.steps[activeInlineStep.stepIdx]?.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/30 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Conseil de la Maâlma</span>
              </div>
              <p className="text-amber-100/90 leading-relaxed">
                {activeInlineStep.recipe.steps[activeInlineStep.stepIdx]?.chefSecret}
              </p>
            </div>

            <button
              onClick={() => onOpenStepVideoModal(activeInlineStep.recipe, activeInlineStep.stepIdx)}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Ouvrir en plein écran avec minuteur & ingrédients</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of All Short Step Videos */}
      <div>
        <h3 className="text-base font-bold text-stone-900 mb-3">
          Catalogue de toutes les étapes vidéo ({allReelItems.length} vidéos)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allReelItems.map((item, idx) => (
            <div
              key={`${item.recipe.id}-${item.step.id}-${idx}`}
              className="bg-white rounded-xl border border-stone-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-video bg-stone-950 overflow-hidden flex items-center justify-center">
                {/* Background color gradient for step */}
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${item.step.videoBgColor}, ${item.step.videoSecondaryColor})`,
                  }}
                />

                <div className="relative z-10 flex flex-col items-center text-center p-3 text-white">
                  <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-1 shadow-lg">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-200">
                    Étape {item.step.stepNumber} · {item.step.durationMinutes} min
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-stone-300 pointer-events-none">
                  <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                    {item.recipe.origin}
                  </span>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 line-clamp-1">
                    {item.recipe.title}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1 group-hover:text-amber-900">
                    {item.step.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                    {item.step.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setActiveInlineStep({ recipe: item.recipe, stepIdx: item.stepIndex });
                      soundEngine.playClick();
                    }}
                    className="text-[11px] font-bold text-stone-700 hover:text-stone-900"
                  >
                    Aperçu rapide
                  </button>

                  <button
                    onClick={() => onOpenStepVideoModal(item.recipe, item.stepIndex)}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-2xs"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Lancer vidéo</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
