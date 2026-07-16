const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// 1. Add showSecretNotes state and secretNoteContent
content = content.replace(
  /const \[showCodesList, setShowCodesList\] = useState\(false\);/,
  `const [showCodesList, setShowCodesList] = useState(false);\n  const [showSecretNotes, setShowSecretNotes] = useState(false);\n  const [secretNotesContent, setSecretNotesContent] = useState(() => localStorage.getItem('secretNotes') || '');\n\n  useEffect(() => { localStorage.setItem('secretNotes', secretNotesContent); }, [secretNotesContent]);`
);

// 2. Modify handle run logic
const runLogicTarget = `if (engVal === '1234567890') setUnlockedCodes(true);
                else if (engVal === '11111') dispatch({ type: 'SET_ACTIVE_APP', payload: 'game' });
                else if (engVal === '0000') setShowCodesList(true);
                else if (engVal.toLowerCase() === 'moon') setShowMoonOverlay(true);
                else setSecretInput('');`;
const runLogicReplacement = `if (engVal === '11111') dispatch({ type: 'SET_ACTIVE_APP', payload: 'game' });
                else if (engVal === '0000') setShowCodesList(true);
                else if (engVal === '996699') setShowSecretNotes(true);
                else if (engVal.toLowerCase() === 'moon') setShowMoonOverlay(true);
                else setSecretInput('');`;

content = content.replace(runLogicTarget, runLogicReplacement);

// 3. Remove 1234567890 from the UI list and format 0000 X button
const listTarget = `<button onClick={() => {setShowCodesList(false); setSecretInput('');}} className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-full">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">{state.locale === 'ar' ? 'الأكواد السرية' : 'Secret Codes'}</h3>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-2">
                <span className="text-purple-600 font-bold">1234567890</span>
                <span className="text-gray-600 dark:text-gray-400">{state.locale === 'ar' ? 'يفتح ميزات المطور' : 'Unlocks Dev features'}</span>
              </li>`;
const listReplacement = `<h3 className="text-xl font-bold mb-4">{state.locale === 'ar' ? 'الأكواد السرية' : 'Secret Codes'}</h3>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-2">
                <span className="text-purple-600 font-bold">996699</span>
                <span className="text-gray-600 dark:text-gray-400">{state.locale === 'ar' ? 'ملاحظات سرية' : 'Secret Notes'}</span>
              </li>`;

content = content.replace(listTarget, listReplacement);

const showCodesListFix = `<div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-4">{state.locale === 'ar' ? 'الأكواد السرية' : 'Secret Codes'}</h3>`;
const showCodesListFixReplacement = `<div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <button onClick={() => {setShowCodesList(false); setSecretInput('');}} className="absolute top-8 right-8 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-[70]">
              <X size={32} />
          </button>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative mt-16">
            <h3 className="text-xl font-bold mb-4">{state.locale === 'ar' ? 'الأكواد السرية' : 'Secret Codes'}</h3>`;

content = content.replace(showCodesListFix, showCodesListFixReplacement);

// 4. Add Secret Notes Overlay at the end
const secretNotesUI = `
      {showSecretNotes && (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in duration-300">
          <header className="flex justify-between items-center mb-6 max-w-2xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-red-500 font-mono tracking-widest uppercase">{state.locale === 'ar' ? 'ملاحظات سرية' : 'Top Secret'}</h2>
            <button onClick={() => {setShowSecretNotes(false); setSecretInput('');}} className="text-white/50 hover:text-white p-3 bg-white/10 rounded-full transition-colors">
              <X size={28} />
            </button>
          </header>
          <div className="flex-1 max-w-2xl mx-auto w-full relative">
            <textarea
              dir={['ar', 'fa', 'ur', 'he'].includes(state.locale) ? 'rtl' : 'ltr'}
              value={secretNotesContent}
              onChange={(e) => setSecretNotesContent(e.target.value)}
              placeholder={state.locale === 'ar' ? 'اكتب ملاحظاتك السرية هنا...' : 'Type your secret notes here...'}
              className="w-full h-full bg-zinc-900 text-green-500 font-mono p-6 rounded-3xl resize-none outline-none focus:ring-2 focus:ring-red-500/50 shadow-2xl border border-red-900/30 placeholder-green-900/50"
            />
          </div>
        </div>
      )}
`;

content = content.replace(/    <\/div>\n  \);\n};\n?$/, secretNotesUI + '    </div>\n  );\n};\n');

fs.writeFileSync('src/components/SettingsModal.tsx', content);
