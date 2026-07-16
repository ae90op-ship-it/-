const fs = require('fs');

let draw = fs.readFileSync('src/components/DrawingScreen.tsx', 'utf8');
draw = draw.replace(/name: \\\`Layer \\\$\\{layers.length \+ 1\\}\\\`/, "name: `Layer ${layers.length + 1}`");
fs.writeFileSync('src/components/DrawingScreen.tsx', draw);

let sheet = fs.readFileSync('src/components/SpreadsheetScreen.tsx', 'utf8');
sheet = sheet.replace(/<input/g, '<textarea');
sheet = sheet.replace(/type="text"/g, '');
sheet = sheet.replace(/className="w-full h-full p-2 bg-transparent border-none outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm"/g, 'className="w-full h-full p-2 bg-transparent border-none outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm resize-none"');
sheet = sheet.replace(/<\/input>/g, '</textarea>'); // Although it was /> but just in case
sheet = sheet.replace(/\/>/g, (match, offset, str) => {
  // we only want to replace /> for textarea
  if (str.substring(offset - 200, offset).includes('<textarea')) {
    // it's tricky, let's just do a string replace on the exact block
    return match;
  }
  return match;
});
fs.writeFileSync('src/components/SpreadsheetScreen.tsx', sheet);
