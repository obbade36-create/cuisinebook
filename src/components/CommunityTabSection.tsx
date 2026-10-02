import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Camera, Sparkles, Send } from 'lucide-react';
import { soundEngine } from '../utils/audioEffects';

interface FanReview {
  id: string;
  author: string;
  city: string;
  avatarBg: string;
  avatarText: string;
  rating: number;
  date: string;
  dishPrepared: string;
  comment: string;
  likes: number;
}

export const CommunityTabSection: React.FC = () => {
  const [reviews, setReviews] = useState<FanReview[]>([
    {
      id: 'rev-1',
      author: 'Fatima-Zahra Alami',
      city: 'Casablanca Anfa',
      avatarBg: 'bg-emerald-600',
      avatarText: 'FA',
      rating: 5,
      date: 'Hier',
      dishPrepared: "Tajine d'Agneau aux Pruneaux & Amandes",
      comment: "Pour la première fois de ma vie, mes pruneaux étaient brillants et confits sans noircir la sauce de l'agneau ! Le secret de la cuisson séparée avec les deux louches de bouillon prélevé a complètement changé mon niveau en cuisine. Mes invités ont cru que j'avais fait appel à un traiteur de Fès.",
      likes: 89,
    },
    {
      id: 'rev-2',
      author: 'Mehdi Bennani',
      city: 'Rabat Agdal',
      avatarBg: 'bg-blue-600',
      avatarText: 'MB',
      rating: 5,
      date: 'Il y a 3 jours',
      dishPrepared: 'Couscous Royal aux Sept Légumes & Tfaya',
      comment: "La technique du linge humide 'Gfal' entre la marmite et le keskas m'a enfin permis d'avoir une semoule ultra aérée sans aucune perte de vapeur. Et la Tfaya aux raisins blonds était d'une douceur absolue.",
      likes: 64,
    },
    {
      id: 'rev-3',
      author: 'Nadia Chraibi',
      city: 'Tanger Marshan',
      avatarBg: 'bg-amber-600',
      avatarText: 'NC',
      rating: 5,
      date: 'La semaine dernière',
      dishPrepared: 'Pastilla Impériale au Poulet & Amandes',
      comment: "Le conseil sur l'égouttage au chinois de la daghmira aux œufs est le Graal ! Pas une seule feuille de warqa ramollie, le croustillant a tenu plus de 24h. Merci Cuisinemarocbook pour cette transmission d'excellence.",
      likes: 112,
    },
  ]);

  const [authorName, setAuthorName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [dishPrepared, setDishPrepared] = useState<string>("Tajine d'Agneau aux Pruneaux");
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !userComment.trim()) return;

    const newRev: FanReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      city: city.trim() || 'Maroc',
      avatarBg: 'bg-stone-800',
      avatarText: authorName.slice(0, 2).toUpperCase(),
      rating: userRating,
      date: "À l'instant",
      dishPrepared,
      comment: userComment.trim(),
      likes: 1,
    };

    setReviews([newRev, ...reviews]);
    setAuthorName('');
    setCity('');
    setUserComment('');
    setSubmitted(true);
    soundEngine.playTimerChime();
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Community Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 rounded-2xl p-6 text-white border border-stone-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles className="h-4 w-4" />
              <span>La Grande Famille des Passionnés</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-white">
              Témoignages & Réalisations des Abonnés
            </h2>
            <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-xl">
              Plus de 420 000 cuisiniers et amateurs de cuisine marocaine partagent leurs réussites et secrets culinaires.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
            <div>
              <div className="text-3xl font-bold font-mono text-amber-400">4.96</div>
              <div className="flex text-amber-400 text-xs mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
            <div className="text-xs text-stone-300 border-l border-white/20 pl-4">
              <span className="font-bold text-white block">2 840 avis certifiés</span>
              <span>99% d'abonnés conquis</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Reviews Feed */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-stone-900">
            Dernières publications de la communauté
          </h3>

          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-xs ${rev.avatarBg}`}
                  >
                    {rev.avatarText}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{rev.author}</h4>
                    <span className="text-xs text-stone-500">
                      {rev.city} · {rev.date}
                    </span>
                  </div>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <div className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/60">
                Plat cuisiné : {rev.dishPrepared}
              </div>

              <p className="text-xs md:text-sm text-stone-700 leading-relaxed">
                {rev.comment}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <button
                  onClick={() => soundEngine.playClick()}
                  className="flex items-center gap-1.5 font-semibold text-stone-700 hover:text-amber-800"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{rev.likes} personnes trouvent cet avis utile</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Right: Submit Review Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs sticky top-20">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Partagez votre réalisation !
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Avez-vous testé une recette avec les vidéos courtes de Cuisinemarocbook ? Donnez votre avis à la communauté.
            </p>

            {submitted && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold">
                ✓ Baraka Allahu fik ! Votre avis a été publié avec succès.
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Votre nom ou pseudo :
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ex: Laila de Marrakech"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Votre ville ou région :
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Fès, Rabat, Paris, Bruxelles..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Recette testée :
                </label>
                <select
                  value={dishPrepared}
                  onChange={(e) => setDishPrepared(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Tajine d'Agneau aux Pruneaux">Tajine d'Agneau aux Pruneaux</option>
                  <option value="Pastilla Impériale au Poulet">Pastilla Impériale au Poulet</option>
                  <option value="Couscous Royal aux Sept Légumes">Couscous Royal aux Sept Légumes</option>
                  <option value="Tanjia Marrakchia">Tanjia Marrakchia</option>
                  <option value="Zaalouk d'Aubergines Grillées">Zaalouk d'Aubergines Grillées</option>
                  <option value="Cornes de Gazelle de Tétouan">Cornes de Gazelle de Tétouan</option>
                  <option value="Harira Traditionnelle Fassie">Harira Traditionnelle Fassie</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Votre note :
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-1">{userRating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Votre retour d'expérience & astuces :
                </label>
                <textarea
                  required
                  rows={3}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Racontez comment s'est passée votre préparation, vos impressions sur les vidéos pas à pas..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Publier mon avis sur la page</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
