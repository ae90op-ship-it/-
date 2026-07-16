sed -i 's/import { ArrowLeft, Save } from '\''lucide-react'\'';/import { ArrowLeft, Save, Plus, Minus, Settings2, X } from '\''lucide-react'\'';/g' src/components/SpreadsheetScreen.tsx

sed -i 's/const \[data, setData\] = useState<Record<string, string>>({});/const \[data, setData\] = useState<Record<string, string>>({});\n  const \[numCols, setNumCols\] = useState(4);\n  const \[numRows, setNumRows\] = useState(10);\n  const \[isOptionsOpen, setIsOptionsOpen\] = useState(false);/g' src/components/SpreadsheetScreen.tsx

sed -i 's/if (parsed) setData(parsed);/if (parsed.cells) {\n          setData(parsed.cells);\n          setNumCols(parsed.cols || 4);\n          setNumRows(parsed.rows || 10);\n        } else if (parsed) {\n          setData(parsed);\n        }/g' src/components/SpreadsheetScreen.tsx

sed -i 's/const cols = \['\''A'\'', '\''B'\'', '\''C'\'', '\''D'\''\];/const cols = Array.from({ length: numCols }, (_, i) => {\n    let c = '\'''\'';\n    let n = i;\n    while (n >= 0) {\n      c = String.fromCharCode(65 + (n % 26)) + c;\n      n = Math.floor(n \/ 26) - 1;\n    }\n    return c;\n  });/g' src/components/SpreadsheetScreen.tsx

sed -i 's/const rows = \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10\];/const rows = Array.from({ length: numRows }, (_, i) => i + 1);/g' src/components/SpreadsheetScreen.tsx

sed -i 's/content: JSON.stringify(data),/content: JSON.stringify({ cells: data, cols: numCols, rows: numRows }),/g' src/components/SpreadsheetScreen.tsx
