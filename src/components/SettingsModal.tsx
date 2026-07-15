import React, { useRef, useState } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { X, Moon, Sun, Image as ImageIcon, Trash2, Globe, Key, Settings } from 'lucide-react';
import { Locale } from '../types';

const ALL_LOCALES: Locale[] = ['ar', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'hi', 'tr', 'nl', 'pl', 'sv', 'vi', 'th', 'id', 'uk', 'fa', 'ur', 'bn', 'sw', 'ms', 'el', 'he', 'da', 'fi', 'no', 'cs', 'hu', 'ro', 'sk'];
const LOCALE_NAMES: Record<Locale, string> = {
  ar: 'العربية', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', pt: 'Português', ru: 'Русский', zh: '中文', ja: '日本語', ko: '한국어', hi: 'हिन्दी', tr: 'Türkçe', nl: 'Nederlands', pl: 'Polski', sv: 'Svenska', vi: 'Tiếng Việt', th: 'ไทย', id: 'Bahasa Indonesia', uk: 'Українська',
  fa: 'فارسی', ur: 'اردو', bn: 'বাংলা', sw: 'Kiswahili', ms: 'Bahasa Melayu', el: 'Ελληνικά', he: 'עברית', da: 'Dansk', fi: 'Suomi', no: 'Norsk', cs: 'Čeština', hu: 'Magyar', ro: 'Română', sk: 'Slovenčina'
};

const POSITIONS = [
  'top left', 'top', 'top right',
  'left', 'center', 'right',
  'bottom left', 'bottom', 'bottom right'
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [secretInput, setSecretInput] = useState('');
  const [unlockedCodes, setUnlockedCodes] = useState(false);
  const t = getT(state.locale);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSecretCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSecretInput(val);
    const engVal = val.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    if (engVal === '1234567890') {
      setUnlockedCodes(true);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950 text-black dark:text-white animate-in slide-in-from-bottom-full duration-300">
      <header className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-black dark:text-white">{t.settings}</h2>
        <button 
          onClick={onClose}
          className="p-2 text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={28} />
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
        
        {/* Background Image & Opacity */}
        <div className="space-y-4 bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-3xl border border-gray-200 dark:border-zinc-800/50">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-black dark:text-white flex items-center gap-2">
              <ImageIcon size={18} className="text-blue-600 dark:text-blue-500" />
              {t.background}
            </h3>
            <div className="flex gap-2 items-center">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <ImageIcon size={18} />
              </button>
              {state.backgroundImage && (
                <button 
                  onClick={() => dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: null })}
                  className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />

          {state.backgroundImage && (() => {
            let bgX = 50, bgY = 50;
            if (state.backgroundPosition && state.backgroundPosition.includes('%')) {
              const parts = state.backgroundPosition.split(' ');
              bgX = parseInt(parts[0]) || 50;
              bgY = parseInt(parts[1]) || 50;
            }
            return (
              <div className="flex flex-col gap-3 bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-black dark:text-gray-400 w-8">{t.opacity || 'Op'}</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={state.backgroundOpacity}
                    onChange={(e) => dispatch({ type: 'SET_BACKGROUND_OPACITY', payload: Number(e.target.value) })}
                    className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700 accent-blue-600"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-black dark:text-gray-400 w-8">X</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={bgX}
                    onChange={(e) => dispatch({ type: 'SET_BACKGROUND_POSITION', payload: `${e.target.value}% ${bgY}%` })}
                    className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700 accent-green-600 dark:accent-green-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-black dark:text-gray-400 w-8">Y</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={bgY}
                    onChange={(e) => dispatch({ type: 'SET_BACKGROUND_POSITION', payload: `${bgX}% ${e.target.value}%` })}
                    className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700 accent-purple-600 dark:accent-purple-500"
                  />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Theme Toggle */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
            {state.theme === 'dark' ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-orange-500" />}
            {t.theme}
          </h3>
          <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl border border-gray-200 dark:border-zinc-800">
            <button 
              onClick={() => dispatch({ type: 'SET_THEME', payload: 'light' })}
              className={`flex-1 py-3 text-center rounded-lg font-bold transition-all ${state.theme === 'light' ? 'bg-white text-black shadow-sm border border-gray-200' : 'text-gray-600 hover:text-black'}`}
            >
              {t.lightTheme}
            </button>
            <button 
              onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}
              className={`flex-1 py-3 text-center rounded-lg font-bold transition-all ${state.theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-gray-400 hover:text-white'}`}
            >
              {t.darkTheme}
            </button>
          </div>
        </div>

        {/* Language (Creative) */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
            <Globe size={20} className="text-green-600 dark:text-green-500" />
            {t.language}
          </h3>
          <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
            {ALL_LOCALES.map(loc => (
              <button 
                key={loc}
                onClick={() => dispatch({ type: 'SET_LOCALE', payload: loc })}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all border ${state.locale === loc ? 'bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500 shadow-md' : 'bg-gray-100 text-black border-gray-200 hover:bg-gray-200 dark:bg-zinc-900 dark:text-gray-300 dark:border-zinc-800 dark:hover:bg-zinc-800'}`}
              >
                {LOCALE_NAMES[loc]}
              </button>
            ))}
          </div>
        </div>

        {/* Secret Code Section */}
        <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-zinc-800/50">
          <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
            <Key size={20} className="text-purple-600 dark:text-purple-500" />
            {t.secretCode}
          </h3>
          <div className="flex gap-2">
            <input
              type="password"
              value={secretInput}
              onChange={handleSecretCode}
              placeholder="Enter code..."
              className="flex-1 min-w-0 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-black dark:text-white p-4 rounded-xl font-bold focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500"
            />
            <button
              onClick={() => {
                const engVal = secretInput.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
                if (engVal === '1234567890') setUnlockedCodes(true);
                else if (engVal === '11111') dispatch({ type: 'SET_ACTIVE_APP', payload: 'game' });
                else setSecretInput('');
              }}
              className="px-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl font-bold transition-colors shadow-sm"
            >
              Run
            </button>
          </div>
          {unlockedCodes && (
            <div className="mt-4 p-4 bg-purple-100 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-900/50 text-purple-900 dark:text-purple-300 text-sm space-y-2 font-mono">
              <p className="font-bold mb-2 uppercase tracking-widest text-xs opacity-75">Unlocked Features</p>
              <ul className="list-disc pl-4 space-y-1 font-semibold">
                <li>All languages unlocked.</li>
                <li>Advanced calculator functions active.</li>
                <li>Debug mode: ready.</li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
