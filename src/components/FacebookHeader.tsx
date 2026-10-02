import React, { useState } from 'react';
import { Search, Bookmark, Volume2, VolumeX, Menu, X, Sparkles, ChefHat, Film } from 'lucide-react';
import { soundEngine } from '../utils/audioEffects';

interface FacebookHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenQuickReels: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const FacebookHeader: React.FC<FacebookHeaderProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  onOpenSaved,
  onOpenQuickReels,
  searchQuery,
  onSearchChange,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) {
      soundEngine.playClick();
    }
  };

  const navItems = [
    { id: 'feed', label: 'Publications' },
    { id: 'recipes', label: 'Recettes & Vidéos' },
    { id: 'astuces', label: 'Astuces des Chefs' },
    { id: 'reels', label: 'Reels Pas à Pas' },
    { id: 'community', label: 'Avis & Communauté' },
    { id: 'about', label: 'Histoire & Terroirs' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Left Zone: Brand single text element with avatar icon */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('feed');
            }}
            className="flex items-center gap-2 group text-stone-900"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 p-0.5 flex items-center justify-center text-white shadow-sm">
              <div className="h-full w-full rounded-full bg-stone-950 flex items-center justify-center text-amber-400">
                <ChefHat className="h-5 w-5" />
              </div>
            </div>
            <span className="font-display font-bold text-lg md:text-xl tracking-tight text-amber-950 group-hover:text-amber-800 transition-colors">
              Cuisinemarocbook
            </span>
          </a>

          {/* Search Bar */}
          <div className="hidden md:flex items-center relative w-56 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher recettes, astuces..."
              className="w-full pl-9 pr-3 py-1.5 bg-stone-100 border border-transparent rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-amber-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Center Zone: Clean navigation text links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                soundEngine.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Zone: Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Reels button */}
          <button
            onClick={onOpenQuickReels}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-xs transition-colors"
            title="Lancer les vidéos courtes"
          >
            <Film className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Vidéos Pas à Pas</span>
          </button>

          {/* Saved bookmarks */}
          <button
            onClick={onOpenSaved}
            className="relative p-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
            title="Mes recettes enregistrées"
          >
            <Bookmark className="h-4 w-4" />
            {savedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Sound Ambience */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
            title={isMuted ? 'Activer le son culinaire' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-stone-400" /> : <Volume2 className="h-4 w-4 text-amber-700" />}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-700"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 bg-stone-100 rounded-lg text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs font-semibold">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                  soundEngine.playClick();
                }}
                className={`p-2 rounded-lg text-left ${
                  activeTab === item.id ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
