const fs = require('fs');
let code = fs.readFileSync('src/components/ClockScreen.tsx', 'utf8');

const targetStr = `  const formatTimeStr = (d: Date, offsetHours = 0) => {
    // Current UTC time
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const adjusted = new Date(utc + (3600000 * offsetHours));
    const hours = adjusted.getHours();
    const minutes = adjusted.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return \`\${h12.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')} \${ampm}\`;
  };`;

const replaceStr = `  const formatTimeStr = (d: Date, offsetHours = 0) => {
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const adjusted = new Date(utc + (3600000 * offsetHours));
    const hours = adjusted.getHours();
    const minutes = adjusted.getMinutes();
    const seconds = adjusted.getSeconds();
    const ampm = hours >= 12 ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM');
    const h12 = hours % 12 || 12;
    return \`\${h12.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')} \${ampm}\`;
  };`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/ClockScreen.tsx', code);
