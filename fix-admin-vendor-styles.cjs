const fs = require('fs');

const files = [
  'src/components/AdminCategories.tsx',
  'src/components/AdminPayouts.tsx',
  'src/components/AdminVendors.tsx',
  'src/components/VendorOrders.tsx',
  'src/components/VendorProducts.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/bg-white/g, 'bg-surface-white');
  content = content.replace(/shadow /g, 'shadow-[0px_20px_25px_rgba(10,10,10,0.05)] ');
  content = content.replace(/shadow-md/g, 'shadow-[0px_20px_25px_rgba(10,10,10,0.05)]');
  content = content.replace(/shadow-sm/g, 'shadow-[0px_10px_20px_rgba(10,10,10,0.03)]');
  content = content.replace(/border-gray-200/g, 'border-surface-variant');
  content = content.replace(/border-gray-300/g, 'border-surface-variant');
  content = content.replace(/text-gray-900/g, 'text-on-surface');
  content = content.replace(/text-gray-800/g, 'text-on-surface');
  content = content.replace(/text-gray-700/g, 'text-on-surface');
  content = content.replace(/text-gray-600/g, 'text-on-surface-variant');
  content = content.replace(/text-gray-500/g, 'text-on-surface-variant');
  content = content.replace(/bg-gray-50/g, 'bg-surface-container-low');
  content = content.replace(/bg-gray-100/g, 'bg-surface-container');
  content = content.replace(/bg-gray-200/g, 'bg-surface-variant');
  
  // Button colors
  content = content.replace(/bg-blue-600/g, 'bg-action-orange text-white');
  content = content.replace(/hover:bg-blue-700/g, 'hover:bg-primary');
  content = content.replace(/text-blue-600/g, 'text-action-orange');
  content = content.replace(/text-blue-800/g, 'text-primary');
  content = content.replace(/bg-blue-100/g, 'bg-primary-container text-on-primary-container');
  
  content = content.replace(/bg-green-600/g, 'bg-success-emerald text-white');
  content = content.replace(/hover:bg-green-700/g, 'hover:bg-[#047857]');
  content = content.replace(/text-green-600/g, 'text-success-emerald');
  content = content.replace(/bg-green-100/g, 'bg-[#d1fae5]');
  content = content.replace(/text-green-800/g, 'text-[#065f46]');

  content = content.replace(/bg-red-600/g, 'bg-error text-white');
  content = content.replace(/hover:bg-red-700/g, 'hover:bg-error');

  // Headings
  content = content.replace(/text-xl font-semibold/g, 'font-headline-md text-headline-md text-on-surface');
  content = content.replace(/text-2xl font-bold/g, 'font-headline-lg text-headline-lg text-on-surface');
  content = content.replace(/text-lg font-medium/g, 'font-title-lg text-title-lg text-on-surface');
  content = content.replace(/text-sm font-medium/g, 'font-label-md text-label-md text-on-surface');

  fs.writeFileSync(file, content);
});
