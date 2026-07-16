import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft, Play, Pause, Plus, MoreVertical, AlarmClock, Globe, Timer, Hourglass, Save, Trash2, Check, X } from 'lucide-react';

export const ClockScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'alarm' | 'world' | 'stopwatch' | 'timer'>('timer');
  const t = getT(state.locale);

  // Tab texts based on Locale
  const isAr = state.locale === 'ar';
  const tabNames = {
    alarm: isAr ? 'المنبه' : 'Alarm',
    world: isAr ? 'الساعة العالمية' : 'World Clock',
    stopwatch: isAr ? 'ساعة الإيقاف' : 'Stopwatch',
    timer: isAr ? 'المؤقت' : 'Timer'
  };

  const handleSave = () => {
    const payload = {
      id: state.activeNote ? state.activeNote.id : Date.now().toString(),
      title: state.activeNote ? state.activeNote.title : t.clock + ' - ' + new Date().toLocaleTimeString(),
      content: `Saved at ${new Date().toLocaleTimeString()} - Current View: ${tabNames[activeTab]}`,
      color: 'bg-indigo-100',
      type: 'clock' as const,
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
      <header className="px-6 pt-12 pb-4 flex items-center justify-between z-10 text-gray-900 dark:text-white">
        <div className="flex items-center">
          <button 
            onClick={() => {
              dispatch({ type: 'SET_ACTIVE_NOTE', payload: null });
              dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' });
            }} 
            className="p-2 -ml-2 rounded-full transition-colors backdrop-blur-sm opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <ArrowLeft size={28} />
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSave} 
            className="p-2 rounded-full opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 text-indigo-600 dark:text-indigo-400"
          >
            <Save size={24} />
          </button>
          
        </div>
      </header>
      
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
        <div className="px-6 pb-6 text-gray-900 dark:text-white">
          <h1 className="text-4xl font-bold tracking-tight">{tabNames[activeTab]}</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'timer' && <TimerTab isAr={isAr} />}
          {activeTab === 'stopwatch' && <StopwatchTab isAr={isAr} />}
          {activeTab === 'world' && <WorldClockTab isAr={isAr} />}
          {activeTab === 'alarm' && <AlarmTab isAr={isAr} />}
        </div>
      </div>

      <div className="flex justify-around items-center py-3 pb-6 border-t border-gray-200 dark:border-white/10 z-10 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <TabButton id="timer" icon={<Hourglass size={24} />} label={tabNames.timer} active={activeTab === 'timer'} onClick={() => setActiveTab('timer')} />
        <TabButton id="stopwatch" icon={<Timer size={24} />} label={tabNames.stopwatch} active={activeTab === 'stopwatch'} onClick={() => setActiveTab('stopwatch')} />
        <TabButton id="world" icon={<Globe size={24} />} label={tabNames.world} active={activeTab === 'world'} onClick={() => setActiveTab('world')} />
        <TabButton id="alarm" icon={<AlarmClock size={24} />} label={tabNames.alarm} active={activeTab === 'alarm'} onClick={() => setActiveTab('alarm')} />
      </div>
    </div>
  );
};

