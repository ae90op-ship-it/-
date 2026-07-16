const fs = require('fs');
let draw = fs.readFileSync('src/components/DrawingScreen.tsx', 'utf8');

// The string in the file literally contains: name: \`Layer \${layers.length + 1}\`
// Let's replace the whole onClick body.
const badCode = `onClick={() => {
              const newId = Date.now().toString();
              setLayers([{ id: newId, name: \\\`Layer \\\$\\{layers.length + 1\\}\\\`, visible: true, items: [] }, ...layers]);
              setActiveLayerId(newId);
            }}`;

const goodCode = `onClick={() => {
              const newId = Date.now().toString();
              setLayers([{ id: newId, name: \`Layer \${layers.length + 1}\`, visible: true, items: [] }, ...layers]);
              setActiveLayerId(newId);
            }}`;

// Because backslashes are messy, we can just replace it via regex matching the line.
draw = draw.replace(/setLayers\(\[\{ id: newId, name: [^,]+, visible: true, items: \[\] \}, \.\.\.layers\]\);/g, "setLayers([{ id: newId, name: `Layer ${layers.length + 1}`, visible: true, items: [] }, ...layers]);");

fs.writeFileSync('src/components/DrawingScreen.tsx', draw);
