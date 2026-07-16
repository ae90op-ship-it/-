const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// 1. Add showCalcHistory state
content = content.replace(
  /const \[showSecretNotes, setShowSecretNotes\] = useState\(false\);/,
  `const [showSecretNotes, setShowSecretNotes] = useState(false);\n  const [showCalcHistory, setShowCalcHistory] = useState(false);\n  const [calcHistoryItems, setCalcHistoryItems] = useState<{expr:string, res:string}[]>(() => { try { return JSON.parse(localStorage.getItem('calculatorHistory') || '[]'); } catch(e){return [];} });`
);

// 2. Modify run logic
content = content.replace(
  /else if \(engVal === '996699'\) setShowSecretNotes\(true\);/,
  `else if (engVal === '996699') setShowSecretNotes(true);\n                else if (engVal === '778877') setShowCalcHistory(true);`
);

// 3. Add to secret codes list
const listTarget = `<span className="text-purple-600 font-bold">996699</span>
                <span className="text-gray-600 dark:text-gray-400">{state.locale === 'ar' ? 'ملاحظات سرية' : 'Secret Notes'}</span>
              </li>`;
const listReplacement = `<span className="text-purple-600 font-bold">996699</span>
                <span className="text-gray-600 dark:text-gray-400">{state.locale === 'ar' ? 'ملاحظات سرية' : 'Secret Notes'}</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-2">
                <span className="text-purple-600 font-bold">778877</span>
                <span className="text-gray-600 dark:text-gray-400">{state.locale === 'ar' ? 'سجل الحاسبة' : 'Calc History'}</span>
              </li>`;

content = content.replace(listTarget, listReplacement);

// 4. Add Calc History overlay
const secretNotesUI = `
      {showCalcHistory && (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in duration-300">
          <header className="flex justify-between items-center mb-6 max-w-2xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-blue-500 font-mono tracking-widest uppercase">{state.locale === 'ar' ? 'سجل الحاسبة' : 'Calc History'}</h2>
            <button onClick={() => {setShowCalcHistory(false); setSecretInput('');}} className="text-white/50 hover:text-white p-3 bg-white/10 rounded-full transition-colors">
              <X size={28} />
            </button>
          </header>
          <div className="flex-1 max-w-2xl mx-auto w-full relative overflow-y-auto bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-blue-900/30">
            {calcHistoryItems.length === 0 ? (
              <p className="text-gray-500 font-mono text-center mt-10">{state.locale === 'ar' ? 'السجل فارغ' : 'History is empty'}</p>
            ) : (
              <div className="flex flex-col gap-4">
                {calcHistoryItems.map((item, idx) => (
                  <div key={idx} className="bg-black/40 p-4 rounded-xl border border-zinc-800 flex flex-col gap-1 items-end">
                    <span className="text-gray-400 font-mono text-sm">{item.expr}</span>
                    <span className="text-white font-mono font-bold text-xl">{item.res}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
`;

content = content.replace(/      \{showSecretNotes && \(/, secretNotesUI + '\n      {showSecretNotes && (');

fs.writeFileSync('src/components/SettingsModal.tsx', content);
