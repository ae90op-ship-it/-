const fs = require('fs');
let content = fs.readFileSync('src/components/CalculatorScreen.tsx', 'utf8');

const target = `const [history, setHistory] = useState<{expr: string, res: string}[]>([]);`;
const replacement = `const [history, setHistory] = useState<{expr: string, res: string}[]>(() => {
    const saved = localStorage.getItem('calculatorHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/CalculatorScreen.tsx', content);
