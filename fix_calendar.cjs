const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');

// Needs:
// 1. activeDay state
// 2. notes state (Record<string, string>)
// 3. UI for typing notes
// 4. Save to use the notes state

// Replace the top section
const topReplace = `  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state.activeNote && state.activeNote.type === 'calendar') {
      try {
        const parsed = JSON.parse(state.activeNote.content);
        if (parsed.notes) {
          setNotes(parsed.notes);
        }
      } catch (e) {
        // Handle err
      }
    }
  }, [state.activeNote]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();`;

content = content.replace(
  /  const \[currentDate, setCurrentDate\] = useState\(new Date\(\)\);\n  const daysInMonth/,
  topReplace
);

// handleSave replacement
const handleSaveTarget = `const handleSave = () => {
    const payload = {
      id: state.activeNote ? state.activeNote.id : Date.now().toString(),
      title: state.activeNote ? state.activeNote.title : t.calendar + ' - ' + new Date().toLocaleTimeString(),
      content: \`Selected Month: \${monthNames[currentDate.getMonth()]} \${currentDate.getFullYear()}\`,
      color: 'bg-red-100',
      type: 'calendar' as const,
      timestamp: Date.now().toString()
    };`;
const handleSaveReplacement = `const handleSave = () => {
    const payload = {
      id: state.activeNote ? state.activeNote.id : Date.now().toString(),
      title: state.activeNote ? state.activeNote.title : t.calendar + ' - ' + new Date().toLocaleTimeString(),
      content: JSON.stringify({ notes }),
      color: 'bg-red-100',
      type: 'calendar' as const,
      timestamp: Date.now().toString()
    };`;
content = content.replace(handleSaveTarget, handleSaveReplacement);

// Render days block
const renderDaysTarget = `                  className={\`aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer \${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}\`}`;
const renderDaysReplacement = `                  onClick={() => setSelectedDay(day)}
                  className={\`aspect-square relative flex items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer \${selectedDay === day ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500' : isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}\`}
                >
                  {day}
                  {notes[\`\${currentDate.getFullYear()}-\${currentDate.getMonth()}-\${day}\`] && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500"></div>
                  )}`;
content = content.replace(renderDaysTarget, renderDaysReplacement);
content = content.replace(/\{day\}\n                <\/div>/g, `</div>`);

// Render notes block
const endDivTarget = `        </div>
      </div>
    </div>`;

const currentKeyExpr = `\`\${currentDate.getFullYear()}-\${currentDate.getMonth()}-\${selectedDay}\``;
const endDivReplacement = `        </div>
        
        {selectedDay && (
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

content = content.replace(endDivTarget, endDivReplacement);

fs.writeFileSync('src/components/CalendarScreen.tsx', content);
