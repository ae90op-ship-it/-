import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus, Search, Settings, Trash2, Edit3, X, Check, Circle, CheckCircle2, ListTodo, AlignLeft, Calculator, Clock, Table, CalendarDays, Palette, QrCode, FunctionSquare } from 'lucide-react';
import { Note } from '../types';
import { getT } from '../i18n';
import { SettingsModal } from './SettingsModal';

const AVAILABLE_TAGS = ['Work', 'Personal', 'Shopping', 'Ideas', 'Important'];

const getTagLabel = (tag: string, locale: string) => {
  const arLabels: Record<string, string> = {
    'Work': 'عمل',
    'Personal': 'شخصي',
    'Shopping': 'تسوق',
    'Ideas': 'أفكار',
    'Important': 'هام'
  };
  return locale === 'ar' ? (arLabels[tag] || tag) : tag;
};

const getTagColorClass = (tag: string) => {
  const colors: Record<string, string> = {
    'Work': 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
    'Personal': 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50',
    'Shopping': 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    'Ideas': 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
    'Important': 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
  };
  return colors[tag] || 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-zinc-700';
};

export const NotesScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedFilterTag, setSelectedFilterTag] = useState<string | null>(null);

  const t = getT(state.locale);

  const filteredNotes = state.notes.filter(note => {
    const query = state.searchQuery.toLowerCase();
    const matchesTitle = note.title.toLowerCase().includes(query);
    const matchesContent = note.content && note.content.toLowerCase().includes(query);
    const matchesTodos = note.todos?.some(todo => todo.text.toLowerCase().includes(query));
    const matchesQuery = matchesTitle || matchesContent || matchesTodos;
    
    if (!matchesQuery) return false;
    if (selectedFilterTag) {
      return note.tags?.includes(selectedFilterTag) || false;
    }
    return true;
  });

  const handleSave = () => {
    if (editingNote) {
      if (editingNote.id) {
        dispatch({ type: 'UPDATE_NOTE', payload: editingNote });
      } else {
        dispatch({ 
          type: 'ADD_NOTE', 
          payload: { ...editingNote, id: Date.now().toString(), timestamp: new Date().toISOString() } 
        });
      }
      setIsModalOpen(false);
      setEditingNote(null);
    }
  };

  const toggleTodoItem = (noteId: string, todoId: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note && note.todos) {
      const updatedTodos = note.todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t);
      dispatch({ type: 'UPDATE_NOTE', payload: { ...note, todos: updatedTodos } });
    }
  };

  return (
    <div 
      className={`relative flex flex-col w-full h-[100dvh] ${state.isComputerMode ? 'max-w-6xl' : 'max-w-md'} mx-auto shadow-2xl overflow-hidden sm:h-auto sm:min-h-[800px] sm:rounded-[2.5rem] transition-all duration-300 ${state.backgroundImage ? 'bg-white/80 dark:bg-black/80 backdrop-blur-sm' : (state.theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : 'bg-zinc-950')}`}
    >
      
      {/* Header */}
      <header className="px-6 pt-12 pb-4 z-10 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white drop-shadow-sm">{t.title}</h1>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
          >
            <Settings size={28} />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 rounded-2xl shadow-sm border border-black/5 dark:border-white/10">
          <div className="absolute inset-y-0 start-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 text-gray-500 dark:text-gray-400 ${state.locale === 'ar' ? 'mr-3' : 'ml-3'}`} />
          </div>
          <input
            type="text"
            className="block w-full bg-transparent border-0 py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 rounded-2xl transition-all"
            placeholder={t.search}
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
          />
        </div>

        {/* Tags Filter */}
        <div className="flex gap-2 overflow-x-auto py-1 hide-scrollbar items-center">
          <button
            onClick={() => setSelectedFilterTag(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 border ${
              selectedFilterTag === null
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white/60 dark:bg-zinc-900/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 border-black/5 dark:border-white/5'
            }`}
          >
            {state.locale === 'ar' ? 'الكل' : 'All'}
          </button>
          {AVAILABLE_TAGS.map(tag => {
            const isSelected = selectedFilterTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedFilterTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : `${getTagColorClass(tag)}`
                }`}
              >
                {getTagLabel(tag, state.locale)}
              </button>
            );
          })}
        </div>
      </header>

      <main className={`flex-1 overflow-y-auto px-6 pb-32 z-10 hide-scrollbar ${state.isComputerMode ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 space-y-0 content-start' : 'space-y-4'}`}>
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Edit3 size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-bold">{state.searchQuery ? t.search : t.empty}</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => {
                dispatch({ type: 'SET_ACTIVE_NOTE', payload: note });
                if (note.type === 'calculator') dispatch({ type: 'SET_ACTIVE_APP', payload: 'calculator' });
                else if (note.type === 'clock') dispatch({ type: 'SET_ACTIVE_APP', payload: 'clock' });
                else if (note.type === 'drawing') dispatch({ type: 'SET_ACTIVE_APP', payload: 'drawing' });
                else if (note.type === 'spreadsheet') dispatch({ type: 'SET_ACTIVE_APP', payload: 'spreadsheet' });
                else if (note.type === 'calendar') dispatch({ type: 'SET_ACTIVE_APP', payload: 'calendar' });
              }}
              className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-white/50 dark:border-white/10 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {note.title || 'بدون عنوان'}
                </h3>
                
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {note.tags.map(tag => (
                      <span 
                        key={tag} 
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getTagColorClass(tag)}`}
                      >
                        {getTagLabel(tag, state.locale)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {note.type === 'todo' && note.todos ? (
                <div className="space-y-2 mt-3">
                  {note.todos.slice(0, 3).map(todo => (
                    <div key={todo.id} className="flex items-center gap-2" onClick={(e) => { e.stopPropagation(); toggleTodoItem(note.id, todo.id); }}>
                      {todo.completed ? <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" /> : <Circle size={18} className="text-gray-400 flex-shrink-0" />}
                      <span className={`text-sm line-clamp-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                  {note.todos.length > 3 && <p className="text-xs text-gray-500 mt-1">+{note.todos.length - 3} more</p>}
                </div>
              ) : note.type === 'drawing' ? (
                <div className="mt-3 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-white">
                  <img src={note.content} alt="Drawing" className="w-full h-auto object-contain bg-white" />
                </div>
              ) : note.type === 'spreadsheet' ? (
                <div className="mt-3 text-xs font-mono text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
                  <div className="line-clamp-3 opacity-80 break-all">{note.content.substring(0, 100)}...</div>
                  <div className="mt-2 text-teal-600 dark:text-teal-400 font-semibold text-[10px] uppercase tracking-wider">Spreadsheet Data</div>
                </div>
              ) : note.type === 'calculator' ? (
                <div className="mt-3 text-lg font-mono font-medium text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  {note.content}
                </div>
              ) : note.type === 'calendar' ? (
                <div className="mt-3 text-sm font-medium text-gray-900 dark:text-white bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50 flex items-center gap-2">
                  <CalendarDays size={18} className="text-red-500" />
                  {note.content}
                </div>
              ) : note.type === 'clock' ? (
                <div className="mt-3 text-sm font-medium text-gray-900 dark:text-white bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2">
                  <Clock size={18} className="text-indigo-500" />
                  {note.content}
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              )}

              <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{new Date(note.timestamp).toLocaleDateString(state.locale === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'DELETE_NOTE', payload: note.id });
                  }}
                  className="p-2 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* FAB */}
      <button 
        onClick={() => setIsActionMenuOpen(true)}
        className="absolute bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 z-20"
        style={state.locale === 'ar' ? { right: 'auto', left: '2rem' } : {}}
      >
        <Plus size={32} />
      </button>

      {/* Action Menu Bottom Sheet */}
      {isActionMenuOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsActionMenuOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 rounded-t-3xl p-6 z-10 animate-in slide-in-from-bottom-full duration-300 shadow-2xl border-t border-gray-200 dark:border-zinc-800">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-700 rounded-full mx-auto mb-6" />
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setIsActionMenuOpen(false); setEditingNote({ id: '', title: '', content: '', timestamp: '', type: 'text', todos: [] }); setIsModalOpen(true); }}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center"><AlignLeft size={24} /></div>
                <span className="font-medium text-gray-900 dark:text-white">{t.addNote}</span>
              </button>
              <button 
                onClick={() => { setIsActionMenuOpen(false); setEditingNote({ id: '', title: '', content: '', timestamp: '', type: 'todo', todos: [] }); setIsModalOpen(true); }}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center"><ListTodo size={24} /></div>
                <span className="font-medium text-gray-900 dark:text-white">{t.addTodo}</span>
              </button>
              <button 
                onClick={() => { setIsActionMenuOpen(false); dispatch({ type: 'SET_ACTIVE_APP', payload: 'calculator' }); }}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-full flex items-center justify-center"><Calculator size={24} /></div>
                <span className="font-medium text-gray-900 dark:text-white">{t.calculator}</span>
              </button>
              <button 
                onClick={() => { setIsActionMenuOpen(false); dispatch({ type: 'SET_ACTIVE_APP', payload: 'clock' }); }}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-full flex items-center justify-center"><Clock size={24} /></div>
                <span className="font-medium text-gray-900 dark:text-white">{t.clock}</span>
              </button>
              <button 
                onClick={() => { setIsActionMenuOpen(false); dispatch({ type: 'SET_ACTIVE_APP', payload: 'drawing' }); }}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 rounded-full flex items-center justify-center"><Palette size={24} /></div>
                <span className="font-medium text-gray-900 dark:text-white">{t.drawing}</span>
              </button>
              <button 
                onClick={() => { setIsActionMenuOpen(false); dispatch({ type: 'SET_ACTIVE_APP', payload: 'spreadsheet' }); }}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 rounded-full flex items-center justify-center"><Table size={24} /></div>
                <span className="font-medium text-gray-900 dark:text-white">{t.spreadsheet}</span>
              </button>
              <button 
                onClick={() => { setIsActionMenuOpen(false); dispatch({ type: 'SET_ACTIVE_APP', payload: 'calendar' }); }}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full flex items-center justify-center"><CalendarDays size={24} /></div>
                <span className="font-medium text-gray-900 dark:text-white">{t.calendar}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Edit Modal */}
      {isModalOpen && editingNote && (
        <div className="absolute inset-0 z-50 flex flex-col bg-gray-50 dark:bg-zinc-950 animate-in slide-in-from-bottom-full duration-300">
          <header className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 shadow-sm z-20 border-b border-gray-200 dark:border-zinc-800">
            <button 
              onClick={() => { setIsModalOpen(false); setEditingNote(null); }}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={28} />
            </button>
            
{/* Removed Note Type Toggle */}

            <button 
              onClick={handleSave}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full font-medium transition-colors"
            >
              <Check size={28} />
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 z-10">
            <input
              type="text"
              placeholder={t.noteTitle}
              value={editingNote.title}
              onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              className="w-full text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-0 focus:ring-0 p-0 placeholder:text-gray-300 dark:placeholder:text-zinc-700 outline-none"
            />
            
            {/* Tag Selection */}
            <div className="flex flex-col gap-2 pb-2 border-b border-gray-200 dark:border-zinc-800">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {state.locale === 'ar' ? 'الوسوم (تصنيف)' : 'Tags (Categorize)'}
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => {
                  const isSelected = editingNote.tags?.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const currentTags = editingNote.tags || [];
                        const nextTags = isSelected
                          ? currentTags.filter(t => t !== tag)
                          : [...currentTags, tag];
                        setEditingNote({ ...editingNote, tags: nextTags });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : `${getTagColorClass(tag)} opacity-60 hover:opacity-100`
                      }`}
                    >
                      {getTagLabel(tag, state.locale)}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {editingNote.type === 'text' ? (
              <textarea
                placeholder={t.noteContent}
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                className="w-full flex-1 resize-none text-lg leading-relaxed text-gray-700 dark:text-gray-300 bg-transparent border-0 focus:ring-0 p-0 placeholder:text-gray-400 dark:placeholder:text-zinc-600 outline-none"
                autoFocus
              />
            ) : (
              <div className="flex-1 flex flex-col gap-3">
                {editingNote.todos?.map((todo, index) => (
                  <div key={todo.id} className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <button 
                      onClick={() => {
                        const newTodos = [...(editingNote.todos || [])];
                        newTodos[index].completed = !newTodos[index].completed;
                        setEditingNote({ ...editingNote, todos: newTodos });
                      }}
                      className="flex-shrink-0"
                    >
                      {todo.completed ? <CheckCircle2 size={24} className="text-green-500" /> : <Circle size={24} className="text-gray-300 dark:text-zinc-600" />}
                    </button>
                    <input
                      type="text"
                      value={todo.text}
                      onChange={(e) => {
                        const newTodos = [...(editingNote.todos || [])];
                        newTodos[index].text = e.target.value;
                        setEditingNote({ ...editingNote, todos: newTodos });
                      }}
                      className={`flex-1 bg-transparent border-0 focus:ring-0 p-0 text-lg outline-none ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}
                      placeholder={t.addTodo}
                      autoFocus={index === (editingNote.todos?.length || 0) - 1}
                    />
                    <button 
                      onClick={() => {
                        const newTodos = editingNote.todos?.filter((_, i) => i !== index);
                        setEditingNote({ ...editingNote, todos: newTodos });
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newTodos = [...(editingNote.todos || []), { id: Date.now().toString(), text: '', completed: false }];
                    setEditingNote({ ...editingNote, todos: newTodos });
                  }}
                  className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-medium p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors self-start"
                >
                  <Plus size={24} />
                  {t.addTodo}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
