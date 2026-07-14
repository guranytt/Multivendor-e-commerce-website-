const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerOrders.tsx', 'utf8');

// Replace standard tailwind with our custom palette
content = content.replace(/bg-white/g, 'bg-surface-white');
content = content.replace(/shadow/g, 'shadow-[0px_20px_25px_rgba(10,10,10,0.05)]');
content = content.replace(/border-gray-200/g, 'border-surface-variant');
content = content.replace(/text-gray-900/g, 'text-on-surface');
content = content.replace(/text-gray-500/g, 'text-on-surface-variant');
content = content.replace(/bg-gray-50/g, 'bg-surface-container-low');
content = content.replace(/bg-blue-100/g, 'bg-primary-container text-on-primary-container');
content = content.replace(/text-blue-800/g, ''); // Handled by above
content = content.replace(/border-b/g, 'border-b border-surface-variant');
content = content.replace(/border /g, 'border border-surface-variant ');
content = content.replace(/text-2xl/g, 'font-headline-lg text-headline-lg');

fs.writeFileSync('src/components/CustomerOrders.tsx', content);
