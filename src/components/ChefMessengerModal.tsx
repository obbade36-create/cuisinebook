import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ChefHat, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audioEffects';

interface Message {
  id: string;
  sender: 'chef' | 'user';
  text: string;
  time: string;
}

interface ChefMessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChefMessengerModal: React.FC<ChefMessengerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'chef',
      text: "Salam aleykoum et bienvenue chez Cuisinemarocbook ! 🇲🇦 Je suis Chef Lalla Fatima. Une question sur une épice, un temps de mijotage au tajine ou une astuce de cuisson ? Posez-moi votre question, je vous réponds tout de suite !",
      time: '14:30',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickQuestions = [
    "Sauce de tajine trop liquide ?",
    "Temps de cuisson de l'agneau au tajine ?",
    "Remplacer le smen sans trahir le goût ?",
    "Feuille de brick qui casse ou ramollit ?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    soundEngine.playClick();

    // Generate authentic chef response
    setTimeout(() => {
      let reply = "Pour sublimer ce plat, pensez à travailler à feu très doux et à laisser les sucs caraméliser avec les oignons sans brusquerie.";
      const lower = query.toLowerCase();

      if (lower.includes('liquide') || lower.includes('sauce')) {
        reply = "Chère amie, pour rattraper une sauce trop liquide : retirez les morceaux de viande pour ne pas les surcuire, et laissez bouillir le bouillon à découvert à feu moyen pendant 12 à 15 minutes. Les oignons vont compoter naturellement en une 'Daghmira' brillante sans jamais ajouter de farine !";
      } else if (lower.includes('temps') || lower.includes('agneau') || lower.includes('cuisson')) {
        reply = "Pour un agneau royal (épaule ou collier), comptez 1h30 à 1h45 à feu très doux sur diffuseur thermique. La viande est prête lorsqu'elle se détache sans effort à la fourchette en restant juteuse.";
      } else if (lower.includes('smen')) {
        reply = "Si vous n'avez pas de Smen (beurre rance marocain), utilisez du beurre doux de qualité que vous faites fondre avec une pincée de sel marin et une goutte d'huile d'olive de terroir. Cela apportera la rondeur nécessaire.";
      } else if (lower.includes('brick') || lower.includes('warqa') || lower.includes('pastilla')) {
        reply = "Pour que la warqa reste ultra croustillante : badigeonnez-la exclusivement avec du BEURRE CLARIFIÉ (Ghee) tiède sans petit-lait ! Et pressez bien votre garniture d'œufs au chinois pour chasser l'eau.";
      } else if (lower.includes('citron')) {
        reply = "Pour le citron confit beldi (M'ssir) : uniquement du gros sel de mer et du pur jus de citron frais dans un bocal hermétique, avec un filet d'huile d'olive en surface. Zéro eau !";
      } else if (lower.includes('the') || lower.includes('thé') || lower.includes('menthe')) {
        reply = "Pour le thé à la menthe : réservez le premier verre d'infusion ('l'âme du thé'), jetez le second verre pour éliminer l'amertume, puis versez d'au moins 40 cm de haut pour créer la mousse blanche 'Rezzat Al-Qadi'.";
      } else {
        reply = `Excellente question culinaire ! Dans la tradition marocaine, le secret réside dans le dosage des épices au mortier (safran pur de Taliouine, gingembre frais et cannelle) et la patience. Retrouvez aussi nos vidéos pas à pas dans l'onglet Recettes !`;
      }

      const chefMsg: Message = {
        id: `c-${Date.now()}`,
        sender: 'chef',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, chefMsg]);
      soundEngine.playTimerChime();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col h-[520px]">
        {/* Messenger Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-stone-950 p-1 flex items-center justify-center text-amber-300">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold">Chef Lalla Fatima</h3>
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-200 fill-current" />
              </div>
              <span className="text-[11px] text-amber-100 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                En ligne · Cuisinemarocbook
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F9FA]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-br-none'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1">
                {m.time}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-2 bg-stone-100/70 border-t border-stone-200 overflow-x-auto flex items-center gap-1.5">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[11px] font-medium bg-white hover:bg-amber-50 hover:text-amber-900 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              💬 {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Posez votre question à Chef Lalla Fatima..."
            className="flex-1 px-3.5 py-2 bg-stone-100 border border-transparent rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-full bg-amber-600 hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-xs transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
