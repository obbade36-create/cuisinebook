import React, { useState } from 'react';
import { ThumbsUp, Heart, MessageCircle, Share2, Play, CheckCircle, ChefHat, Send } from 'lucide-react';
import { FacebookPost, Recipe } from '../types/cuisine';
import { RECIPES_DATA } from '../data/recipesData';
import { soundEngine } from '../utils/audioEffects';

interface FacebookPostCardProps {
  post: FacebookPost;
  onOpenRecipeVideos: (recipe: Recipe, stepIndex?: number) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const FacebookPostCard: React.FC<FacebookPostCardProps> = ({
  post,
  onOpenRecipeVideos,
  onSelectRecipe,
}) => {
  const [reactions, setReactions] = useState(post.reactions);
  const [userReaction, setUserReaction] = useState<'like' | 'love' | 'hungry' | 'wow' | null>(post.userReaction || null);
  const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false);
  const [comments, setComments] = useState(post.comments);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(true);
  const [shareToast, setShareToast] = useState<boolean>(false);

  const linkedRecipe = post.recipeId ? RECIPES_DATA.find((r) => r.id === post.recipeId) : null;

  const totalReactionsCount = reactions.likes + reactions.loves + reactions.wows + reactions.hungry;

  const handleSelectReaction = (type: 'like' | 'love' | 'hungry' | 'wow') => {
    if (userReaction === type) {
      // Toggle off
      const key = type === 'like' ? 'likes' : type === 'love' ? 'loves' : type === 'wow' ? 'wows' : 'hungry';
      setReactions((prev) => ({
        ...prev,
        [key]: Math.max(0, prev[key] - 1),
      }));
      setUserReaction(null);
    } else {
      // If switching from another reaction
      const prevType = userReaction;
      setReactions((prev) => {
        const next = { ...prev };
        if (prevType) {
          const oldKey = prevType === 'like' ? 'likes' : prevType === 'love' ? 'loves' : prevType === 'wow' ? 'wows' : 'hungry';
          next[oldKey] = Math.max(0, next[oldKey] - 1);
        }
        const newKey = type === 'like' ? 'likes' : type === 'love' ? 'loves' : type === 'wow' ? 'wows' : 'hungry';
        next[newKey] = next[newKey] + 1;
        return next;
      });
      setUserReaction(type);
    }
    setShowReactionPicker(false);
    soundEngine.playClick();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newC = {
      id: `c-user-${Date.now()}`,
      author: 'Vous (Abonné Cuisinemarocbook)',
      avatarText: 'VO',
      avatarBg: 'bg-amber-600',
      timeAgo: 'À l’instant',
      text: newCommentText.trim(),
      likes: 1,
    };

    setComments((prev) => [...prev, newC]);
    setNewCommentText('');
    soundEngine.playClick();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    soundEngine.playClick();
    setTimeout(() => setShareToast(false), 2200);
  };

