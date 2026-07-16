const fs = require('fs');
let content = fs.readFileSync('src/components/NotesScreen.tsx', 'utf8');

content = content.replace(
  /import \{ Plus, Search, Settings, Trash2, Edit3, X, Check, Circle, CheckCircle2, ListTodo, AlignLeft, Calculator, Clock, Table, CalendarDays, Palette \} from 'lucide-react';/,
  `import { Plus, Search, Settings, Trash2, Edit3, X, Check, Circle, CheckCircle2, ListTodo, AlignLeft, Calculator, Clock, Table, CalendarDays, Palette, QrCode, FunctionSquare } from 'lucide-react';`
);

const newButtonsTarget = `<button 
              onClick={() => dispatch({ type: 'SET_ACTIVE_APP', payload: 'calendar' })}
              className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-105"
            >
              <CalendarDays size={24} />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all hover:scale-105"
            >
              <Settings size={24} />
            </button>
          </div>
        </div>`;

const newButtonsReplacement = `<button 
              onClick={() => dispatch({ type: 'SET_ACTIVE_APP', payload: 'calendar' })}
              className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-105"
            >
              <CalendarDays size={24} />
            </button>
            <button 
              onClick={() => dispatch({ type: 'SET_ACTIVE_APP', payload: 'qr' })}
              className="p-3 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all hover:scale-105"
            >
              <QrCode size={24} />
            </button>
            <button 
              onClick={() => dispatch({ type: 'SET_ACTIVE_APP', payload: 'sci_calc' })}
              className="p-3 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all hover:scale-105"
            >
              <FunctionSquare size={24} />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all hover:scale-105"
            >
              <Settings size={24} />
            </button>
          </div>
        </div>`;

content = content.replace(newButtonsTarget, newButtonsReplacement);

fs.writeFileSync('src/components/NotesScreen.tsx', content);
