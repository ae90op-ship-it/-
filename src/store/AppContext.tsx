import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Action, Note } from '../types';

const initialState: AppState = {
  theme: 'light',
  locale: 'ar',
  notes: [],
  searchQuery: '',
  backgroundImage: null,
  backgroundOpacity: 70,
  backgroundPosition: '50% 50%',
  activeApp: 'notes',
  activeNote: null,
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => note.id === action.payload.id ? action.payload : note)
      };
    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter(n => n.id !== action.payload) };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOCALE':
      return { ...state, locale: action.payload };
    case 'SET_BACKGROUND_IMAGE':
      return { ...state, backgroundImage: action.payload };
    case 'SET_BACKGROUND_OPACITY':
      return { ...state, backgroundOpacity: action.payload };
    case 'SET_BACKGROUND_POSITION':
      return { ...state, backgroundPosition: action.payload };
    case 'SET_ACTIVE_APP':
      return { ...state, activeApp: action.payload };
    case 'SET_ACTIVE_NOTE':
      return { ...state, activeNote: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedState = typeof window !== 'undefined' ? localStorage.getItem('notesState') : null;
  const parsedState = savedState ? JSON.parse(savedState) : null;
  
  const [state, dispatch] = useReducer(reducer, { 
    ...initialState, 
    notes: parsedState?.notes || [],
    theme: parsedState?.theme || 'light',
    locale: parsedState?.locale || 'ar',
    backgroundImage: parsedState?.backgroundImage || null,
    backgroundOpacity: parsedState?.backgroundOpacity ?? 70,
    backgroundPosition: parsedState?.backgroundPosition || 'center',
    activeApp: parsedState?.activeApp || 'notes'
  });

  useEffect(() => {
    try {
      localStorage.setItem('notesState', JSON.stringify({ 
        notes: state.notes, 
        theme: state.theme, 
        locale: state.locale,
        backgroundImage: state.backgroundImage,
        backgroundOpacity: state.backgroundOpacity,
        backgroundPosition: state.backgroundPosition,
        activeApp: state.activeApp
      }));
    } catch (e) {
      console.warn("Storage quota exceeded or error saving state");
    }

    
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.dir = state.locale === 'ar' ? 'rtl' : 'ltr';
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
