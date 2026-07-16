const fs = require('fs');
let content = fs.readFileSync('src/components/SpreadsheetScreen.tsx', 'utf8');

const importsTarget = `import { ArrowLeft, Save, Plus, Minus, Settings2, X } from 'lucide-react';`;
const importsReplacement = `import { ArrowLeft, Save, Plus, Minus, Settings2, X, Trash2, Layers } from 'lucide-react';`;
content = content.replace(importsTarget, importsReplacement);

const stateTarget = `  const [data, setData] = useState<Record<string, string>>({});
  const [numCols, setNumCols] = useState(4);
  const [numRows, setNumRows] = useState(10);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  useEffect(() => {
    if (state.activeNote && state.activeNote.type === 'spreadsheet') {
      try {
        const parsed = JSON.parse(state.activeNote.content);
        if (parsed.cells) {
          setData(parsed.cells);
          setNumCols(parsed.cols || 4);
          setNumRows(parsed.rows || 10);
          if (parsed.rowHeights) setRowHeights(parsed.rowHeights);
          if (parsed.colWidths) setColWidths(parsed.colWidths);
        } else if (parsed) {
          setData(parsed);
        }
      } catch (e) {
        // Handle err
      }
    }
  }, [state.activeNote]);`;

const stateReplacement = `  const [sheets, setSheets] = useState<any[]>([{ id: '1', name: 'Sheet 1', data: {}, numCols: 4, numRows: 10, rowHeights: {}, colWidths: {} }]);
  const [activeSheetId, setActiveSheetId] = useState('1');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [activeCol, setActiveCol] = useState<string | null>(null);

  useEffect(() => {
    if (state.activeNote && state.activeNote.type === 'spreadsheet') {
      try {
        const parsed = JSON.parse(state.activeNote.content);
        if (parsed.sheets) {
          setSheets(parsed.sheets);
          setActiveSheetId(parsed.sheets[0]?.id || '1');
        } else if (parsed.cells) {
          // migrate old data
          setSheets([{ id: '1', name: 'Sheet 1', data: parsed.cells, numCols: parsed.cols || 4, numRows: parsed.rows || 10, rowHeights: parsed.rowHeights || {}, colWidths: parsed.colWidths || {} }]);
          setActiveSheetId('1');
        }
      } catch (e) {}
    }
  }, [state.activeNote]);

  const currentSheet = sheets.find(s => s.id === activeSheetId) || sheets[0];
  const { data, numCols, numRows, rowHeights, colWidths } = currentSheet;

  const updateCurrentSheet = (updates: any) => {
    setSheets(prev => prev.map(s => s.id === activeSheetId ? { ...s, ...updates } : s));
  };
  const setData = (newData: any) => updateCurrentSheet({ data: typeof newData === 'function' ? newData(data) : newData });
  const setNumCols = (newCols: any) => updateCurrentSheet({ numCols: typeof newCols === 'function' ? newCols(numCols) : newCols });
  const setNumRows = (newRows: any) => updateCurrentSheet({ numRows: typeof newRows === 'function' ? newRows(numRows) : newRows });
  const setRowHeights = (newHeights: any) => updateCurrentSheet({ rowHeights: typeof newHeights === 'function' ? newHeights(rowHeights) : newHeights });
  const setColWidths = (newWidths: any) => updateCurrentSheet({ colWidths: typeof newWidths === 'function' ? newWidths(colWidths) : newWidths });
`;
content = content.replace(stateTarget, stateReplacement);

const saveTarget = `content: JSON.stringify({ cells: data, cols: numCols, rows: numRows, rowHeights, colWidths }),`;
const saveReplacement = `content: JSON.stringify({ sheets }),`;
content = content.replace(saveTarget, saveReplacement);

const headerTarget = `        <div className="flex gap-1">
          <button 
            onClick={() => setIsOptionsOpen(true)}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings2 size={24} />
          </button>
          <button 
            onClick={handleSave}
            className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full transition-colors"
          >
            <Save size={24} />
          </button>
        </div>`;
