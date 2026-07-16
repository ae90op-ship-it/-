const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');

// replace notes state
content = content.replace(
  /const \[notes, setNotes\] = useState<Record<string, string>>\(\{\}\);/,
  `const [notes, setNotes] = useState<Record<string, string[]>>({});`
);

// replace notes rendering part
const currentKeyExpr = `\`\${currentDate.getFullYear()}-\${currentDate.getMonth()}-\${selectedDay}\``;
const targetBottom = `        {selectedDay && (
          <div className="mt-4 flex-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col">
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {state.locale === 'ar' ? 'ملاحظات' : 'Notes'} - {selectedDay} {monthNames[currentDate.getMonth()]}
              </h3>
            </div>
            <textarea
              dir={['ar', 'fa', 'ur', 'he'].includes(state.locale) ? 'rtl' : 'ltr'}
              value={notes[${currentKeyExpr}] || ''}
              onChange={e => setNotes(prev => ({ ...prev, [${currentKeyExpr}]: e.target.value }))}
              className="flex-1 w-full bg-transparent resize-none outline-none p-2 text-gray-800 dark:text-gray-200"
              placeholder={state.locale === 'ar' ? 'اكتب ملاحظة لهذا اليوم...' : 'Write a note for this day...'}
            />
          </div>
        )}
      </div>
    </div>`;

const replaceBottom = `        {selectedDay && (
          <div className="mt-4 flex-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col relative">
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {state.locale === 'ar' ? 'ملاحظات' : 'Notes'} - {selectedDay} {monthNames[currentDate.getMonth()]}
              </h3>
              <button 
                onClick={() => setNotes(prev => ({ ...prev, [${currentKeyExpr}]: [...(prev[${currentKeyExpr}] || []), ''] }))}
                className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/40"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
              {!(notes[${currentKeyExpr}] && notes[${currentKeyExpr}].length > 0) ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  {state.locale === 'ar' ? 'لا توجد ملاحظات، اضغط + للإضافة' : 'No notes. Press + to add.'}
                </div>
              ) : (
                notes[${currentKeyExpr}].map((noteText, idx) => (
                  <div key={idx} className="relative bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-2 border border-gray-100 dark:border-zinc-800">
                    <textarea
                      dir={['ar', 'fa', 'ur', 'he'].includes(state.locale) ? 'rtl' : 'ltr'}
                      value={noteText}
                      onChange={e => {
                        const val = e.target.value;
                        setNotes(prev => {
                          const arr = [...(prev[${currentKeyExpr}] || [])];
                          arr[idx] = val;
                          return { ...prev, [${currentKeyExpr}]: arr };
                        });
                      }}
                      className="w-full bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 text-sm p-1 min-h-[60px]"
                      placeholder={state.locale === 'ar' ? 'اكتب ملاحظة...' : 'Write note...'}
                    />
                    <button 
                      onClick={() => {
                        setNotes(prev => {
                          const arr = [...(prev[${currentKeyExpr}] || [])];
                          arr.splice(idx, 1);
                          return { ...prev, [${currentKeyExpr}]: arr };
                        });
                      }}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-red-50 dark:bg-red-900/20 p-1 rounded-full"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>`;

content = content.replace(targetBottom, replaceBottom);

content = content.replace(
  /import \{ ArrowLeft, ChevronLeft, ChevronRight, Save \} from 'lucide-react';/,
  `import { ArrowLeft, ChevronLeft, ChevronRight, Save, Plus, Trash2 } from 'lucide-react';`
);

content = content.replace(
  /\{notes\[\`\$\{currentDate\.getFullYear\(\)\}-\$\{currentDate\.getMonth\(\)\}-\$\{day\}\`\] && \(/,
  `{(notes[\`\${currentDate.getFullYear()}-\${currentDate.getMonth()}-\${day}\`] && notes[\`\${currentDate.getFullYear()}-\${currentDate.getMonth()}-\${day}\`].length > 0) && (`
);

fs.writeFileSync('src/components/CalendarScreen.tsx', content);