  return (
    <article className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
      {/* Post Author Bar */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-700 to-yellow-500 p-0.5 shadow-sm flex items-center justify-center shrink-0">
            <div className="h-full w-full rounded-full bg-stone-900 flex items-center justify-center text-amber-300 font-bold text-xs">
              <ChefHat className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-stone-900 leading-none">
                {post.author.name}
              </h4>
              <CheckCircle className="h-3.5 w-3.5 fill-blue-500 text-white" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
              <span>{post.timestamp}</span>
              <span>·</span>
              <span className="text-amber-800 font-semibold">Gastronomie Marocaine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Text Body */}
      <div className="px-4 pb-3 text-xs md:text-sm text-stone-800 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      {/* Embedded Recipe & Step Videos Media Block */}
      {linkedRecipe && (
        <div className="mx-4 mb-4 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/60 to-stone-50 overflow-hidden shadow-xs">
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 rounded-xl bg-amber-900 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                <ChefHat className="h-7 w-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                  Recette Recommandée · {linkedRecipe.origin}
                </span>
                <h5 className="text-sm font-bold text-stone-900 mt-0.5">
                  {linkedRecipe.title}
                </h5>
                <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                  {linkedRecipe.subtitle}
                </p>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <span>⏱️ {linkedRecipe.cookTime}</span>
                  <span>·</span>
                  <span>⭐ {linkedRecipe.rating} / 5</span>
                  <span>·</span>
                  <span className="text-amber-700 font-medium">🎬 {linkedRecipe.steps.length} vidéos courtes étape par étape</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenRecipeVideos(linkedRecipe, post.videoHighlightStep ? post.videoHighlightStep - 1 : 0)}
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Voir les vidéos par étape</span>
              </button>
              <button
                onClick={() => onSelectRecipe(linkedRecipe)}
                className="w-full sm:w-auto px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
              >
                Fiche complète
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {shareToast && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-1.5 text-center font-medium">
          ✓ Publication partagée : lien copié dans le presse-papier !
        </div>
      )}

      {/* Reactions Count Bar */}
      <div className="px-4 py-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center -space-x-1">
            <span className="h-4.5 w-4.5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white">👍</span>
            <span className="h-4.5 w-4.5 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">❤️</span>
            <span className="h-4.5 w-4.5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white">🤤</span>
          </div>
          <span className="font-semibold text-stone-700 tabular-nums">
            {totalReactionsCount}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {comments.length} commentaires
          </button>
          <span>·</span>
          <span>{post.sharesCount} partages</span>
        </div>
      </div>

      {/* Interactive Action Bar (Like, Comment, Share) */}
      <div className="px-2 py-1 border-t border-b border-stone-100 flex items-center justify-around relative">
        {/* Reaction Picker Popover */}
        {showReactionPicker && (
          <div className="absolute left-4 -top-12 z-20 bg-white rounded-full shadow-xl border border-stone-200 px-3 py-1.5 flex items-center gap-2 animate-fadeIn">
            <button
              onClick={() => handleSelectReaction('like')}
              className="hover:scale-125 transition-transform text-lg"
              title="J'aime"
            >
              👍
            </button>
            <button
              onClick={() => handleSelectReaction('love')}
              className="hover:scale-125 transition-transform text-lg"
              title="J'adore"
            >
              ❤️
            </button>
            <button
              onClick={() => handleSelectReaction('hungry')}
              className="hover:scale-125 transition-transform text-lg"
              title="Miam / Bave"
            >
              🤤
            </button>
          </div>
        )}

        <button
          onClick={() => {
            if (!userReaction) {
              handleSelectReaction('like');
            } else {
              handleSelectReaction(userReaction);
            }
          }}
          onMouseEnter={() => setShowReactionPicker(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold hover:bg-stone-50 transition-colors ${
            userReaction === 'love'
              ? 'text-red-600'
              : userReaction === 'hungry'
              ? 'text-amber-600'
              : userReaction === 'like'
              ? 'text-blue-600'
              : 'text-stone-600'
          }`}
        >
          {userReaction === 'love' ? (
            <Heart className="h-4 w-4 fill-current" />
          ) : (
            <ThumbsUp className={`h-4 w-4 ${userReaction ? 'fill-current' : ''}`} />
          )}
          <span>
            {userReaction === 'love' ? "J'adore" : userReaction === 'hungry' ? 'Miam !' : "J'aime"}
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Commenter</span>
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Partager</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-stone-50/50 space-y-3">
          {/* Comments List */}
          <div className="space-y-2.5">
            {comments.map((cm) => (
              <div key={cm.id} className="flex items-start gap-2.5 text-xs">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-white text-[10px] shrink-0 ${cm.avatarBg}`}
                >
                  {cm.avatarText}
                </div>
                <div className="flex-1">
                  <div
                    className={`p-2.5 rounded-2xl ${
                      cm.isChefReply
                        ? 'bg-amber-100/70 border border-amber-300/50'
                        : 'bg-white border border-stone-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-stone-900">{cm.author}</span>
                      {cm.isChefReply && (
                        <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                          Auteur · Chef
                        </span>
                      )}
                    </div>
                    <p className="text-stone-700 leading-relaxed">{cm.text}</p>
                  </div>
                  <div className="flex items-center gap-3 px-2 pt-1 text-[11px] text-stone-400">
                    <span>{cm.timeAgo}</span>
                    <button className="hover:underline font-semibold text-stone-600">
                      J'aime ({cm.likes})
                    </button>
                    <button className="hover:underline font-semibold text-stone-600">
                      Répondre
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
            <div className="h-7 w-7 rounded-full bg-stone-800 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0">
              VO
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Poser une question culinaire ou donner votre avis..."
                className="w-full pl-3 pr-10 py-2 bg-white border border-stone-200 rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed text-stone-950 transition-colors"
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
};
