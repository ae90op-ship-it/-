const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  /export type AppType = 'notes' \| 'calculator' \| 'clock' \| 'drawing' \| 'spreadsheet' \| 'calendar' \| 'game';/,
  `export type AppType = 'notes' | 'calculator' | 'clock' | 'drawing' | 'spreadsheet' | 'calendar' | 'game' | 'qr' | 'sci_calc';`
);

fs.writeFileSync('src/types.ts', content);
