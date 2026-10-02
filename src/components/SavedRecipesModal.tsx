import React from 'react';
import { X, Bookmark, Play, Trash2, ChefHat, Eye } from 'lucide-react';
import { Recipe } from '../types/cuisine';
import { RECIPES_DATA } from '../data/recipesData';
import { soundEngine } from '../utils/audioEffects';

interface SavedRecipesModalProps {
  savedRecipeIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onOpenStepVideos: (recipe: Recipe, stepIdx?: number) => void;
  onRemoveSaved: (recipeId: string) => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  savedRecipeIds,
  isOpen,
  onClose,
  onSelectRecipe,
  onOpenStepVideos,
  onRemoveSaved,
}) => {
  if (!isOpen) return null;

  const savedRecipes = RECIPES_DATA.filter((r) => savedRecipeIds.includes(r.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bookmark className="h-4 w-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold">Mes Recettes Enregistrées</h3>
              <span className="text-xs text-stone-400">
                {savedRecipes.length} recette{savedRecipes.length > 1 ? 's' : ''} disponible{savedRecipes.length > 1 ? 's' : ''} avec vidéos pas à pas
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {savedRecipes.length === 0 ? (
            <div className="py-12 text-center text-stone-500 space-y-3">
              <ChefHat className="h-12 w-12 mx-auto text-stone-300 stroke-1" />
              <p className="text-sm font-semibold text-stone-700">
                Vous n'avez pas encore enregistré de recette
              </p>
              <p className="text-xs max-w-xs mx-auto text-stone-400">
                Cliquez sur l'icône de signet sur n'importe quel tajine, pastilla ou couscous pour le retrouver ici facilement.
              </p>
            </div>
          ) : (
            savedRecipes.map((rcp) => (
              <div
                key={rcp.id}
                className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                    {rcp.origin} · {rcp.cookTime}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                    {rcp.title}
                  </h4>
                  <span className="text-xs text-stone-500">
                    🎬 {rcp.steps.length} vidéos courtes incluses
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onOpenStepVideos(rcp, 0);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Lancer vidéos</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectRecipe(rcp);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700"
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      onRemoveSaved(rcp.id);
                      soundEngine.playClick();
                    }}
                    className="p-1.5 rounded-lg bg-stone-200 hover:bg-red-100 hover:text-red-600 text-stone-600"
                    title="Supprimer des favoris"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
