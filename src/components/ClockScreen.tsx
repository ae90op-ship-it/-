import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft, Play, Pause, Plus, MoreVertical, AlarmClock, Globe, Timer, Hourglass, Save } from 'lucide-react';

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
      className={`relative flex flex-col w-full h-[100dvh] max-w-md mx-auto shadow-2xl overflow-hidden sm:h-auto sm:min-h-[800px] sm:rounded-[2.5rem] transition-colors ${state.theme === 'light' && !state.backgroundImage ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : ''}`}
      style={{
        backgroundColor: state.theme === 'dark' ? `rgba(9, 9, 11, ${state.backgroundOpacity / 100})` : (state.backgroundImage ? `rgba(255, 255, 255, ${state.backgroundOpacity / 100})` : undefined),
        color: state.theme === 'dark' ? '#fff' : '#000'
      }}
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
          <button className="p-2 -mr-2 rounded-full opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10">
            <MoreVertical size={28} />
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
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins default
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <div className="flex flex-col h-full items-center justify-between p-6">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center">
           <div className="text-8xl font-light text-gray-900 dark:text-white tracking-widest tabular-nums" dir="ltr">
             {m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
           </div>
           <div className="flex gap-4 mt-8">
             <button onClick={() => {setTimeLeft(300); setIsRunning(false);}} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium">5m</button>
             <button onClick={() => {setTimeLeft(900); setIsRunning(false);}} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium">15m</button>
             <button onClick={() => {setTimeLeft(1500); setIsRunning(false);}} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium">25m</button>
           </div>
        </div>
      </div>
      <div className="mb-8 flex gap-6">
        <button onClick={() => {setTimeLeft(1500); setIsRunning(false);}} className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors">
          <Timer size={24} />
        </button>
        <button onClick={toggleTimer} className={`w-16 h-16 rounded-full ${isRunning ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'} flex items-center justify-center transition-colors`}>
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
        setTime(prev => prev + 10); // 10ms intervals
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${centi.toString().padStart(2, '0')}`;
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
        <div className="text-7xl sm:text-8xl font-light text-center my-12 tabular-nums tracking-tight text-gray-900 dark:text-white" dir="ltr">
          {formatTime(time)}
        </div>
        
        <div className="space-y-4 px-4 text-xl font-mono text-gray-500 dark:text-gray-400 overflow-y-auto max-h-[300px]" dir={isAr ? 'rtl' : 'ltr'}>
          {laps.map((lap, i) => (
            <div key={i} className="flex justify-between">
              <span>{(laps.length - i).toString().padStart(2, '0')}</span>
              <span className="opacity-70">+{formatTime(lap.lapTime)}</span>
              <span className="text-gray-900 dark:text-white font-medium">{formatTime(lap.overallTime)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-8 mb-8">
        <button onClick={handleLapReset} className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors">
          {isRunning ? <Timer size={24} fill="currentColor" /> : <Timer size={24} />}
        </button>
        <button onClick={handleStartStop} className={`w-16 h-16 rounded-full ${isRunning ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200' : 'bg-blue-100 dark:bg-zinc-800 hover:bg-blue-200 dark:hover:bg-zinc-700 text-blue-600 dark:text-blue-500'} flex items-center justify-center transition-colors`}>
          {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
      </div>
    </div>
  );
};

const WorldClockTab = ({ isAr }: { isAr: boolean }) => {
  const [now, setNow] = useState(new Date());

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
    const adjusted = new Date(d.getTime() + offsetHours * 3600000);
    const h = adjusted.getHours();
    const m = adjusted.getMinutes();
    const isPM = h >= 12;
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${isPM ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM')}`;
  };

  const formatDateStr = (d: Date, offsetHours = 0) => {
    const adjusted = new Date(d.getTime() + offsetHours * 3600000);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return adjusted.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', options);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-center mb-8">
        <div className="w-64 h-64 rounded-full border-2 border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 relative flex items-center justify-center">
          <div className="absolute inset-2 rounded-full flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="absolute w-full h-full text-center text-xl font-medium text-gray-400 dark:text-gray-300" style={{ transform: `rotate(${i * 30}deg)` }}>
                <span className="inline-block" style={{ transform: `rotate(-${i * 30}deg)` }}>{i === 0 ? 12 : i}</span>
              </div>
            ))}
          </div>
          <div className="absolute w-1.5 h-16 bg-gray-900 dark:bg-white rounded-full origin-bottom -translate-y-8" style={{ transform: `rotate(${hourDeg}deg)` }} />
          <div className="absolute w-1 h-20 bg-gray-900 dark:bg-white rounded-full origin-bottom -translate-y-10" style={{ transform: `rotate(${minDeg}deg)` }} />
          <div className="absolute w-0.5 h-24 bg-blue-500 rounded-full origin-bottom -translate-y-12" style={{ transform: `rotate(${secDeg}deg)` }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full absolute z-10" />
        </div>
      </div>
      
      <div className="text-center mb-10">
        <div className="text-4xl font-light tabular-nums text-gray-900 dark:text-white" dir="ltr">{formatTimeStr(now)}</div>
        <div className="text-gray-500 dark:text-gray-400 mt-2">{isAr ? `الوقت المحلي ${formatDateStr(now)}` : `Local time ${formatDateStr(now)}`}</div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-gray-100/80 dark:bg-zinc-800/80 p-5 rounded-3xl flex justify-between items-center text-gray-900 dark:text-white">
          <div>
            <div className="text-2xl font-bold mb-1">{isAr ? 'الرياض' : 'Riyadh'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{isAr ? `${formatDateStr(now, 0)} | نفس التوقيت المحلي` : `${formatDateStr(now, 0)} | Same time`}</div>
          </div>
          <div className="text-3xl font-light tabular-nums" dir="ltr">{formatTimeStr(now, 0)}</div>
        </div>
        <div className="bg-gray-100/80 dark:bg-zinc-800/80 p-5 rounded-3xl flex justify-between items-center text-gray-900 dark:text-white">
          <div>
            <div className="text-2xl font-bold mb-1">{isAr ? 'الجزائر' : 'Algiers'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{isAr ? `${formatDateStr(now, -2)} | -2 ساعات` : `${formatDateStr(now, -2)} | -2 hours`}</div>
          </div>
          <div className="text-3xl font-light tabular-nums" dir="ltr">{formatTimeStr(now, -2)}</div>
        </div>
      </div>
    </div>
  );
};

const AlarmTab = ({ isAr }: { isAr: boolean }) => {
  const [alarms, setAlarms] = useState([
    { id: 1, time: '08:30', period: 'AM', label: isAr ? 'يومي | تمارين' : 'Daily | Workout', active: true },
    { id: 2, time: '10:30', period: 'PM', label: isAr ? 'مرة' : 'Once', active: false },
  ]);

  const toggleAlarm = (id: number) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const addAlarm = () => {
    setAlarms([...alarms, { id: Date.now(), time: '07:00', period: 'AM', label: isAr ? 'تنبيه جديد' : 'New Alarm', active: true }]);
  };

  const activeCount = alarms.filter(a => a.active).length;

  return (
    <div className="flex flex-col h-full p-6 relative">
      <div className="mb-6">
        <h2 className="text-xl text-gray-800 dark:text-gray-200 font-medium">
          {isAr ? `${activeCount} منبهات مفعلة` : `${activeCount} active alarms`}
        </h2>
      </div>
      
      <div className="space-y-3 pb-20 overflow-y-auto">
        {alarms.map(alarm => (
          <div key={alarm.id} className={`bg-gray-100/80 dark:bg-zinc-800/80 p-5 rounded-3xl flex justify-between items-center transition-opacity ${!alarm.active ? 'opacity-50' : ''}`}>
            <div>
              <div className="text-4xl font-light tabular-nums mb-1 text-gray-900 dark:text-white" dir="ltr">{alarm.time} <span className="text-xl">{alarm.period}</span></div>
              <div className="text-gray-500 dark:text-gray-400">{alarm.label}</div>
            </div>
            <button 
              onClick={() => toggleAlarm(alarm.id)}
              className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors ${alarm.active ? 'bg-blue-500 justify-end' : 'bg-gray-300 dark:bg-zinc-600'}`}
            >
              <div className={`w-6 h-6 rounded-full shadow-sm ${alarm.active ? 'bg-white' : 'bg-gray-500 dark:bg-gray-400'}`} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-6 left-6 z-20">
        <button onClick={addAlarm} className="w-16 h-16 rounded-full bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-xl transition-transform active:scale-95">
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
};

