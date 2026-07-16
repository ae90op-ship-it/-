const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /import \{ GameScreen \} from '\.\/components\/GameScreen';/,
  `import { GameScreen } from './components/GameScreen';\nimport { QrScreen } from './components/QrScreen';\nimport { SciCalcScreen } from './components/SciCalcScreen';\nimport { AnimatePresence, motion } from 'motion/react';`
);

const oldKeys = `          case '6': dispatch({ type: 'SET_ACTIVE_APP', payload: 'calendar' }); break;
          case '7': dispatch({ type: 'SET_ACTIVE_APP', payload: 'game' }); break;
        }`;
const newKeys = `          case '6': dispatch({ type: 'SET_ACTIVE_APP', payload: 'calendar' }); break;
          case '7': dispatch({ type: 'SET_ACTIVE_APP', payload: 'game' }); break;
          case '8': dispatch({ type: 'SET_ACTIVE_APP', payload: 'qr' }); break;
          case '9': dispatch({ type: 'SET_ACTIVE_APP', payload: 'sci_calc' }); break;
        }`;
content = content.replace(oldKeys, newKeys);

const oldRender = `<div className="z-10 w-full flex justify-center relative">
        {state.activeApp === 'notes' && <NotesScreen />}
        {state.activeApp === 'calculator' && <CalculatorScreen />}
        {state.activeApp === 'clock' && <ClockScreen />}
        {state.activeApp === 'drawing' && <DrawingScreen />}
        {state.activeApp === 'spreadsheet' && <SpreadsheetScreen />}
        {state.activeApp === 'calendar' && <CalendarScreen />}
        {state.activeApp === 'game' && <GameScreen />}
        {/* Fallback to notes if unknown app */}
        {!['notes', 'calculator', 'clock', 'drawing', 'spreadsheet', 'calendar', 'game'].includes(state.activeApp) && <NotesScreen />}
      </div>`;

const newRender = `<div className="z-10 w-full flex justify-center relative">
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
      </div>`;

content = content.replace(oldRender, newRender);

fs.writeFileSync('src/App.tsx', content);