const TabButton = ({ id, icon, label, active, onClick }: { id: string, icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}>
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const TimerTab = ({ isAr }: { isAr: boolean }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      alert(isAr ? 'انتهى المؤقت!' : 'Timer finished!');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (!isRunning) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (timeLeft === 0 || totalSeconds !== timeLeft) {
         setTimeLeft(Math.min(totalSeconds, 48 * 3600)); // Cap at 48 hours
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(hours * 3600 + minutes * 60 + seconds);
  };

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <div className="flex flex-col h-full items-center justify-between p-6">
      <div className="flex-1 flex items-center justify-center w-full">
        {!isRunning && timeLeft === (hours * 3600 + minutes * 60 + seconds) ? (
          <div className="flex flex-col items-center justify-center gap-6 w-full">
            <div className="flex gap-4 items-center" dir="ltr">
              <div className="flex flex-col items-center">
                <input type="number" min="0" max="48" value={hours} onChange={e => {
                  const val = Math.min(48, Math.max(0, parseInt(e.target.value) || 0));
                  setHours(val);
                  setTimeLeft(val * 3600 + minutes * 60 + seconds);
                }} className="w-20 h-24 text-center text-4xl bg-gray-100 dark:bg-zinc-800 rounded-2xl outline-none" />
                <span className="text-sm mt-2 text-gray-500">h</span>
              </div>
              <span className="text-4xl">:</span>
              <div className="flex flex-col items-center">
                <input type="number" min="0" max="59" value={minutes} onChange={e => {
                  const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                  setMinutes(val);
                  setTimeLeft(hours * 3600 + val * 60 + seconds);
                }} className="w-20 h-24 text-center text-4xl bg-gray-100 dark:bg-zinc-800 rounded-2xl outline-none" />
                <span className="text-sm mt-2 text-gray-500">m</span>
              </div>
              <span className="text-4xl">:</span>
              <div className="flex flex-col items-center">
                <input type="number" min="0" max="59" value={seconds} onChange={e => {
                  const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                  setSeconds(val);
                  setTimeLeft(hours * 3600 + minutes * 60 + val);
                }} className="w-20 h-24 text-center text-4xl bg-gray-100 dark:bg-zinc-800 rounded-2xl outline-none" />
                <span className="text-sm mt-2 text-gray-500">s</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-6xl sm:text-7xl font-light text-gray-900 dark:text-white tracking-widest tabular-nums" dir="ltr">
             {h > 0 ? `${h.toString().padStart(2, '0')}:` : ''}{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
          </div>
        )}
      </div>
      <div className="mb-8 flex gap-6">
        <button onClick={resetTimer} className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors">
          <Timer size={24} />
        </button>
        <button onClick={toggleTimer} disabled={hours === 0 && minutes === 0 && seconds === 0} className={`w-16 h-16 rounded-full ${isRunning ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'} flex items-center justify-center transition-colors disabled:opacity-50`}>
          {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
      </div>
    </div>
  );
};

const StopwatchTab = ({ isAr }: { isAr: boolean }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<{lapTime: number, overallTime: number}[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number, forceAll = false) => {
    const hours = Math.floor(ms / 3600000);
    const min = Math.floor((ms % 3600000) / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    
    let timeString = '';
    if (hours > 0 || forceAll) timeString += `${hours.toString().padStart(2, '0')}:`;
    if (min > 0 || hours > 0 || forceAll) timeString += `${min.toString().padStart(2, '0')}:`;
    timeString += `${sec.toString().padStart((hours > 0 || min > 0 || forceAll) ? 2 : 1, '0')}.${centi.toString().padStart(2, '0')}`;
    return timeString;
  };

  const handleStartStop = () => setIsRunning(!isRunning);
  
  const handleLapReset = () => {
    if (isRunning) {
      setLaps([{ lapTime: time - (laps[0]?.overallTime || 0), overallTime: time }, ...laps]);
    } else {
      setTime(0);
      setLaps([]);
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-between p-6">
      <div className="w-full flex-1">
        <div className="text-6xl sm:text-7xl font-light text-center my-12 tabular-nums tracking-tight text-gray-900 dark:text-white" dir="ltr">
          {formatTime(time)}
        </div>
        
        <div className="space-y-4 px-4 text-xl font-mono text-gray-500 dark:text-gray-400 overflow-y-auto max-h-[300px]" dir={isAr ? 'rtl' : 'ltr'}>
          {laps.map((lap, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
              <span>{isAr ? 'الدورة' : 'Lap'} {laps.length - i}</span>
              <div className="flex gap-4">
                <span className="text-gray-400 dark:text-zinc-600">+{formatTime(lap.lapTime)}</span>
                <span className="text-gray-900 dark:text-white">{formatTime(lap.overallTime)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8 flex gap-6 w-full justify-center">
        <button onClick={handleLapReset} className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium transition-colors">
          {isRunning ? (isAr ? 'دورة' : 'Lap') : (isAr ? 'إعادة' : 'Reset')}
        </button>
        <button onClick={handleStartStop} className={`w-16 h-16 rounded-full ${isRunning ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'} flex items-center justify-center font-medium transition-colors`}>
          {isRunning ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'بدء' : 'Start')}
        </button>
      </div>
    </div>
  );
};

const ALL_CITIES = [
  { id: '1', name: 'New York', nameAr: 'نيويورك', offset: -4 },
  { id: '2', name: 'London', nameAr: 'لندن', offset: 1 },
  { id: '3', name: 'Dubai', nameAr: 'دبي', offset: 4 },
  { id: '4', name: 'Tokyo', nameAr: 'طوكيو', offset: 9 },
  { id: '5', name: 'Paris', nameAr: 'باريس', offset: 2 },
  { id: '6', name: 'Sydney', nameAr: 'سيدني', offset: 10 },
  { id: '7', name: 'Cairo', nameAr: 'القاهرة', offset: 3 },
  { id: '8', name: 'Los Angeles', nameAr: 'لوس أنجلوس', offset: -7 },
];

const WorldClockTab = ({ isAr }: { isAr: boolean }) => {
  const [now, setNow] = useState(new Date());
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('worldClockCities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ALL_CITIES.slice(0, 4);
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('worldClockCities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minDeg = minutes * 6;
  const secDeg = seconds * 6;

  const formatTimeStr = (d: Date, offsetHours = 0) => {
    // Current UTC time
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const adjusted = new Date(utc + (3600000 * offsetHours));
    const h = adjusted.getHours();
    const m = adjusted.getMinutes();
    const s = adjusted.getSeconds();
    const isPM = h >= 12;
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ${isPM ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM')}`;
  };

  const formatDateStr = (d: Date, offsetHours = 0) => {
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const adjusted = new Date(utc + (3600000 * offsetHours));
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return adjusted.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', options);
  };

  return (
    <div className="flex flex-col h-full p-6 relative">
      <div className="flex justify-center mb-8 shrink-0">
        <div className="relative w-48 h-48 rounded-full border-[6px] border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center">
          <div className="absolute w-full h-full p-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="absolute w-full h-full flex justify-center" style={{ transform: `rotate(${i * 30}deg)` }}>
                <div className="w-1 h-3 bg-gray-300 dark:bg-zinc-600 rounded-full mt-1" />
              </div>
            ))}
          </div>
          <div className="absolute w-1.5 h-16 bg-gray-900 dark:bg-white rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${hourDeg}deg)` }} />
          <div className="absolute w-1 h-20 bg-gray-600 dark:bg-gray-300 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${minDeg}deg)` }} />
          <div className="absolute w-0.5 h-20 bg-red-500 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${secDeg}deg)` }} />
          <div className="absolute w-3 h-3 bg-red-500 rounded-full z-10" />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-xl font-bold">{isAr ? 'المدن' : 'Cities'}</h2>
         <button onClick={() => setIsAdding(true)} className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
            <Plus size={20} />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {cities.map((city: any) => (
          <div key={city.id} className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 relative group">
            <button 
              onClick={() => setCities((prev: any) => prev.filter((c: any) => c.id !== city.id))}
              className="absolute -left-2 -top-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isAr ? city.nameAr : city.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{isAr ? `الفارق ${city.offset > 0 ? '+' : ''}${city.offset} س` : `Offset ${city.offset > 0 ? '+' : ''}${city.offset}h`}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light text-gray-900 dark:text-white tracking-widest tabular-nums" dir="ltr">
                {formatTimeStr(now, city.offset)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatDateStr(now, city.offset)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="absolute inset-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm p-6 flex flex-col animate-in fade-in duration-200">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold">{isAr ? 'إضافة مدينة' : 'Add City'}</h2>
             <button onClick={() => setIsAdding(false)} className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800"><X size={20} /></button>
           </div>
           <div className="flex-1 overflow-y-auto space-y-2">
             {ALL_CITIES.filter(c => !cities.find((added: any) => added.id === c.id)).map(city => (
               <button 
                 key={city.id} 
                 onClick={() => { setCities((prev: any) => [...prev, city]); setIsAdding(false); }}
                 className="w-full text-left flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
               >
                 <span className="font-bold">{isAr ? city.nameAr : city.name}</span>
                 <span className="text-gray-500 text-sm" dir="ltr">UTC {city.offset > 0 ? '+' : ''}{city.offset}</span>
               </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

interface Alarm {
  id: string;
  time: string; // HH:mm
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  isActive: boolean;
}

const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_AR = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

const AlarmTab = ({ isAr }: { isAr: boolean }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('08:00');
  const [newDays, setNewDays] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('alarmsState');
    if (saved) {
      try { setAlarms(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('alarmsState', JSON.stringify(alarms));
  }, [alarms]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const handleAdd = () => {
    if (!newTime) return;
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: newTime,
      days: newDays,
      isActive: true,
    };
    setAlarms([...alarms, newAlarm]);
    setIsAdding(false);
    setNewTime('08:00');
    setNewDays([]);
  };

  const toggleDay = (d: number) => {
    if (newDays.includes(d)) {
      setNewDays(newDays.filter(day => day !== d));
    } else {
      setNewDays([...newDays, d].sort());
    }
  };

  const daysLabels = isAr ? DAYS_AR : DAYS_EN;

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <AlarmClock size={48} className="mb-4 opacity-20" />
            <p>{isAr ? 'لا توجد منبهات' : 'No alarms'}</p>
          </div>
        ) : (
          alarms.map(alarm => (
            <div key={alarm.id} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-black/5 dark:border-white/5 flex items-center justify-between transition-opacity" style={{ opacity: alarm.isActive ? 1 : 0.5 }}>
              <div>
                <div className="text-3xl font-mono font-light text-gray-900 dark:text-white mb-1">
                  {alarm.time}
                </div>
                <div className="flex gap-1">
                  {alarm.days.length === 0 ? (
                    <span className="text-xs text-gray-500">{isAr ? 'مرة واحدة' : 'Once'}</span>
                  ) : alarm.days.length === 7 ? (
                    <span className="text-xs text-gray-500">{isAr ? 'كل يوم' : 'Every day'}</span>
                  ) : (
                    alarm.days.map(d => (
                      <span key={d} className="text-xs text-blue-600 dark:text-blue-400">{daysLabels[d]}</span>
                    ))
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => deleteAlarm(alarm.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                  <Trash2 size={20} />
                </button>
                <button 
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${alarm.isActive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alarm.isActive ? (isAr ? '-translate-x-6' : 'translate-x-6') : (isAr ? '-translate-x-1' : 'translate-x-1')}`} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 pt-0 flex justify-center">
        <button 
          onClick={() => setIsAdding(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Plus size={28} />
        </button>
      </div>

      {isAdding && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="bg-white dark:bg-zinc-900 rounded-t-3xl p-6 z-30 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{isAr ? 'إضافة منبه' : 'Add Alarm'}</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="mb-6 flex justify-center">
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="text-4xl font-mono bg-transparent border-none focus:ring-0 text-center outline-none"
              />
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-3">{isAr ? 'تكرار' : 'Repeat'}</p>
              <div className="flex justify-between gap-1">
                {daysLabels.map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleDay(idx)}
                    className={`w-10 h-10 rounded-full text-xs font-medium flex items-center justify-center transition-colors ${newDays.includes(idx) ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'}`}
                  >
                    {label.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAdd}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              <Check size={20} />
              {isAr ? 'حفظ' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
