import React, { useState } from 'react';
import { FacebookHeader } from './components/FacebookHeader';
import { PageHeader } from './components/PageHeader';
import { StoriesBar } from './components/StoriesBar';
import { FacebookPostCard } from './components/FacebookPostCard';
import { RecipeCard } from './components/RecipeCard';
import { StepVideoPlayerModal } from './components/StepVideoPlayerModal';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { ChefMessengerModal } from './components/ChefMessengerModal';
import { SavedRecipesModal } from './components/SavedRecipesModal';
import { AstucesSection } from './components/AstucesSection';
import { ReelsTabSection } from './components/ReelsTabSection';
import { CommunityTabSection } from './components/CommunityTabSection';
import { AboutTabSection } from './components/AboutTabSection';

import { RECIPES_DATA } from './data/recipesData';
import { INITIAL_POSTS, STORIES_DATA } from './data/facebookPostsData';
import { Recipe, RecipeCategory, StoryItem } from './types/cuisine';
import { soundEngine } from './utils/audioEffects';
import { Play, Sparkles, ChefHat, Bookmark, Filter, Search, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>('all');
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([
    'tajine-agneau-pruneaux',
    'pastilla-poulet-amandes',
  ]);

  // Modals state
  const [activeRecipeForVideos, setActiveRecipeForVideos] = useState<Recipe | null>(null);
  const [videoModalStepIndex, setVideoModalStepIndex] = useState<number>(0);
  const [activeRecipeForDetail, setActiveRecipeForDetail] = useState<Recipe | null>(null);
  const [isMessengerOpen, setIsMessengerOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // Toggle Save Recipe
  const toggleSaveRecipe = (recipeId: string) => {
    setSavedRecipeIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  // Launch step video modal
  const handleOpenStepVideos = (recipe: Recipe, stepIndex: number = 0) => {
    setActiveRecipeForVideos(recipe);
    setVideoModalStepIndex(stepIndex);
    soundEngine.playClick();
  };

  // Select story from stories bar
  const handleSelectStory = (story: StoryItem) => {
    if (story.recipeId) {
      const found = RECIPES_DATA.find((r) => r.id === story.recipeId);
      if (found) {
        handleOpenStepVideos(found, 0);
        return;
      }
    }
    // Default open first featured recipe
    handleOpenStepVideos(RECIPES_DATA[0], 0);
  };

  // Quick Reels launcher
  const handleOpenQuickReels = () => {
    handleOpenStepVideos(RECIPES_DATA[0], 0);
  };

  // Filtered recipes for the "Recettes" tab
  const filteredRecipes = RECIPES_DATA.filter((recipe) => {
    const matchesCategory =
      selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.spicesSummary.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      recipe.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const recipeCategories: Array<{ id: RecipeCategory; label: string }> = [
    { id: 'all', label: 'Toutes les Recettes' },
    { id: 'tajines', label: 'Tajines' },
    { id: 'couscous', label: 'Couscous' },
    { id: 'pastillas', label: 'Pastillas' },
    { id: 'entrees', label: 'Entrées & Zaalouk' },
    { id: 'patisseries', label: 'Cornes de Gazelle' },
    { id: 'soupes', label: 'Harira' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-stone-900 flex flex-col font-sans">
      {/* Top Facebook Navigation Header */}
      <FacebookHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedRecipeIds.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenQuickReels={handleOpenQuickReels}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 pb-16">
        {/* Facebook Page Cover & Profile */}
        <PageHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenMessenger={() => setIsMessengerOpen(true)}
          onOpenQuickReels={handleOpenQuickReels}
        />

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {/* TAB 1: FIL D'ACTUALITÉ (PUBLICATIONS) */}
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Stories & Posts Feed */}
              <div className="lg:col-span-8 space-y-4">
                {/* Stories Bar */}
                <StoriesBar
                  stories={STORIES_DATA}
                  onSelectStory={handleSelectStory}
                />

                {/* Create a Quick Question / Post Box */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      VO
                    </div>
                    <button
                      onClick={() => setIsMessengerOpen(true)}
                      className="flex-1 text-left px-4 py-2.5 bg-stone-100 hover:bg-stone-200/70 rounded-full text-xs text-stone-500 transition-colors"
                    >
                      Poser une question de cuisine à Chef Lalla Fatima...
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs text-stone-600">
                    <button
                      onClick={() => handleOpenStepVideos(RECIPES_DATA[0], 0)}
                      className="flex items-center gap-2 hover:bg-stone-50 px-3 py-1.5 rounded-lg transition-colors font-medium text-amber-800"
                    >
                      <Play className="h-4 w-4 fill-current text-amber-500" />
                      <span>Mode Vidéos Pas à Pas</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('astuces')}
                      className="flex items-center gap-2 hover:bg-stone-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      <span>Astuces Secrètes</span>
                    </button>
                  </div>
                </div>

                {/* Feed Posts List */}
                <div className="space-y-4">
                  {INITIAL_POSTS.map((post) => (
                    <FacebookPostCard
                      key={post.id}
                      post={post}
                      onOpenRecipeVideos={(rcp, stepIdx) => handleOpenStepVideos(rcp, stepIdx)}
                      onSelectRecipe={(rcp) => setActiveRecipeForDetail(rcp)}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Page Sidebar & Quick Widgets */}
              <div className="hidden lg:block lg:col-span-4 space-y-4">
                {/* Featured Recipe of the day */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wide">
                      <ChefHat className="h-4 w-4 text-amber-600" />
                      <span>Recette Royale du Jour</span>
                    </div>
                  </div>

                  <div className="relative aspect-video rounded-xl bg-stone-900 overflow-hidden flex flex-col justify-end p-3 text-white mb-3">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                        Fès El-Bali · 5 Étapes Vidéo
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        Tajine d'Agneau aux Pruneaux & Amandes
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenStepVideos(RECIPES_DATA[0], 0)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Lancer les 5 vidéos de préparation</span>
                  </button>
                </div>

                {/* Quick Astuce Widget */}
                <div className="bg-gradient-to-br from-amber-900 to-stone-900 text-white rounded-2xl p-4 border border-amber-800/60 shadow-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>L'Astuce Express du Chef</span>
                  </div>
                  <h4 className="text-sm font-bold leading-snug">
                    Le secret du Tajine en terre cuite :
                  </h4>
                  <p className="text-xs text-amber-100/90 leading-relaxed">
                    « Ne versez JAMAIS d'eau froide dans un tajine chaud en cours de cuisson ! Utilisez uniquement de l'eau bouillante par le bord pour éviter de fendre la céramique. »
                  </p>
                  <button
                    onClick={() => setActiveTab('astuces')}
                    className="text-xs font-bold text-amber-300 hover:text-white pt-1 flex items-center gap-1"
                  >
                    <span>Voir toutes les astuces des chefs →</span>
                  </button>
                </div>

                {/* About Page Card */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs space-y-2 text-xs text-stone-600">
                  <h4 className="font-bold text-stone-900 text-sm">
                    À propos de Cuisinemarocbook
                  </h4>
                  <p className="leading-relaxed">
                    Page officielle dédiée à la transmission vivante de la haute gastronomie marocaine traditionnelle. Vidéos courtes pour chaque étape, astuces de grand-mère et dosages d'épices séculaires.
                  </p>
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-stone-400 text-[11px]">
                    <span>© 2026 Cuisinemarocbook</span>
                    <span>·</span>
                    <span>Confidentialité</span>
                    <span>·</span>
                    <span>Conditions</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RECETTES TRADITIONNELLES */}
          {activeTab === 'recipes' && (
            <div className="space-y-6">
              {/* Category Filter Pills & Search */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {recipeCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        soundEngine.playClick();
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer une recette..."
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-100 rounded-full text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Recipe Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSelectRecipe={(rcp) => setActiveRecipeForDetail(rcp)}
                    onOpenStepVideos={(rcp, stepIdx) => handleOpenStepVideos(rcp, stepIdx)}
                    isSaved={savedRecipeIds.includes(recipe.id)}
                    onToggleSave={toggleSaveRecipe}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REELS PAS À PAS */}
          {activeTab === 'reels' && (
            <ReelsTabSection
              onOpenStepVideoModal={(rcp, stepIdx) => handleOpenStepVideos(rcp, stepIdx)}
            />
          )}

          {/* TAB 4: ASTUCES CULINAIRES */}
          {activeTab === 'astuces' && <AstucesSection />}

          {/* TAB 5: AVIS & COMMUNAUTÉ */}
          {activeTab === 'community' && <CommunityTabSection />}

          {/* TAB 6: HISTOIRE & TERROIRS */}
          {activeTab === 'about' && <AboutTabSection />}
        </div>
      </main>

      {/* Floating Messenger Action Button */}
      <button
        onClick={() => setIsMessengerOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-full shadow-2xl flex items-center gap-2.5 transition-transform hover:scale-105"
      >
        <div className="h-6 w-6 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center font-bold text-xs">
          <ChefHat className="h-4 w-4" />
        </div>
        <span className="text-xs font-bold">Conseil Chef en direct</span>
      </button>

      {/* MODAL 1: Full Step Video Player */}
      {activeRecipeForVideos && (
        <StepVideoPlayerModal
          recipe={activeRecipeForVideos}
          initialStepIndex={videoModalStepIndex}
          isOpen={!!activeRecipeForVideos}
          onClose={() => setActiveRecipeForVideos(null)}
          onSaveRecipe={toggleSaveRecipe}
          isSaved={savedRecipeIds.includes(activeRecipeForVideos.id)}
        />
      )}

      {/* MODAL 2: Full Recipe Details */}
      {activeRecipeForDetail && (
        <RecipeDetailModal
          recipe={activeRecipeForDetail}
          isOpen={!!activeRecipeForDetail}
          onClose={() => setActiveRecipeForDetail(null)}
          onOpenStepVideo={(rcp, stepIdx) => {
            setActiveRecipeForDetail(null);
            handleOpenStepVideos(rcp, stepIdx);
          }}
          isSaved={savedRecipeIds.includes(activeRecipeForDetail.id)}
          onToggleSave={toggleSaveRecipe}
        />
      )}

      {/* MODAL 3: Messenger Dialog with Chef */}
      <ChefMessengerModal
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
      />

      {/* MODAL 4: Saved Recipes List */}
      <SavedRecipesModal
        savedRecipeIds={savedRecipeIds}
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onSelectRecipe={(rcp) => setActiveRecipeForDetail(rcp)}
        onOpenStepVideos={(rcp, stepIdx) => handleOpenStepVideos(rcp, stepIdx)}
        onRemoveSaved={toggleSaveRecipe}
      />
    </div>
  );
}
