const fs = require('fs');
let content = fs.readFileSync('src/api/admin.ts', 'utf8');

const regex = /\/\/ Fetch vendor email for notification[\s\S]*?res\.json\(\{ success: true, updatedCount: updated\.length \}\);/m;

content = content.replace(regex, 'res.json({ success: true, updatedCount: updated.length });');

fs.writeFileSync('src/api/admin.ts', content);
