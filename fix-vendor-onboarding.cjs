const fs = require('fs');

let content = fs.readFileSync('src/pages/VendorOnboarding.tsx', 'utf8');

content = content.replace(/bg-white/g, 'bg-surface-white');
content = content.replace(/mt-12 rounded-lg shadow/g, 'mt-12 rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] border border-surface-variant');
content = content.replace(/text-2xl font-bold/g, 'font-headline-lg text-headline-lg text-on-surface');
content = content.replace(/text-lg font-medium/g, 'font-title-lg text-title-lg text-on-surface');
content = content.replace(/text-sm font-medium text-gray-700/g, 'font-label-md text-label-md text-on-surface');
content = content.replace(/border border-gray-300 rounded-md shadow-sm p-2/g, 'border border-surface-variant rounded-lg p-3 font-body-md text-body-md bg-surface-white focus:border-action-orange focus:ring-1 focus:ring-action-orange transition-all');
content = content.replace(/bg-blue-600/g, 'bg-action-orange text-white');
content = content.replace(/hover:bg-blue-700/g, 'hover:bg-primary');

// Put it in the new layout? Actually just give it a simple layout structure
const layoutImport = "import { Link } from 'react-router-dom';\n"
content = content.replace("import { useNavigate } from 'react-router-dom';", layoutImport + "import { useNavigate } from 'react-router-dom';");

const newReturn = `return (
    <div className="bg-background-slate min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-surface-white mt-12 rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] border border-surface-variant p-8">
        <Link to="/" className="font-display-lg text-display-lg font-black text-action-orange block text-center mb-8">
          Naija Online Stores
        </Link>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Become a Vendor</h2>`;

content = content.replace(/return \([\s\S]*?<h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Become a Vendor<\/h2>/, newReturn);

// add closing div
content = content.replace(/<\/div>\n  \);\n\}/, '</div>\n    </div>\n  );\n}');


fs.writeFileSync('src/pages/VendorOnboarding.tsx', content);
