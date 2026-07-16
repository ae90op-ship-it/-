const fs = require('fs');
let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

code = code.replace(/locale: parsedState\?.locale === 'en' \? 'en' : 'ar',/, "locale: (parsedState?.locale as Locale) || 'ar',");
code = code.replace(/theme: parsedState\?.theme === 'dark' \? 'dark' : 'light',/, "theme: (parsedState?.theme as Theme) || 'light',");

fs.writeFileSync('src/store/AppContext.tsx', code);
