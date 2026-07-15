import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft, ChevronLeft, ChevronRight, Save } from 'lucide-react';

export const CalendarScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = getT(state.locale);
  const [currentDate, setCurrentDate] = useState(new Date());

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
      content: `Selected Month: ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
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
      className={`relative flex flex-col w-full h-[100dvh] max-w-md mx-auto shadow-2xl overflow-hidden sm:h-auto sm:min-h-[800px] sm:rounded-[2.5rem] transition-colors ${state.theme === 'light' && !state.backgroundImage ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : ''}`}
      style={{
        backgroundColor: state.theme === 'dark' ? `rgba(9, 9, 11, ${state.backgroundOpacity / 100})` : (state.backgroundImage ? `rgba(255, 255, 255, ${state.backgroundOpacity / 100})` : undefined),
      }}
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
                  className={`aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
