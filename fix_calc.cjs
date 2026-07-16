const fs = require('fs');
let content = fs.readFileSync('src/components/CalculatorScreen.tsx', 'utf8');

// 1. Remove .slice(0, 20)
content = content.replace(
  /setHistory\(prev => \[\{ expr: expression, res: String\(finalRes\) \}, \.\.\.prev\]\.slice\(0, 20\)\);/,
  `setHistory(prev => [{ expr: expression, res: String(finalRes) }, ...prev]);`
);

// 2. Add Keyboard event listener
const keyboardEffect = `
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere if settings modal is open or a form element is focused
      if (document.activeElement?.tagName === 'INPUT' || isSettingsOpen) return;
      
      const key = e.key;
      if (/[0-9\.]/.test(key)) {
        handleInput(key);
      } else if (key === '+' || key === '-' || key === '%') {
        handleInput(key);
      } else if (key === '*') {
        handleInput('×');
      } else if (key === '/') {
        e.preventDefault();
        handleInput('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === 'Escape' || key === 'Delete' || key.toLowerCase() === 'c') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, isSettingsOpen]);
`;

content = content.replace(
  /  const handleInput = \(val: string\) => \{/,
  `${keyboardEffect}\n  const handleInput = (val: string) => {`
);

// 3. Fix CSS padding for smaller screens
content = content.replace(
  /className=\{\`flex-1 flex flex-col justify-end p-4 sm:p-6 z-10 calculator-container relative \$\{state\.theme === 'light' \? 'bg-gradient-to-b from-gray-50\/50 to-gray-100\/50' : ''\}\`\}/,
  `className={\`flex-1 flex flex-col justify-end p-2 sm:p-6 z-10 calculator-container relative \${state.theme === 'light' ? 'bg-gradient-to-b from-gray-50/50 to-gray-100/50' : ''}\`}`
);

content = content.replace(
  /className="grid grid-cols-4 gap-2 sm:gap-3 bg-white\/40 dark:bg-black\/20 p-3 sm:p-4 rounded-\[2rem\] shadow-sm border border-gray-100 dark:border-zinc-800"/,
  `className="grid grid-cols-4 gap-1.5 sm:gap-3 bg-white/40 dark:bg-black/20 p-2 sm:p-4 rounded-3xl sm:rounded-[2rem] shadow-sm border border-gray-100 dark:border-zinc-800"`
);

content = content.replace(
  /className=\{\`h-14 sm:h-16 text-lg sm:text-2xl font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center/g,
  `className={\`h-12 sm:h-16 text-lg sm:text-2xl font-bold rounded-xl sm:rounded-2xl transition-all active:scale-95 flex items-center justify-center`
);

fs.writeFileSync('src/components/CalculatorScreen.tsx', content);
