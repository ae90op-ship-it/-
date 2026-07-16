import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { ArrowLeft, Coins, Keyboard, User, Coffee, UserCheck, Search, Bot, Zap, Server, Cpu, Rocket, Code2 } from 'lucide-react';

const UPGRADES = [
  { id: 'u1', name: 'Mechanical Keyboard', desc: 'Click Power +1', baseCost: 10, type: 'click', value: 1, icon: Keyboard, color: 'blue' },
  { id: 'u2', name: 'Junior Dev', desc: 'Auto +1/s', baseCost: 50, type: 'auto', value: 1, icon: User, color: 'green' },
  { id: 'u3', name: 'Coffee Machine', desc: 'Click Power +5', baseCost: 200, type: 'click', value: 5, icon: Coffee, color: 'amber' },
  { id: 'u4', name: 'Senior Dev', desc: 'Auto +10/s', baseCost: 500, type: 'auto', value: 10, icon: UserCheck, color: 'indigo' },
  { id: 'u5', name: 'Stack Overflow API', desc: 'Auto +25/s', baseCost: 2000, type: 'auto', value: 25, icon: Search, color: 'orange' },
  { id: 'u6', name: 'Copilot License', desc: 'Click +50', baseCost: 5000, type: 'click', value: 50, icon: Bot, color: 'purple' },
  { id: 'u7', name: '10x Developer', desc: 'Auto +100/s', baseCost: 15000, type: 'auto', value: 100, icon: Zap, color: 'yellow' },
  { id: 'u8', name: 'Server Farm', desc: 'Auto +500/s', baseCost: 50000, type: 'auto', value: 500, icon: Server, color: 'cyan' },
  { id: 'u9', name: 'AI Code Generator', desc: 'Click +1000', baseCost: 100000, type: 'click', value: 1000, icon: Cpu, color: 'pink' },
  { id: 'u10', name: 'Quantum Computer', desc: 'Auto +5000/s', baseCost: 500000, type: 'auto', value: 5000, icon: Rocket, color: 'red' },
];

export const GameScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const [score, setScore] = useState(0);
  const [upgrades, setUpgrades] = useState<Record<string, number>>({});

  const clickPower = 1 + UPGRADES.filter(u => u.type === 'click').reduce((sum, u) => sum + (upgrades[u.id] || 0) * u.value, 0);
  const autoPower = UPGRADES.filter(u => u.type === 'auto').reduce((sum, u) => sum + (upgrades[u.id] || 0) * u.value, 0);

  useEffect(() => {
    if (autoPower > 0) {
      const interval = setInterval(() => {
        setScore(s => s + autoPower);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoPower]);

  const handleBuy = (id: string, baseCost: number) => {
    const qty = upgrades[id] || 0;
    const cost = Math.floor(baseCost * Math.pow(1.5, qty));
    if (score >= cost) {
      setScore(s => s - cost);
      setUpgrades(prev => ({ ...prev, [id]: qty + 1 }));
    }
  };

  return (
    <div className={`relative flex flex-col w-full h-[100dvh] ${state.isComputerMode ? 'max-w-6xl' : 'max-w-md'} mx-auto shadow-2xl overflow-hidden sm:h-auto sm:min-h-[800px] sm:rounded-[2.5rem] transition-all duration-300 ${state.backgroundImage ? 'bg-white/80 dark:bg-black/80 backdrop-blur-sm' : (state.theme === 'light' ? 'bg-gradient-to-br from-yellow-50 via-white to-orange-50 text-gray-900' : 'bg-zinc-950 text-white')}`}>
      <header className="px-6 pt-12 pb-2 flex items-center justify-between z-10 bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <button onClick={() => dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' })} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-2xl font-bold">Endless Dev</h1>
        <div className="w-12"></div>
      </header>
      
      <div className="flex-1 flex flex-col items-center pt-4 pb-0 text-center relative z-10 overflow-hidden">
        <div className="text-6xl font-bold flex items-center justify-center gap-3 text-yellow-600 dark:text-yellow-400 mb-2 tabular-nums">
          <Coins size={48} /> {Math.floor(score)}
        </div>
        
        <div className="flex gap-4 text-sm font-medium opacity-75 mb-6">
          <div className="bg-black/5 dark:bg-white/10 px-4 py-1.5 rounded-full">{clickPower} per click</div>
          <div className="bg-black/5 dark:bg-white/10 px-4 py-1.5 rounded-full">{autoPower} per sec</div>
        </div>
        
        <button 
          onClick={() => setScore(s => s + clickPower)} 
          className="w-40 h-40 bg-orange-500 hover:bg-orange-600 rounded-full text-white shadow-xl active:scale-95 transition-transform flex items-center justify-center mb-8 border-4 border-orange-400/50 flex-shrink-0"
        >
           <Code2 size={64} />
        </button>

        <div className="w-full flex-1 overflow-y-auto px-6 pb-6 space-y-3 hide-scrollbar">
          {UPGRADES.map(u => {
            const qty = upgrades[u.id] || 0;
            const cost = Math.floor(u.baseCost * Math.pow(1.5, qty));
            const canAfford = score >= cost;
            const Icon = u.icon;
            
            return (
              <button 
                key={u.id}
                disabled={!canAfford}
                onClick={() => handleBuy(u.id, u.baseCost)}
                className={`w-full p-4 rounded-2xl backdrop-blur shadow-sm flex justify-between items-center transition-all ${canAfford ? 'bg-white/90 dark:bg-zinc-900/90 active:scale-[0.98]' : 'bg-white/50 dark:bg-zinc-900/50 opacity-60'}`}
              >
                <div className="text-left flex gap-3 items-center">
                  <div className={`p-2 rounded-xl flex items-center justify-center text-white bg-${u.color}-500 shadow-sm`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {u.name} <span className="text-xs bg-black/10 dark:bg-white/20 px-2 py-0.5 rounded-full">Lvl {qty}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{u.desc}</div>
                  </div>
                </div>
                <div className={`font-bold text-lg flex items-center gap-1 ${canAfford ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}>
                  <Coins size={16}/> {cost}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
