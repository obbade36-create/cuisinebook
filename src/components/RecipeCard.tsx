import React from 'react';
import { Clock, ChefHat, Play, Bookmark, Star, Sparkles, MapPin, Eye } from 'lucide-react';
import { Recipe } from '../types/cuisine';
import { soundEngine } from '../utils/audioEffects';

interface RecipeCardProps {
  recipe: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
  onOpenStepVideos: (recipe: Recipe, stepIndex?: number) => void;
  isSaved?: boolean;
  onToggleSave?: (recipeId: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelectRecipe,
  onOpenStepVideos,
  isSaved = false,
  onToggleSave,
}) => {
  return (
    <article className="group bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Top Media Showcase Container (Rich CSS / SVG Culinary Canvas) */}
      <div className="relative aspect-16/10 overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex items-center justify-center">
        {/* Moroccan Zellij Tile subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.4) 2px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Earthenware Tajine / Dish Artwork Render */}
        <div className="relative z-10 flex flex-col items-center text-center p-4">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-400 p-1 shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
            <div className="h-full w-full rounded-full bg-stone-900 flex items-center justify-center text-amber-300">
              <ChefHat className="h-8 w-8 md:h-10 md:w-10" />
            </div>
          </div>

          <div className="mt-2.5">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest">
              Terroir {recipe.origin}
            </span>
          </div>
        </div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-amber-300 border border-amber-500/30">
            <Play className="h-3 w-3 fill-current text-amber-400" />
            <span>{recipe.steps.length} Vidéos Pas à Pas</span>
          </div>
        </div>

        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(recipe.id);
              soundEngine.playClick();
            }}
            aria-label={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
          </button>
        )}

        {/* Bottom Bar: Action Trigger to launch short video */}
        <div className="absolute bottom-3 left-3 right-3">
          <button
            onClick={() => onOpenStepVideos(recipe, 0)}
            className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Lancer les Vidéos Courtes ({recipe.steps.length} étapes)</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata quiet row without boxed pills */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-amber-600" />
              {recipe.origin}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-stone-400" />
              {recipe.cookTime} de cuisson
            </span>
            <span aria-hidden="true">·</span>
            <span>{recipe.difficulty}</span>
          </div>

          <h3 
            onClick={() => onSelectRecipe(recipe)}
            className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer line-clamp-1"
          >
            {recipe.title}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
            {recipe.subtitle}
          </p>

          {/* Key Spices Unboxed */}
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-amber-900/80 overflow-hidden">
            <Sparkles className="h-3 w-3 text-amber-600 shrink-0" />
            <span className="truncate">
              Épices : {recipe.spicesSummary.slice(0, 3).join(', ')}
            </span>
          </div>
        </div>

        {/* Footer Rating & Details trigger */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-stone-800 tabular-nums">{recipe.rating}</span>
            <span className="text-[11px] text-stone-400">({recipe.reviewsCount} avis)</span>
          </div>

          <button
            onClick={() => onSelectRecipe(recipe)}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Fiche Recette</span>
          </button>
        </div>
      </div>
    </article>
  );
};
