import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft, Save, Plus, Minus, Settings2, X, Trash2, Layers } from 'lucide-react';

export const SpreadsheetScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = getT(state.locale);
  const [sheets, setSheets] = useState<any[]>([{ id: '1', name: 'Sheet 1', data: {}, numCols: 4, numRows: 10, rowHeights: {}, colWidths: {} }]);
  const [activeSheetId, setActiveSheetId] = useState('1');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [activeCol, setActiveCol] = useState<string | null>(null);

  useEffect(() => {
    if (state.activeNote && state.activeNote.type === 'spreadsheet') {
      try {
        const parsed = JSON.parse(state.activeNote.content);
        if (parsed.sheets) {
          setSheets(parsed.sheets);
          setActiveSheetId(parsed.sheets[0]?.id || '1');
        } else if (parsed.cells) {
          // migrate old data
          setSheets([{ id: '1', name: 'Sheet 1', data: parsed.cells, numCols: parsed.cols || 4, numRows: parsed.rows || 10, rowHeights: parsed.rowHeights || {}, colWidths: parsed.colWidths || {} }]);
          setActiveSheetId('1');
        }
      } catch (e) {}
    }
  }, [state.activeNote]);

  const currentSheet = sheets.find(s => s.id === activeSheetId) || sheets[0];
  const { data, numCols, numRows, rowHeights, colWidths } = currentSheet;

  const updateCurrentSheet = (updates: any) => {
    setSheets(prev => prev.map(s => s.id === activeSheetId ? { ...s, ...updates } : s));
  };
  const setData = (newData: any) => updateCurrentSheet({ data: typeof newData === 'function' ? newData(data) : newData });
  const setNumCols = (newCols: any) => updateCurrentSheet({ numCols: typeof newCols === 'function' ? newCols(numCols) : newCols });
  const setNumRows = (newRows: any) => updateCurrentSheet({ numRows: typeof newRows === 'function' ? newRows(numRows) : newRows });
  const setRowHeights = (newHeights: any) => updateCurrentSheet({ rowHeights: typeof newHeights === 'function' ? newHeights(rowHeights) : newHeights });
  const setColWidths = (newWidths: any) => updateCurrentSheet({ colWidths: typeof newWidths === 'function' ? newWidths(colWidths) : newWidths });


  const cols = Array.from({ length: numCols }, (_, i) => {
    let c = '';
    let n = i;
    while (n >= 0) {
      c = String.fromCharCode(65 + (n % 26)) + c;
      n = Math.floor(n / 26) - 1;
    }
    return c;
  });
  const rows = Array.from({ length: numRows }, (_, i) => i + 1);

  const handleChange = (r: number, c: string, val: string) => {
    setData(prev => ({ ...prev, [`${c}${r}`]: val }));
  };

  const handleSave = () => {
    const payload = {
      id: state.activeNote ? state.activeNote.id : Date.now().toString(),
      title: state.activeNote ? state.activeNote.title : t.spreadsheet + ' - ' + new Date().toLocaleTimeString(),
      content: JSON.stringify({ sheets }),
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
      className={`relative flex flex-col w-full h-[100dvh] ${state.isComputerMode ? 'max-w-6xl' : 'max-w-md'} mx-auto shadow-2xl overflow-hidden sm:h-auto sm:min-h-[800px] sm:rounded-[2.5rem] transition-all duration-300 ${state.backgroundImage ? 'bg-white/80 dark:bg-black/80 backdrop-blur-sm' : (state.theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : 'bg-zinc-950')}`}
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
        <div className="flex gap-1">
          <button 
            onClick={() => {
              const newId = Date.now().toString();
              setSheets(prev => [...prev, { id: newId, name: `Sheet ${prev.length + 1}`, data: {}, numCols: 4, numRows: 10, rowHeights: {}, colWidths: {} }]);
              setActiveSheetId(newId);
            }}
            className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
          >
            <Layers size={24} />
          </button>
          <button 
            onClick={() => {
              if (sheets.length > 1) {
                setSheets(prev => prev.filter(s => s.id !== activeSheetId));
                setActiveSheetId(sheets.find(s => s.id !== activeSheetId)?.id || sheets[0].id);
              } else {
                updateCurrentSheet({ data: {} });
              }
            }}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
          >
            <Trash2 size={24} />
          </button>
          <button 
            onClick={() => setIsOptionsOpen(true)}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings2 size={24} />
          </button>
          <button 
            onClick={handleSave}
            className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full transition-colors"
          >
            <Save size={24} />
          </button>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto z-10 p-2 text-gray-900 dark:text-white" dir="ltr">


      {sheets.length > 1 && (
        <div className="z-20 bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 flex overflow-x-auto" dir="ltr">
          {sheets.map(s => (
            <button 
              key={s.id} 
              onClick={() => setActiveSheetId(s.id)}
              className={`px-4 py-2 font-semibold text-sm whitespace-nowrap border-r border-gray-200 dark:border-zinc-800 ${activeSheetId === s.id ? 'bg-white dark:bg-zinc-800 text-teal-600' : 'text-gray-500 hover:bg-white/50 dark:hover:bg-zinc-800/50'}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      {activeRow !== null && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 rounded-2xl p-2 flex gap-2">
          <button onClick={() => setRowHeights(prev => ({ ...prev, [activeRow]: (prev[activeRow] || 40) + 10 }))} className="p-2 bg-gray-100 dark:bg-zinc-700 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-600"><Plus size={16} /></button>
          <span className="flex items-center px-2 text-sm font-bold">{state.locale === 'ar' ? 'تغيير حجم الصف ' + activeRow.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]) : 'Row ' + activeRow}</span>
          <button onClick={() => setRowHeights(prev => ({ ...prev, [activeRow]: Math.max(20, (prev[activeRow] || 40) - 10) }))} className="p-2 bg-gray-100 dark:bg-zinc-700 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-600"><Minus size={16} /></button>
          <button onClick={() => setActiveRow(null)} className="p-2 ml-2 bg-red-100 text-red-600 dark:bg-red-900/30 rounded-xl hover:bg-red-200"><X size={16} /></button>
        </div>
      )}
      {activeCol !== null && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 rounded-2xl p-2 flex gap-2">
          <button onClick={() => setColWidths(prev => ({ ...prev, [activeCol]: (prev[activeCol] || 80) + 20 }))} className="p-2 bg-gray-100 dark:bg-zinc-700 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-600"><Plus size={16} /></button>
          <span className="flex items-center px-2 text-sm font-bold">{state.locale === 'ar' ? 'تغيير عرض العمود ' + activeCol : 'Col ' + activeCol}</span>
          <button onClick={() => setColWidths(prev => ({ ...prev, [activeCol]: Math.max(40, (prev[activeCol] || 80) - 20) }))} className="p-2 bg-gray-100 dark:bg-zinc-700 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-600"><Minus size={16} /></button>
          <button onClick={() => setActiveCol(null)} className="p-2 ml-2 bg-red-100 text-red-600 dark:bg-red-900/30 rounded-xl hover:bg-red-200"><X size={16} /></button>
        </div>
      )}
      <div className="inline-block min-w-full rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-10 bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2"></th>
                {cols.map(c => (
                  <th 
                    key={c} 
                    onClick={() => setActiveCol(activeCol === c ? null : c)}
                    className={`bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2 font-semibold text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 ${activeCol === c ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : ''}`}
                    style={{ minWidth: colWidths[c] || 80, width: colWidths[c] || 80 }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r} style={{ height: rowHeights[r] || 'auto' }}>
                  <td 
                    onClick={() => setActiveRow(activeRow === r ? null : r)}
                    className={`bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2 text-center text-gray-500 text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors ${activeRow === r ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : ''}`}
                  >
                    {state.locale === 'ar' ? r.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]) : r}
                  </td>
                  {cols.map(c => (
                    <td key={c} className="border-r border-b border-gray-200 dark:border-zinc-700 p-0 relative">
                      <textarea 
                         
                        value={data[`${c}${r}`] || ''}
                        onChange={(e) => handleChange(r, c, e.target.value)}
                        className="w-full h-full p-2 bg-transparent border-none outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm resize-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isOptionsOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOptionsOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 rounded-t-3xl p-6 z-10 animate-in slide-in-from-bottom-full duration-300 shadow-2xl border-t border-gray-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{t.settings}</h3>
              <button onClick={() => setIsOptionsOpen(false)} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setNumRows(prev => prev + 1)} className="flex items-center justify-center gap-2 p-4 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-xl font-bold hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors">
                <Plus size={20} /> Row
              </button>
              <button onClick={() => setNumRows(prev => Math.max(1, prev - 1))} className="flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                <Minus size={20} /> Row
              </button>
              <button onClick={() => setNumCols(prev => prev + 1)} className="flex items-center justify-center gap-2 p-4 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-xl font-bold hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors">
                <Plus size={20} /> Col
              </button>
              <button onClick={() => setNumCols(prev => Math.max(1, prev - 1))} className="flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                <Minus size={20} /> Col
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
