import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft, Delete, Settings, Save, History } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export const CalculatorScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = getT(state.locale);
  
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{expr: string, res: string}[]>([]);

  useEffect(() => {
    if (state.activeNote && state.activeNote.type === 'calculator') {
      const parts = state.activeNote.content.split(' = ');
      if (parts.length === 2) {
        setExpression(parts[0]);
        setResult(parts[1]);
      } else {
        setExpression(state.activeNote.content);
        setResult('');
      }
    }
  }, [state.activeNote]);

  const handleInput = (val: string) => {
    setExpression(prev => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
      if (!sanitized) return;
      const res = new Function(`return ${sanitized}`)();
      setResult(String(res));
      setHistory(prev => [{ expr: expression, res: String(res) }, ...prev].slice(0, 20));
    } catch (e) {
      setResult('Error');
    }
  };

  const handleSave = () => {
    const payload = {
      id: state.activeNote ? state.activeNote.id : Date.now().toString(),
      title: state.activeNote ? state.activeNote.title : t.calculator + ' - ' + new Date().toLocaleTimeString(),
      content: `${expression} = ${result}`,
      color: 'bg-blue-100',
      type: 'calculator' as const,
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

  const buttons = [
    { label: 'C', action: handleClear, type: 'action' },
    { label: 'DEL', action: handleDelete, type: 'action' },
    { label: '%', action: () => handleInput('%'), type: 'op' },
    { label: '÷', action: () => handleInput('÷'), type: 'op' },
    { label: '7', action: () => handleInput('7'), type: 'num' },
    { label: '8', action: () => handleInput('8'), type: 'num' },
    { label: '9', action: () => handleInput('9'), type: 'num' },
    { label: '×', action: () => handleInput('×'), type: 'op' },
    { label: '4', action: () => handleInput('4'), type: 'num' },
    { label: '5', action: () => handleInput('5'), type: 'num' },
    { label: '6', action: () => handleInput('6'), type: 'num' },
    { label: '-', action: () => handleInput('-'), type: 'op' },
    { label: '1', action: () => handleInput('1'), type: 'num' },
    { label: '2', action: () => handleInput('2'), type: 'num' },
    { label: '3', action: () => handleInput('3'), type: 'num' },
    { label: '+', action: () => handleInput('+'), type: 'op' },
    { label: '00', action: () => handleInput('00'), type: 'num' },
    { label: '0', action: () => handleInput('0'), type: 'num' },
    { label: '.', action: () => handleInput('.'), type: 'num' },
    { label: '=', action: handleCalculate, type: 'calc' },
  ];

  return (
    <div 
      className={`relative flex flex-col w-full h-[100dvh] max-w-md mx-auto shadow-2xl overflow-hidden sm:h-auto sm:min-h-[800px] sm:rounded-[2.5rem] transition-colors ${state.theme === 'light' && !state.backgroundImage ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : ''}`}
      style={{
        backgroundColor: state.theme === 'dark' ? `rgba(9, 9, 11, ${state.backgroundOpacity / 100})` : (state.backgroundImage ? `rgba(255, 255, 255, ${state.backgroundOpacity / 100})` : undefined),
      }}
    >
      <header className="px-4 sm:px-6 pt-10 sm:pt-12 pb-2 flex items-center justify-between z-10">
        <div className="flex items-center">
          <button 
            onClick={() => {
              dispatch({ type: 'SET_ACTIVE_NOTE', payload: null });
              dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' });
            }} 
            className="p-2 text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
          >
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mx-2 sm:mx-4">{t.calculator}</h1>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-full transition-colors ${showHistory ? 'text-white bg-blue-500' : 'text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10'}`}
          >
            <History size={24} />
          </button>
          <button 
            onClick={handleSave}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
          >
            <Save size={24} />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
          >
            <Settings size={26} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-end p-4 sm:p-6 z-10 calculator-container relative">
        {showHistory && (
          <div className="absolute top-0 left-0 right-0 bottom-full h-full mb-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl p-4 overflow-y-auto flex flex-col gap-3 border border-gray-200 dark:border-zinc-800 shadow-lg z-20 transition-all">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">History</h3>
            {history.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No history yet.</p>
            ) : (
              history.map((item, idx) => (
                <button key={idx} onClick={() => { setExpression(item.expr); setResult(item.res); setShowHistory(false); }} className="text-right p-3 bg-gray-50 dark:bg-black/20 rounded-xl hover:bg-gray-100 dark:hover:bg-black/40 transition-colors">
                  <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">{item.expr}</div>
                  <div className="text-gray-900 dark:text-white font-bold text-lg">{item.res}</div>
                </button>
              ))
            )}
          </div>
        )}

        <div className="flex flex-col items-end justify-end mb-4 sm:mb-8 min-h-[100px] sm:min-h-[120px] break-all w-full text-right px-2">
          <div className="text-gray-500 dark:text-gray-400 text-xl sm:text-3xl tracking-wider mb-1 sm:mb-2 font-mono w-full">{expression}</div>
          <div className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 dark:text-white w-full">{result}</div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-white/40 dark:bg-black/20 p-3 sm:p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-zinc-800">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className={`h-14 sm:h-16 text-lg sm:text-2xl font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center
                ${btn.type === 'num' ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm border border-gray-100 dark:border-zinc-700' : ''}
                ${btn.type === 'action' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 shadow-sm' : ''}
                ${btn.type === 'op' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 shadow-sm' : ''}
                ${btn.type === 'calc' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : ''}
              `}
            >
              {btn.label === 'DEL' ? <Delete size={20} className="sm:w-6 sm:h-6" /> : btn.label}
            </button>
          ))}
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
