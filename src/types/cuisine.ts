export type RecipeCategory = 'all' | 'tajines' | 'couscous' | 'pastillas' | 'entrees' | 'patisseries' | 'soupes';

export type VideoActionType = 
  | 'marinade' 
  | 'simmer_tajine' 
  | 'caramelize' 
  | 'steam_couscous' 
  | 'fold_pastilla' 
  | 'roast_eggplant' 
  | 'shape_pastry' 
  | 'boil_tea'
  | 'slow_cook_tanjia';

export type AudioPreset = 'sizzle' | 'simmer' | 'steam' | 'boil' | 'whisk';

export interface RecipeStep {
  id: string;
  stepNumber: number;
  title: string;
  durationMinutes: number;
  description: string;
  chefSecret: string;
  ingredientsUsed: string[];
  videoActionType: VideoActionType;
  videoBgColor: string;
  videoSecondaryColor: string;
  accentColor: string;
  audioPreset: AudioPreset;
  keyAdvice: string;
}

export interface IngredientItem {
  name: string;
  amount: number;
  unit: string;
  note?: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: 'tajines' | 'couscous' | 'pastillas' | 'entrees' | 'patisseries' | 'soupes';
  origin: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Facile' | 'Moyen' | 'Expert';
  rating: number;
  reviewsCount: number;
  baseServings: number;
  description: string;
  ingredients: IngredientItem[];
  spicesSummary: string[];
  steps: RecipeStep[];
  traditionStory: string;
  drinkPairing: string;
  chefQuote: string;
  tags: string[];
  isFeatured?: boolean;
  dishColor: string;
  iconType: 'tajine' | 'couscous' | 'pastilla' | 'plate' | 'sweet' | 'soup';
}

export interface CulinaryTip {
  id: string;
  title: string;
  category: 'tajine' | 'epices' | 'semoule' | 'sauces' | 'patisserie' | 'the' | 'conservation';
  categoryLabel: string;
  summary: string;
  explanation: string;
  goldenRule: string;
  commonMistake: string;
  tags: string[];
  solvedProblem: string;
  likes: number;
  iconBg: string;
}

export interface PostComment {
  id: string;
  author: string;
  avatarText: string;
  avatarBg: string;
  timeAgo: string;
  text: string;
  likes: number;
  isChefReply?: boolean;
}

export interface FacebookPost {
  id: string;
  author: {
    name: string;
    handle: string;
    isVerified: boolean;
  };
  timestamp: string;
  content: string;
  recipeId?: string;
  tipId?: string;
  hasStepVideos: boolean;
  videoHighlightStep?: number;
  reactions: {
    likes: number;
    loves: number;
    wows: number;
    hungry: number;
  };
  commentsCount: number;
  sharesCount: number;
  userReaction?: 'like' | 'love' | 'wow' | 'hungry' | null;
  comments: PostComment[];
}

export interface StoryItem {
  id: string;
  title: string;
  tag: string;
  gradient: string;
  recipeId?: string;
  icon: string;
}
