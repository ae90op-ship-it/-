const fs = require('fs');

// Settings Modal
let settings = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');
settings = settings.replace(
  /import React, \{ useRef, useState \} from 'react';/,
  `import React, { useRef, useState, useEffect } from 'react';`
);
fs.writeFileSync('src/components/SettingsModal.tsx', settings);

// Calendar Screen
let calendar = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');
calendar = calendar.replace(
  /import React, \{ useState \} from 'react';/,
  `import React, { useState, useEffect } from 'react';`
);

calendar = calendar.replace(
  /  const \[currentDate, setCurrentDate\] = useState\(new Date\(\)\);\n  const daysInMonth/,
  `  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state.activeNote && state.activeNote.type === 'calendar') {
      try {
        const parsed = JSON.parse(state.activeNote.content);
        if (parsed.notes) {
          setNotes(parsed.notes);
        }
      } catch (e) {
        // Handle err
      }
    }
  }, [state.activeNote]);

  const daysInMonth`
);

fs.writeFileSync('src/components/CalendarScreen.tsx', calendar);

