sed -i 's/<button \n          onClick={handleSave}/<div className="flex gap-1">\n          <button \n            onClick={() => setIsOptionsOpen(true)}\n            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-black\/5 dark:hover:bg-white\/10 rounded-full transition-colors"\n          >\n            <Settings2 size={24} \/>\n          <\/button>\n          <button \n          onClick={handleSave}/g' src/components/SpreadsheetScreen.tsx

sed -i 's/<\/button>\n      <\/header>/<\/button>\n        <\/div>\n      <\/header>/g' src/components/SpreadsheetScreen.tsx
