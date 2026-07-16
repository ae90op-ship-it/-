const fs = require('fs');
let calendar = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');

const target = `const [currentDate, setCurrentDate] = useState(new Date());`;
const replacement = `const [currentDate, setCurrentDate] = useState(new Date());
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
  }, [state.activeNote]);`;

calendar = calendar.replace(target, replacement);

fs.writeFileSync('src/components/CalendarScreen.tsx', calendar);
