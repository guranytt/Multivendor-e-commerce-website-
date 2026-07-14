const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import { AuthProvider, useAuth } from './components/AuthProvider';",
  "import { AuthProvider, useAuth } from './components/AuthProvider';\nimport { ErrorBoundary } from './components/ErrorBoundary';"
);

content = content.replace(
  "export default function App() {\n  return (\n    <AuthProvider>",
  "export default function App() {\n  return (\n    <ErrorBoundary>\n      <AuthProvider>"
);

content = content.replace(
  "    </AuthProvider>\n  );\n}",
  "      </AuthProvider>\n    </ErrorBoundary>\n  );\n}"
);

fs.writeFileSync('src/App.tsx', content);
