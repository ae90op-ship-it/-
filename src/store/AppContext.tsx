/**
 * AppContext provides the global state and dispatch for the application.
 * It handles the persistence of user preferences and notes to localStorage,
 * and manages the application's UI theme and localization direction.
 */
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { AppState, Action, Note, AppType, Theme, Locale } from '../types';

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
  isComputerMode: false,
};

/**
 * Main reducer for the application state.
 * @param state Current application state
 * @param action Action to dispatch
 * @returns New application state
 */
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
    case 'SET_COMPUTER_MODE':
      return { ...state, isComputerMode: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

/**
 * AppProvider wraps the application and provides the global state context.
 * It initializes state from localStorage and syncs state changes back to localStorage with a debounce.
 * @param children React nodes to render within the provider
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let parsedState = null;
  if (typeof window !== 'undefined') {
    try {
      const savedState = localStorage.getItem('notesState');
      if (savedState) {
        parsedState = JSON.parse(savedState);
      }
    } catch (e) {
      console.warn("Error parsing saved state from localStorage", e);
    }
  }

  const validApps = ['notes', 'calculator', 'clock', 'drawing', 'spreadsheet', 'calendar', 'game'];
  const isValidApp = (app: any): app is AppType => validApps.includes(app);

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    notes: Array.isArray(parsedState?.notes) ? parsedState.notes : [],
    theme: (parsedState?.theme as Theme) || 'light',
    locale: (parsedState?.locale as Locale) || 'ar',
    backgroundImage: typeof parsedState?.backgroundImage === 'string' ? parsedState.backgroundImage : null,
    backgroundOpacity: typeof parsedState?.backgroundOpacity === 'number' ? parsedState.backgroundOpacity : 70,
    backgroundPosition: typeof parsedState?.backgroundPosition === 'string' ? parsedState.backgroundPosition : '50% 50%',
    activeApp: isValidApp(parsedState?.activeApp) ? parsedState.activeApp : 'notes',
    isComputerMode: typeof parsedState?.isComputerMode === 'boolean' ? parsedState.isComputerMode : false
  });

  // Save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('notesState', JSON.stringify({
          notes: state.notes,
          theme: state.theme,
          locale: state.locale,
          backgroundImage: state.backgroundImage,
          backgroundOpacity: state.backgroundOpacity,
          backgroundPosition: state.backgroundPosition,
          activeApp: state.activeApp,
          isComputerMode: state.isComputerMode
        }));
      } catch (e) {
        console.warn("Storage quota exceeded or error saving state");
      }
    }, 500); // debounce save
    return () => clearTimeout(timeoutId);
  }, [
    state.notes,
    state.theme,
    state.locale,
    state.backgroundImage,
    state.backgroundOpacity,
    state.backgroundPosition,
    state.activeApp,
    state.isComputerMode
  ]);

  // Handle document classes (dir and theme)
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.dir = state.locale === 'ar' ? 'rtl' : 'ltr';
  }, [state.theme, state.locale]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook to access the application state and dispatch function.
 * @throws Will throw an error if used outside of an AppProvider.
 * @returns Context containing state and dispatch.
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
