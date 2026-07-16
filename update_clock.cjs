const fs = require('fs');
let content = fs.readFileSync('src/components/ClockScreen.tsx', 'utf8');

// Update TimerTab
const oldTimerTab = /const TimerTab = \(\{ isAr \}: \{ isAr: boolean \}\) => \{[\s\S]*?return \([\s\S]*?<\/[a-zA-Z]+>\n  \);\n\};/m;
const newTimerTab = `const TimerTab = ({ isAr }: { isAr: boolean }) => {
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
                <input type="number" min="0" max="48" value={hours} onChange={e => {setHours(Math.min(48, Math.max(0, parseInt(e.target.value) || 0))); setTimeLeft(hours*3600+minutes*60+seconds);}} className="w-20 h-24 text-center text-4xl bg-gray-100 dark:bg-zinc-800 rounded-2xl outline-none" />
                <span className="text-sm mt-2 text-gray-500">h</span>
              </div>
              <span className="text-4xl">:</span>
              <div className="flex flex-col items-center">
                <input type="number" min="0" max="59" value={minutes} onChange={e => {setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0))); setTimeLeft(hours*3600+minutes*60+seconds);}} className="w-20 h-24 text-center text-4xl bg-gray-100 dark:bg-zinc-800 rounded-2xl outline-none" />
                <span className="text-sm mt-2 text-gray-500">m</span>
              </div>
              <span className="text-4xl">:</span>
              <div className="flex flex-col items-center">
                <input type="number" min="0" max="59" value={seconds} onChange={e => {setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0))); setTimeLeft(hours*3600+minutes*60+seconds);}} className="w-20 h-24 text-center text-4xl bg-gray-100 dark:bg-zinc-800 rounded-2xl outline-none" />
                <span className="text-sm mt-2 text-gray-500">s</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-6xl sm:text-7xl font-light text-gray-900 dark:text-white tracking-widest tabular-nums" dir="ltr">
             {h > 0 ? \`\${h.toString().padStart(2, '0')}:\` : ''}{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
          </div>
        )}
      </div>
      <div className="mb-8 flex gap-6">
        <button onClick={resetTimer} className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors">
          <Timer size={24} />
        </button>
        <button onClick={toggleTimer} disabled={hours === 0 && minutes === 0 && seconds === 0} className={\`w-16 h-16 rounded-full \${isRunning ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'} flex items-center justify-center transition-colors disabled:opacity-50\`}>
          {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
      </div>
    </div>
  );
};`;

content = content.replace(oldTimerTab, newTimerTab);

// Update StopwatchTab
const oldStopwatchTab = /const StopwatchTab = \(\{ isAr \}: \{ isAr: boolean \}\) => \{[\s\S]*?return \([\s\S]*?<\/[a-zA-Z]+>\n  \);\n\};/m;
const newStopwatchTab = `const StopwatchTab = ({ isAr }: { isAr: boolean }) => {
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
    if (hours > 0 || forceAll) timeString += \`\${hours.toString().padStart(2, '0')}:\`;
    if (min > 0 || hours > 0 || forceAll) timeString += \`\${min.toString().padStart(2, '0')}:\`;
    timeString += \`\${sec.toString().padStart((hours > 0 || min > 0 || forceAll) ? 2 : 1, '0')}.\${centi.toString().padStart(2, '0')}\`;
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
        <button onClick={handleStartStop} className={\`w-16 h-16 rounded-full \${isRunning ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'} flex items-center justify-center font-medium transition-colors\`}>
          {isRunning ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'بدء' : 'Start')}
        </button>
      </div>
    </div>
  );
};`;

content = content.replace(oldStopwatchTab, newStopwatchTab);

// Update WorldClockTab
const oldWorldClockTab = /const WorldClockTab = \(\{ isAr \}: \{ isAr: boolean \}\) => \{[\s\S]*?return \([\s\S]*?<\/[a-zA-Z]+>\n  \);\n\};/m;
const newWorldClockTab = `const ALL_CITIES = [
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
    return \`\${h12.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')} \${isPM ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM')}\`;
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
              <div key={i} className="absolute w-full h-full flex justify-center" style={{ transform: \`rotate(\${i * 30}deg)\` }}>
                <div className="w-1 h-3 bg-gray-300 dark:bg-zinc-600 rounded-full mt-1" />
              </div>
            ))}
          </div>
          <div className="absolute w-1.5 h-16 bg-gray-900 dark:bg-white rounded-full origin-bottom" style={{ transform: \`translateY(-50%) rotate(\${hourDeg}deg)\` }} />
          <div className="absolute w-1 h-20 bg-gray-600 dark:bg-gray-300 rounded-full origin-bottom" style={{ transform: \`translateY(-50%) rotate(\${minDeg}deg)\` }} />
          <div className="absolute w-0.5 h-20 bg-red-500 rounded-full origin-bottom" style={{ transform: \`translateY(-50%) rotate(\${secDeg}deg)\` }} />
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
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{isAr ? \`الفارق \${city.offset > 0 ? '+' : ''}\${city.offset} س\` : \`Offset \${city.offset > 0 ? '+' : ''}\${city.offset}h\`}</p>
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
};`;

content = content.replace(oldWorldClockTab, newWorldClockTab);

fs.writeFileSync('src/components/ClockScreen.tsx', content);
