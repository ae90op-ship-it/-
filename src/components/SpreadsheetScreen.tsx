import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft, Save } from 'lucide-react';

export const SpreadsheetScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = getT(state.locale);
  const [data, setData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state.activeNote && state.activeNote.type === 'spreadsheet') {
      try {
        const parsed = JSON.parse(state.activeNote.content);
        if (parsed) setData(parsed);
      } catch (e) {
        // Handle err
      }
    }
  }, [state.activeNote]);

  const cols = ['A', 'B', 'C', 'D'];
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleChange = (r: number, c: string, val: string) => {
    setData(prev => ({ ...prev, [`${c}${r}`]: val }));
  };

  const handleSave = () => {
    const payload = {
      id: state.activeNote ? state.activeNote.id : Date.now().toString(),
      title: state.activeNote ? state.activeNote.title : t.spreadsheet + ' - ' + new Date().toLocaleTimeString(),
      content: JSON.stringify(data),
      color: 'bg-teal-100',
      type: 'spreadsheet' as const,
      timestamp: Date.now().toString()
    };

    if (state.activeNote) {
      dispatch({ type: 'UPDATE_NOTE', payload });
    } else {
      dispatch({ type: 'ADD_NOTE', payload });
    }
    dispatch({ type: 'SET_ACTIVE_NOTE', payload: null });
    dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' });
  };

  return (
    <div 
      className={`relative flex flex-col w-full h-[100dvh] max-w-md mx-auto shadow-2xl overflow-hidden sm:h-auto sm:min-h-[800px] sm:rounded-[2.5rem] transition-colors ${state.theme === 'light' && !state.backgroundImage ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : ''}`}
      style={{
        backgroundColor: state.theme === 'dark' ? `rgba(9, 9, 11, ${state.backgroundOpacity / 100})` : (state.backgroundImage ? `rgba(255, 255, 255, ${state.backgroundOpacity / 100})` : undefined),
      }}
    >
      <header className="px-6 pt-12 pb-4 flex items-center justify-between z-10 bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center">
          <button 
            onClick={() => {
              dispatch({ type: 'SET_ACTIVE_NOTE', payload: null });
              dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' });
            }} 
            className="p-2 -ml-2 text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mx-2">{t.spreadsheet}</h1>
        </div>
        <button 
          onClick={handleSave}
          className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full transition-colors"
        >
          <Save size={24} />
        </button>
      </header>
      
      <div className="flex-1 overflow-auto z-10 p-2 text-gray-900 dark:text-white" dir="ltr">
        <div className="inline-block min-w-full rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-10 bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2"></th>
                {cols.map(c => (
                  <th key={c} className="bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2 font-semibold text-center min-w-[80px]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r}>
                  <td className="bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2 text-center text-gray-500 text-sm font-medium">
                    {r}
                  </td>
                  {cols.map(c => (
                    <td key={c} className="border-r border-b border-gray-200 dark:border-zinc-700 p-0 relative">
                      <input 
                        type="text" 
                        value={data[`${c}${r}`] || ''}
                        onChange={(e) => handleChange(r, c, e.target.value)}
                        className="w-full h-full p-2 bg-transparent border-none outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
