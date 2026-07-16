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
import { QrScreen } from './components/QrScreen';
import { SciCalcScreen } from './components/SciCalcScreen';
import { AnimatePresence, motion } from 'motion/react';

const AppWrapper = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use Alt + 1..7 for switching apps
      if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        switch (e.key) {
          case '1': dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' }); break;
          case '2': dispatch({ type: 'SET_ACTIVE_APP', payload: 'calculator' }); break;
          case '3': dispatch({ type: 'SET_ACTIVE_APP', payload: 'clock' }); break;
          case '4': dispatch({ type: 'SET_ACTIVE_APP', payload: 'drawing' }); break;
          case '5': dispatch({ type: 'SET_ACTIVE_APP', payload: 'spreadsheet' }); break;
          case '6': dispatch({ type: 'SET_ACTIVE_APP', payload: 'calendar' }); break;
          case '7': dispatch({ type: 'SET_ACTIVE_APP', payload: 'game' }); break;
          case '8': dispatch({ type: 'SET_ACTIVE_APP', payload: 'qr' }); break;
          case '9': dispatch({ type: 'SET_ACTIVE_APP', payload: 'sci_calc' }); break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <div 
      dir={['ar', 'fa', 'ur', 'he'].includes(state.locale) ? 'rtl' : 'ltr'}
      className="min-h-screen transition-colors flex flex-col items-center sm:py-8 text-gray-900 dark:text-white relative"
      style={{
        backgroundColor: state.theme === 'dark' ? '#000000' : '#e5e7eb',
        color: state.theme === 'dark' ? '#ffffff' : '#000000'
      }}
    >
      {state.backgroundImage && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${state.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: state.backgroundPosition,
            backgroundAttachment: 'fixed',
            opacity: state.backgroundOpacity / 100
          }}
        />
      )}
      <div className="z-10 w-full flex justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeApp}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full flex justify-center"
          >
            {state.activeApp === 'notes' && <NotesScreen />}
            {state.activeApp === 'calculator' && <CalculatorScreen />}
            {state.activeApp === 'clock' && <ClockScreen />}
            {state.activeApp === 'drawing' && <DrawingScreen />}
            {state.activeApp === 'spreadsheet' && <SpreadsheetScreen />}
            {state.activeApp === 'calendar' && <CalendarScreen />}
            {state.activeApp === 'game' && <GameScreen />}
            {state.activeApp === 'qr' && <QrScreen />}
            {state.activeApp === 'sci_calc' && <SciCalcScreen />}
            {!['notes', 'calculator', 'clock', 'drawing', 'spreadsheet', 'calendar', 'game', 'qr', 'sci_calc'].includes(state.activeApp) && <NotesScreen />}
          </motion.div>
        </AnimatePresence>
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

