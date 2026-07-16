const fs = require('fs');
let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

code = code.replace(/theme: parsed\.theme \|\| 'light',/, "theme: (parsed.theme === 'dark' || parsed.theme === 'light') ? parsed.theme : 'light',");

fs.writeFileSync('src/store/AppContext.tsx', code);
