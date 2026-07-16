const fs = require('fs');
let content = fs.readFileSync('src/components/ClockScreen.tsx', 'utf8');

content = content.replace(
  /onChange=\{e => \{setHours\(Math\.min\(48, Math\.max\(0, parseInt\(e\.target\.value\) \|\| 0\)\)\); setTimeLeft\(hours\*3600\+minutes\*60\+seconds\);\}\}/g,
  `onChange={e => {
                  const val = Math.min(48, Math.max(0, parseInt(e.target.value) || 0));
                  setHours(val);
                  setTimeLeft(val * 3600 + minutes * 60 + seconds);
                }}`
);

content = content.replace(
  /onChange=\{e => \{setMinutes\(Math\.min\(59, Math\.max\(0, parseInt\(e\.target\.value\) \|\| 0\)\)\); setTimeLeft\(hours\*3600\+minutes\*60\+seconds\);\}\}/g,
  `onChange={e => {
                  const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                  setMinutes(val);
                  setTimeLeft(hours * 3600 + val * 60 + seconds);
                }}`
);

content = content.replace(
  /onChange=\{e => \{setSeconds\(Math\.min\(59, Math\.max\(0, parseInt\(e\.target\.value\) \|\| 0\)\)\); setTimeLeft\(hours\*3600\+minutes\*60\+seconds\);\}\}/g,
  `onChange={e => {
                  const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                  setSeconds(val);
                  setTimeLeft(hours * 3600 + minutes * 60 + val);
                }}`
);

fs.writeFileSync('src/components/ClockScreen.tsx', content);
