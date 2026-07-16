const fs = require('fs');
let sheet = fs.readFileSync('src/components/SpreadsheetScreen.tsx', 'utf8');

sheet = sheet.replace(/<textarea([^>]+)\/>/g, '<textarea$1></textarea>');

fs.writeFileSync('src/components/SpreadsheetScreen.tsx', sheet);
