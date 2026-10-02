import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Clock, Check, Sparkles, ChefHat, Bookmark, Share2 } from 'lucide-react';
import { Recipe, RecipeStep } from '../types/cuisine';
import { StepVideoCanvas } from './StepVideoCanvas';
import { soundEngine } from '../utils/audioEffects';

interface StepVideoPlayerModalProps {
  recipe: Recipe;
  initialStepIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe?: (recipeId: string) => void;
  isSaved?: boolean;
}

export const StepVideoPlayerModal: React.FC<StepVideoPlayerModalProps> = ({
  recipe,
  initialStepIndex = 0,
  isOpen,
  onClose,
  onSaveRecipe,
  isSaved = false,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(initialStepIndex);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const step: RecipeStep = recipe.steps[currentStepIdx] || recipe.steps[0];

  useEffect(() => {
    setCurrentStepIdx(initialStepIndex);
  }, [initialStepIndex]);

  useEffect(() => {
    // Reset step timer to step duration (in minutes * 60)
    setTimerSeconds(step.durationMinutes * 60);
    setIsTimerRunning(false);
  }, [currentStepIdx, step]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            soundEngine.playTimerChime();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (currentStepIdx < recipe.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      soundEngine.playClick();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      soundEngine.playClick();
    }
  };

  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
    soundEngine.playClick();
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    soundEngine.playClick();
    setTimeout(() => setCopiedShare(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-stone-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-700 my-auto text-stone-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Vidéo Étape par Étape</span>
                <span className="text-xs text-stone-500">·</span>
                <span className="text-xs text-stone-400">{recipe.origin}</span>
              </div>
              <h2 className="text-base md:text-lg font-bold text-white truncate max-w-md md:max-w-xl">
                {recipe.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSaveRecipe && (
              <button
                onClick={() => {
                  onSaveRecipe(recipe.id);
                  soundEngine.playClick();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSaved
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? 'Enregistré' : 'Enregistrer'}</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Copier le lien de la recette"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-800 hover:bg-red-900/40 hover:text-red-400 text-stone-400 transition-colors"
              title="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Share toast notification */}
        {copiedShare && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-1.5 text-center font-medium animate-fadeIn">
            ✓ Lien de la recette Cuisinemarocbook copié dans le presse-papier !
          </div>
        )}

        {/* Step navigation bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800 overflow-x-auto gap-2">
          <div className="flex items-center gap-1 text-xs">
            {recipe.steps.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => {
                  setCurrentStepIdx(idx);
                  soundEngine.playClick();
                }}
                className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                  idx === currentStepIdx
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : idx < currentStepIdx
                    ? 'bg-stone-800 text-amber-400 hover:bg-stone-700'
                    : 'bg-stone-800/60 text-stone-400 hover:bg-stone-800'
                }`}
              >
                Étape {st.stepNumber}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              disabled={currentStepIdx === 0}
              onClick={handlePrevStep}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-stone-400 font-mono">
              {currentStepIdx + 1} / {recipe.steps.length}
            </span>
            <button
              disabled={currentStepIdx === recipe.steps.length - 1}
              onClick={handleNextStep}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content body : Left video canvas, Right step instructions & tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left: Video Canvas */}
          <div className="lg:col-span-7 bg-black p-4 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-stone-800">
            <StepVideoCanvas
              step={step}
              recipeTitle={recipe.title}
              onStepComplete={handleNextStep}
            />

            {/* Quick step action controls under video */}
            <div className="flex items-center justify-between mt-3 px-1 text-xs text-stone-400">
              <span className="italic">{step.keyAdvice}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-amber-400">
                  <Clock className="h-3.5 w-3.5" /> {step.durationMinutes} min
                </span>
              </div>
            </div>
          </div>

          {/* Right: Step Details, Ingredients & Interactive Timer */}
          <div className="lg:col-span-5 p-5 space-y-5 bg-stone-900/90 overflow-y-auto">
            {/* Step Title & Instruction */}
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                Étape {step.stepNumber} sur {recipe.steps.length}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                {step.title}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Chef Secret Highlight Box */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/30 text-amber-200">
              <div className="flex items-center gap-2 font-semibold text-xs text-amber-300 mb-1">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Le secret de la Maâlma marocaine</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-100/90">
                {step.chefSecret}
              </p>
            </div>

            {/* Step Timer Component */}
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 block">Minuteur pour cette étape</span>
                <span className="text-2xl font-mono font-bold text-amber-400 tracking-wider">
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isTimerRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                  <span>{isTimerRunning ? 'Pause' : 'Démarrer'}</span>
                </button>

                <button
                  onClick={() => {
                    setTimerSeconds(step.durationMinutes * 60);
                    setIsTimerRunning(false);
                    soundEngine.playClick();
                  }}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                  title="Réinitialiser le minuteur"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Ingredients used in this step */}
            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Ingrédients mobilisés pour cette étape :
              </h4>
              <div className="space-y-1.5">
                {step.ingredientsUsed.map((ing) => {
                  const isChecked = !!checkedIngredients[ing];
                  return (
                    <button
                      key={ing}
                      onClick={() => toggleIngredientCheck(ing)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs text-left transition-colors ${
                        isChecked
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 line-through'
                          : 'bg-stone-800/60 hover:bg-stone-800 text-stone-200 border border-transparent'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-stone-950'
                            : 'border-stone-500 text-transparent'
                        }`}
                      >
                        <Check className="h-3 w-3 stroke-3" />
                      </div>
                      <span className="flex-1">{ing}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Next Step Button */}
            <div className="pt-2">
              {currentStepIdx < recipe.steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <span>Passer à l'Étape {currentStepIdx + 2} : {recipe.steps[currentStepIdx + 1]?.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="p-3 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-center text-emerald-200 text-xs font-medium">
                  🎉 Bssaha w Raha ! Vous avez complété toutes les étapes. Prêt pour le festin royal !
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
