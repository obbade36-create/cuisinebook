import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { StoryItem, Recipe } from '../types/cuisine';
import { soundEngine } from '../utils/audioEffects';

interface StoriesBarProps {
  stories: StoryItem[];
  onSelectStory: (story: StoryItem) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  onSelectStory,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-3 shadow-xs mb-4">
      <div className="flex items-center gap-2 mb-2 px-1 text-xs font-bold text-stone-700">
        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
        <span>Stories & Directs des Maâlemat</span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => {
              onSelectStory(story);
              soundEngine.playClick();
            }}
            className="group relative flex-col h-36 w-24 rounded-xl overflow-hidden shrink-0 shadow-xs border border-amber-300/40 text-left transition-transform hover:scale-102 flex justify-between p-2"
          >
            {/* Story Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-b ${story.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
            
            {/* Top Avatar badge with play icon */}
            <div className="relative z-10 h-7 w-7 rounded-full bg-white/90 p-0.5 shadow-sm flex items-center justify-center text-xs">
              <span>{story.icon}</span>
            </div>

            {/* Bottom info */}
            <div className="relative z-10 text-white">
              <span className="text-[10px] text-amber-200 block font-medium">
                {story.tag}
              </span>
              <span className="text-xs font-bold leading-tight line-clamp-2 drop-shadow-sm">
                {story.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
