import React from 'react';
import { ChefHat, Sparkles, MapPin, Heart, BookOpen, Compass, Award } from 'lucide-react';

export const AboutTabSection: React.FC = () => {
  const terroirs = [
    {
      name: 'Fès El-Bali & Meknès',
      title: 'Le Berceau Aristocratique & Andalou',
      description: 'L’art du sucré-salé subtil, de la pastilla royale au pigeon ou au poulet, des tajines aux pruneaux et amandes dorées, et de la harira liée au levain ancestral.',
      specialties: ['Pastilla de Fès', 'Tajine d’Agneau aux Pruneaux', 'Harira Fassia'],
    },
    {
      name: 'Marrakech & Al-Haouz',
      title: 'La Cité Impériale des Braises',
      description: 'L’art de la cuisson lente et confite : la Tanjia mijotée 6 heures dans les cendres du hammam, le grand couscous aux 7 légumes et la Tfaya aux raisins blonds.',
      specialties: ['Tanjia Marrakchia', 'Couscous 7 Légumes', 'Briouates aux amandes'],
    },
    {
      name: 'Tétouan & Tanger (Le Chamal)',
      title: 'L’Élégance Méditerranéenne & Morisca',
      description: 'Pâtisseries fines d’amandes pures, cornes de gazelle à la pâte transparente comme un voile de soie, et poissons marinés à la chermoula fraîche du détroit.',
      specialties: ['Cornes de Gazelle de Tétouan', 'Pastilla aux fruits de mer', 'M’hanncha'],
    },
    {
      name: 'Souss & Sud Saharien',
      title: 'Le Trésor de l’Argan & de l’Or Rouge',
      description: 'L’huile d’argan torréfiée de Taroudant, l’Amlou aux amandes et miel d’euphorbe, et le safran le plus pur au monde récolté à la main à Taliouine.',
      specialties: ['Safran de Taliouine', 'Amlou traditionnel', 'Tagra de poisson'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero presentation */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 md:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
            <Award className="h-4 w-4" />
            <span>Mission & Philosophie Cuisinemarocbook</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 leading-tight">
            Transmettre la Mémoire Culinaire Marocaine par le Geste & la Vidéo
          </h2>
          <p className="text-xs md:text-sm text-stone-600 mt-3 leading-relaxed">
            La cuisine marocaine est l'une des plus riches et des plus raffinées de l'humanité, classée au patrimoine culturel immatériel de l'UNESCO à travers la diète méditerranéenne et l'art du couscous. Cependant, les livres de recettes traditionnels échouent souvent à expliquer la texture exacte d'une sauce ou le mouvement des mains.
          </p>
          <p className="text-xs md:text-sm text-stone-600 mt-2 leading-relaxed">
            Sur <strong>Cuisinemarocbook</strong>, nous décomposons chaque plat en <strong>vidéos courtes pour chaque étape de préparation</strong>. Vous entendez le bruissement de la vapeur, observez la couleur dorée de la daghmira et apprenez les secrets que nos mères et grand-mères transmettaient autrefois dans le secret des demeures de Fès, Marrakech et Tétouan.
          </p>
        </div>
      </div>

      {/* Terroirs Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Compass className="h-5 w-5 text-amber-700" />
          <h3 className="text-lg font-bold text-stone-900">
            Les 4 Grands Terroirs Gastronomiques du Royaume
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {terroirs.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs hover:border-amber-400 transition-all"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                <MapPin className="h-3.5 w-3.5 text-amber-600" />
                <span>{t.name}</span>
              </div>
              <h4 className="text-base font-bold text-stone-900 mb-2">
                {t.title}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {t.description}
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-stone-500">Spécialités :</span>
                {t.specialties.map((sp) => (
                  <span
                    key={sp}
                    className="text-[11px] font-medium bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/60"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spices Manifesto */}
      <div className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-950 rounded-2xl p-6 text-white border border-stone-800 shadow-xs">
        <h3 className="text-lg font-bold font-serif text-white mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span>La Sainte Trinité des Épices Marocaines</span>
        </h3>
        <p className="text-xs md:text-sm text-stone-300 leading-relaxed mb-4">
          Dans notre cuisine, les épices ne masquent pas le goût des aliments : elles élèvent la viande et le légume vers une harmonie céleste.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <h5 className="font-bold text-amber-300">Le Safran de Taliouine</h5>
            <p className="text-stone-300 mt-1 leading-relaxed">
              Toujours infusé au préalable dans un peu d'eau tiède pour réveiller ses pigments d'or et son parfum solaire.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <h5 className="font-bold text-amber-300">La Cannelle de Ceylan</h5>
            <p className="text-stone-300 mt-1 leading-relaxed">
              En bâton dans le bouillon pour diffuser en douceur, et en poudre tamisée pour lustrer les pruneaux et la pastilla.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <h5 className="font-bold text-amber-300">Le Smen Marocain</h5>
            <p className="text-stone-300 mt-1 leading-relaxed">
              Ce beurre clarifié affiné apporte la note umami profonde et inimitable aux couscous et tajines royaux.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
