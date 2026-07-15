/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { NotesScreen } from './components/NotesScreen';
import { CalculatorScreen } from './components/CalculatorScreen';
import { ClockScreen } from './components/ClockScreen';
import { DrawingScreen } from './components/DrawingScreen';
import { SpreadsheetScreen } from './components/SpreadsheetScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { GameScreen } from './components/GameScreen';

const AppWrapper = () => {
  const { state } = useApp();
  
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <div 
      className="min-h-screen transition-colors flex flex-col items-center sm:py-8 text-gray-900 dark:text-white"
      style={{
        backgroundColor: state.theme === 'dark' ? '#000000' : '#e5e7eb',
        backgroundImage: state.backgroundImage ? `url(${state.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: state.backgroundPosition,
        backgroundAttachment: 'fixed',
        color: state.theme === 'dark' ? '#ffffff' : '#000000'
      }}
    >
      <div className="z-10 w-full flex justify-center">
        {state.activeApp === 'notes' && <NotesScreen />}
        {state.activeApp === 'calculator' && <CalculatorScreen />}
        {state.activeApp === 'clock' && <ClockScreen />}
        {state.activeApp === 'drawing' && <DrawingScreen />}
        {state.activeApp === 'spreadsheet' && <SpreadsheetScreen />}
        {state.activeApp === 'calendar' && <CalendarScreen />}
        {state.activeApp === 'game' && <GameScreen />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppWrapper />
    </AppProvider>
  );
}

