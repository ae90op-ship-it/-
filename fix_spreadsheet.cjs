const fs = require('fs');
let content = fs.readFileSync('src/components/SpreadsheetScreen.tsx', 'utf8');

// 1. Add activeRow, activeCol, rowHeights, colWidths states
const stateTarget = `  const [numRows, setNumRows] = useState(10);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);`;
const stateReplacement = `  const [numRows, setNumRows] = useState(10);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const [colWidths, setColWidths] = useState<Record<string, number>>({});`;
content = content.replace(stateTarget, stateReplacement);

// Restore rowHeights, colWidths if needed? Actually let's just make it session/local state for now, or save them in payload.
const payloadTarget = `JSON.stringify({ cells: data, cols: numCols, rows: numRows })`;
const payloadReplacement = `JSON.stringify({ cells: data, cols: numCols, rows: numRows, rowHeights, colWidths })`;
content = content.replace(payloadTarget, payloadReplacement);

const parseTarget = `if (parsed.cells) {
          setData(parsed.cells);
          setNumCols(parsed.cols || 4);
          setNumRows(parsed.rows || 10);
        }`;
const parseReplacement = `if (parsed.cells) {
          setData(parsed.cells);
          setNumCols(parsed.cols || 4);
          setNumRows(parsed.rows || 10);
          if (parsed.rowHeights) setRowHeights(parsed.rowHeights);
          if (parsed.colWidths) setColWidths(parsed.colWidths);
        }`;
content = content.replace(parseTarget, parseReplacement);

const tableBodyTarget = `{rows.map(r => (
                <tr key={r}>
                  <td className="bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2 text-center text-gray-500 text-sm font-medium">
                    {r}
                  </td>`;
const tableBodyReplacement = `{rows.map(r => (
                <tr key={r} style={{ height: rowHeights[r] || 'auto' }}>
                  <td 
                    onClick={() => setActiveRow(activeRow === r ? null : r)}
                    className={\`bg-gray-100 dark:bg-zinc-800 border-r border-b border-gray-200 dark:border-zinc-700 py-2 text-center text-gray-500 text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors \${activeRow === r ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : ''}\`}
                  >
                    {state.locale === 'ar' ? r.toString().replace(/\\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]) : r}
                  </td>`;
content = content.replace(tableBodyTarget, tableBodyReplacement);

const activeRowOverlay = `        <div className="inline-block min-w-full rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">`;
const activeRowOverlayReplacement = `
      {activeRow !== null && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 rounded-2xl p-2 flex gap-2">
          <button onClick={() => setRowHeights(prev => ({ ...prev, [activeRow]: (prev[activeRow] || 40) + 10 }))} className="p-2 bg-gray-100 dark:bg-zinc-700 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-600"><Plus size={16} /></button>
          <span className="flex items-center px-2 text-sm font-bold">{state.locale === 'ar' ? 'تغيير حجم الصف ' + activeRow.toString().replace(/\\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]) : 'Row ' + activeRow}</span>
          <button onClick={() => setRowHeights(prev => ({ ...prev, [activeRow]: Math.max(20, (prev[activeRow] || 40) - 10) }))} className="p-2 bg-gray-100 dark:bg-zinc-700 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-600"><Minus size={16} /></button>
          <button onClick={() => setActiveRow(null)} className="p-2 ml-2 bg-red-100 text-red-600 dark:bg-red-900/30 rounded-xl hover:bg-red-200"><X size={16} /></button>
        </div>
      )}
      <div className="inline-block min-w-full rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">`;

content = content.replace(activeRowOverlay, activeRowOverlayReplacement);

fs.writeFileSync('src/components/SpreadsheetScreen.tsx', content);
