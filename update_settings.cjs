const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

content = content.replace(
  /{!showAllLanguages \? \([\s\S]*?<\/button>\s*\)\}/m,
  `{!showAllLanguages ? (
              <button 
                onClick={() => setShowAllLanguages(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl font-bold text-sm transition-all border bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700 dark:hover:bg-zinc-700"
              >
                <span className="text-xl mb-1">...</span>
                {state.locale === 'ar' ? 'المزيد' : 'More'}
              </button>
            ) : (
              <button 
                onClick={() => setShowAllLanguages(false)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl font-bold text-sm transition-all border bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700 dark:hover:bg-zinc-700"
              >
                <span className="text-xl mb-1">⤴️</span>
                {state.locale === 'ar' ? 'أقل' : 'Less'}
              </button>
            )}`
);

content = content.replace(
  /onClick=\{\(\) => \{\s*const engVal = secretInput\.replace\(\/\[٠-٩\]\/g, d => '٠١٢٣٤٥٦٧٨٩'\.indexOf\(d\)\.toString\(\)\);\s*if \(engVal === '1234567890'\) setUnlockedCodes\(true\);\s*else if \(engVal === '11111'\) dispatch\(\{ type: 'SET_ACTIVE_APP', payload: 'game' \}\);\s*else setSecretInput\(''\);\s*\}\}/m,
  `onClick={() => {
                const engVal = secretInput.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
                if (engVal === '1234567890') setUnlockedCodes(true);
                else if (engVal === '11111') dispatch({ type: 'SET_ACTIVE_APP', payload: 'game' });
                else if (engVal === '0000') setShowCodesList(true);
                else if (engVal.toLowerCase() === 'moon') setShowMoonOverlay(true);
                else setSecretInput('');
              }}`
);

content = content.replace(
  /<\/div>\n    <\/div>\n  \);\n\};\n?$/m,
  `      </div>
      {showMoonOverlay && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4">
          <button onClick={() => {setShowMoonOverlay(false); setSecretInput('');}} className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20">
            <X size={28} />
          </button>
          <img src="https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=2000&auto=format&fit=crop" className="w-full max-w-sm rounded-full shadow-2xl animate-in zoom-in duration-700" alt="Moon" />
        </div>
      )}

      {showCodesList && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => {setShowCodesList(false); setSecretInput('');}} className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-full">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">{state.locale === 'ar' ? 'الأكواد السرية' : 'Secret Codes'}</h3>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-2">
                <span className="text-purple-600 font-bold">1234567890</span>
                <span className="text-gray-600 dark:text-gray-400">{state.locale === 'ar' ? 'يفتح ميزات المطور' : 'Unlocks Dev features'}</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-2">
                <span className="text-purple-600 font-bold">11111</span>
                <span className="text-gray-600 dark:text-gray-400">{state.locale === 'ar' ? 'يفتح لعبة مخفية' : 'Unlocks hidden Game'}</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-2">
                <span className="text-purple-600 font-bold">moon</span>
                <span className="text-gray-600 dark:text-gray-400">{state.locale === 'ar' ? 'يظهر القمر' : 'Shows the Moon'}</span>
              </li>
              <li className="flex justify-between items-center pb-2">
                <span className="text-purple-600 font-bold">0000</span>
                <span className="text-gray-600 dark:text-gray-400">{state.locale === 'ar' ? 'يظهر هذه القائمة' : 'Shows this list'}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
`
);

fs.writeFileSync('src/components/SettingsModal.tsx', content);
