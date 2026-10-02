import React, { useState } from 'react';
import { ChefHat, CheckCircle, MessageCircle, Play, Share2, ThumbsUp, Sparkles, MapPin, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audioEffects';

interface PageHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenMessenger: () => void;
  onOpenQuickReels: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenMessenger,
  onOpenQuickReels,
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(true);
  const [followersCount, setFollowersCount] = useState<number>(428500);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const toggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
    soundEngine.playClick();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    soundEngine.playClick();
    setTimeout(() => setCopiedShare(false), 2200);
  };

  const tabs = [
    { id: 'feed', label: 'Publications' },
    { id: 'recipes', label: 'Recettes Traditionnelles' },
    { id: 'reels', label: 'Vidéos Courtes (Reels)' },
    { id: 'astuces', label: 'Astuces des Chefs' },
    { id: 'community', label: 'Avis & Photos des Fans' },
    { id: 'about', label: 'À Propos' },
  ];

  return (
    <div className="bg-white border-b border-stone-200/90 shadow-xs mb-4">
      <div className="max-w-7xl mx-auto">
        {/* Cover Photo Area with rich Moroccan Zellij & culinary aesthetic */}
        <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900">
          {/* Subtle Zellij mosaic pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(245, 158, 11, 0.4) 2px, transparent 0)`,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Banner Graphic & Text */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-1">
              <span>🇲🇦 Gastronomie Marocaine d'Exception</span>
              <span>·</span>
              <span>Fès · Marrakech · Tétouan · Rabat</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white tracking-tight">
              Cuisinemarocbook
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl line-clamp-2">
              Le sanctuaire des recettes traditionnelles ancestrales, des astuces secrètes de grand-mère et des vidéos courtes pas à pas pour chaque étape de préparation.
            </p>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="px-4 sm:px-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 sm:-mt-16 relative z-10">
            {/* Avatar & Title */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white bg-gradient-to-tr from-amber-700 via-amber-600 to-yellow-500 p-1 shadow-xl shrink-0">
                <div className="h-full w-full rounded-full bg-stone-950 flex flex-col items-center justify-center text-amber-300">
                  <ChefHat className="h-10 w-10 sm:h-14 sm:w-14" />
                  <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase mt-0.5">Chef Beldi</span>
                </div>
                <div className="absolute bottom-1 right-1 p-1 bg-blue-500 rounded-full text-white ring-2 ring-white">
                  <CheckCircle className="h-4 w-4 fill-current" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                    Cuisinemarocbook
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Page Officielle
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-stone-500 mt-1">
                  <span className="font-bold text-stone-800 tabular-nums">
                    {(followersCount / 1000).toFixed(1)}k abonnés
                  </span>
                  <span>·</span>
                  <span>99% d'avis positifs</span>
                  <span>·</span>
                  <span>Vidéos courtes pas à pas</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
              <button
                onClick={toggleFollow}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  isFollowing
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <ThumbsUp className={`h-3.5 w-3.5 ${isFollowing ? 'fill-current' : ''}`} />
                <span>{isFollowing ? 'Abonné(e) ✓' : "S'abonner"}</span>
              </button>

              <button
                onClick={onOpenMessenger}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Message Chef</span>
              </button>

              <button
                onClick={onOpenQuickReels}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current text-amber-400" />
                <span>Mode Vidéos</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title="Partager la page"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Share Toast */}
          {copiedShare && (
            <div className="mt-3 bg-emerald-600 text-white text-xs px-4 py-1.5 rounded-lg text-center font-medium animate-fadeIn">
              ✓ Lien de la page Cuisinemarocbook copié dans le presse-papier !
            </div>
          )}

          {/* Navigation Tabs Bar */}
          <div className="mt-6 pt-1 border-t border-stone-100 flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  soundEngine.playClick();
                }}
                className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-lg'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
