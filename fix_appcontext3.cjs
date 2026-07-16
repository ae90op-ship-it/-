const fs = require('fs');
let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

code = code.replace(/import \{ AppState, Action, Note, AppType \} from '\.\.\/types';/, "import { AppState, Action, Note, AppType, Theme, Locale } from '../types';");

fs.writeFileSync('src/store/AppContext.tsx', code);
