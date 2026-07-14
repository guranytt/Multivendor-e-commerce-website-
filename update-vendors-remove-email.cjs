const fs = require('fs');
let content = fs.readFileSync('src/api/vendors.ts', 'utf8');

const regex = /\/\/ Fetch customer email to notify them[\s\S]*?res\.json\(updated\[0\]\);/g;

content = content.replace(regex, 'res.json(updated[0]);');

fs.writeFileSync('src/api/vendors.ts', content);
