const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    <div \n      className="min-h-screen`;
const replacement = `    <div 
      dir={['ar', 'fa', 'ur', 'he'].includes(state.locale) ? 'rtl' : 'ltr'}
      className="min-h-screen`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