const headerReplacement = `        <div className="flex gap-1">
          <button 
            onClick={() => {
              const newId = Date.now().toString();
              setSheets(prev => [...prev, { id: newId, name: \`Sheet \${prev.length + 1}\`, data: {}, numCols: 4, numRows: 10, rowHeights: {}, colWidths: {} }]);
              setActiveSheetId(newId);
            }}
            className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
          >
            <Layers size={24} />
          </button>
          <button 
            onClick={() => {
              if (sheets.length > 1) {
                setSheets(prev => prev.filter(s => s.id !== activeSheetId));
                setActiveSheetId(sheets.find(s => s.id !== activeSheetId)?.id || sheets[0].id);
              } else {
                updateCurrentSheet({ data: {} });
              }
            }}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
          >
            <Trash2 size={24} />
          </button>
          <button 
            onClick={() => setIsOptionsOpen(true)}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings2 size={24} />
          </button>
          <button 
            onClick={handleSave}
            className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full transition-colors"
          >
            <Save size={24} />
          </button>
        </div>`;
content = content.replace(headerTarget, headerReplacement);

const tableHeadTarget = `                {cols.map(c => (
                  <th key={c} className="bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2 font-semibold text-center min-w-[80px]">
                    {c}
                  </th>
                ))}`;
const tableHeadReplacement = `                {cols.map(c => (
                  <th 
                    key={c} 
                    onClick={() => setActiveCol(activeCol === c ? null : c)}
                    className={\`bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2 font-semibold text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 \${activeCol === c ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : ''}\`}
                    style={{ minWidth: colWidths[c] || 80, width: colWidths[c] || 80 }}
                  >
                    {c}
                  </th>
                ))}`;
content = content.replace(tableHeadTarget, tableHeadReplacement);

const activeRowOverlay = `      {activeRow !== null && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 rounded-2xl p-2 flex gap-2">`;
const activeRowOverlayReplacement = `
      {sheets.length > 1 && (
        <div className="z-20 bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 flex overflow-x-auto" dir="ltr">
          {sheets.map(s => (
            <button 
              key={s.id} 
              onClick={() => setActiveSheetId(s.id)}
              className={\`px-4 py-2 font-semibold text-sm whitespace-nowrap border-r border-gray-200 dark:border-zinc-800 \${activeSheetId === s.id ? 'bg-white dark:bg-zinc-800 text-teal-600' : 'text-gray-500 hover:bg-white/50 dark:hover:bg-zinc-800/50'}\`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      {activeRow !== null && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 rounded-2xl p-2 flex gap-2">`;
content = content.replace(activeRowOverlay, activeRowOverlayReplacement);

const activeColOverlay = `        </div>
      )}
      <div className="inline-block min-w-full rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">`;
const activeColOverlayReplacement = `        </div>
      )}
      {activeCol !== null && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 rounded-2xl p-2 flex gap-2">
          <button onClick={() => setColWidths(prev => ({ ...prev, [activeCol]: (prev[activeCol] || 80) + 20 }))} className="p-2 bg-gray-100 dark:bg-zinc-700 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-600"><Plus size={16} /></button>
          <span className="flex items-center px-2 text-sm font-bold">{state.locale === 'ar' ? 'تغيير عرض العمود ' + activeCol : 'Col ' + activeCol}</span>
          <button onClick={() => setColWidths(prev => ({ ...prev, [activeCol]: Math.max(40, (prev[activeCol] || 80) - 20) }))} className="p-2 bg-gray-100 dark:bg-zinc-700 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-600"><Minus size={16} /></button>
          <button onClick={() => setActiveCol(null)} className="p-2 ml-2 bg-red-100 text-red-600 dark:bg-red-900/30 rounded-xl hover:bg-red-200"><X size={16} /></button>
        </div>
      )}
      <div className="inline-block min-w-full rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">`;
content = content.replace(activeColOverlay, activeColOverlayReplacement);

fs.writeFileSync('src/components/SpreadsheetScreen.tsx', content);
