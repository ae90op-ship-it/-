export type Theme = 'light' | 'dark';
export type Locale = 'ar' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 'hi' | 'tr' | 'nl' | 'pl' | 'sv' | 'vi' | 'th' | 'id' | 'uk' | 'fa' | 'ur' | 'bn' | 'sw' | 'ms' | 'el' | 'he' | 'da' | 'fi' | 'no' | 'cs' | 'hu' | 'ro' | 'sk';
export type AppType = 'notes' | 'calculator' | 'clock' | 'drawing' | 'spreadsheet' | 'calendar' | 'game';
export type NoteType = 'text' | 'todo' | 'drawing' | 'spreadsheet' | 'calculator' | 'calendar' | 'clock';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  type: NoteType;
  todos?: TodoItem[];
  color?: string;
}

export interface AppState {
  theme: Theme;
  locale: Locale;
  notes: Note[];
  searchQuery: string;
  backgroundImage: string | null;
  backgroundOpacity: number;
  backgroundPosition: string;
  activeApp: AppType;
  activeNote: Note | null;
}

export type Action =
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LOCALE'; payload: Locale }
  | { type: 'SET_BACKGROUND_IMAGE'; payload: string | null }
  | { type: 'SET_BACKGROUND_OPACITY'; payload: number }
  | { type: 'SET_BACKGROUND_POSITION'; payload: string }
  | { type: 'SET_ACTIVE_APP'; payload: AppType }
  | { type: 'SET_ACTIVE_NOTE'; payload: Note | null };

