import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft, ChevronLeft, ChevronRight, Save, Plus, Trash2 } from 'lucide-react';

export const CalendarScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = getT(state.locale);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (state.activeNote && state.activeNote.type === 'calendar') {
      try {
        const parsed = JSON.parse(state.activeNote.content);
        if (parsed.notes) {
          setNotes(parsed.notes);
        }
      } catch (e) {
        // Handle err
      }
    }
  }, [state.activeNote]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = state.locale === 'ar' 
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = state.locale === 'ar'
    ? ['أ', 'ث', 'أ', 'خ', 'ج', 'س', 'ح']
    : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handleSave = () => {
    const payload = {
      id: state.activeNote ? state.activeNote.id : Date.now().toString(),
      title: state.activeNote ? state.activeNote.title : t.calendar + ' - ' + new Date().toLocaleTimeString(),
      content: JSON.stringify({ notes }),
      color: 'bg-red-100',
      type: 'calendar' as const,
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
      <header className="px-6 pt-12 pb-4 flex items-center justify-between z-10">
        <div className="flex items-center">
          <button 
            onClick={() => {
              dispatch({ type: 'SET_ACTIVE_NOTE', payload: null });
              dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' });
            }} 
            className="p-2 -ml-2 text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
          >
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mx-2">{t.calendar}</h1>
        </div>
        <button 
          onClick={handleSave} 
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors backdrop-blur-sm"
        >
          <Save size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col z-10 p-6 pt-2">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200"><ChevronLeft size={20} /></button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={nextMonth} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200"><ChevronRight size={20} /></button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2" dir="ltr">
            {dayNames.map((day, i) => (
              <div key={i} className="text-center font-medium text-gray-400 text-sm py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2" dir="ltr">
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square relative flex items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer ${selectedDay === day ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500' : isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                >
                  {day}
                  {(notes[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`] && notes[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`].length > 0) && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500"></div>
                  )}
                  </div>
              );
            })}
          </div>
        </div>
        
        {selectedDay && (
          <div className="mt-4 flex-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col relative">
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {state.locale === 'ar' ? 'ملاحظات' : 'Notes'} - {selectedDay} {monthNames[currentDate.getMonth()]}
              </h3>
              <button 
                onClick={() => setNotes(prev => ({ ...prev, [`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`]: [...(prev[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`] || []), ''] }))}
                className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/40"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
              {!(notes[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`] && notes[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`].length > 0) ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  {state.locale === 'ar' ? 'لا توجد ملاحظات، اضغط + للإضافة' : 'No notes. Press + to add.'}
                </div>
              ) : (
                notes[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`].map((noteText, idx) => (
                  <div key={idx} className="relative bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-2 border border-gray-100 dark:border-zinc-800">
                    <textarea
                      dir={['ar', 'fa', 'ur', 'he'].includes(state.locale) ? 'rtl' : 'ltr'}
                      value={noteText}
                      onChange={e => {
                        const val = e.target.value;
                        setNotes(prev => {
                          const arr = [...(prev[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`] || [])];
                          arr[idx] = val;
                          return { ...prev, [`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`]: arr };
                        });
                      }}
                      className="w-full bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 text-sm p-1 min-h-[60px]"
                      placeholder={state.locale === 'ar' ? 'اكتب ملاحظة...' : 'Write note...'}
                    />
                    <button 
                      onClick={() => {
                        setNotes(prev => {
                          const arr = [...(prev[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`] || [])];
                          arr.splice(idx, 1);
                          return { ...prev, [`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`]: arr };
                        });
                      }}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-red-50 dark:bg-red-900/20 p-1 rounded-full"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
