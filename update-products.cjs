const fs = require('fs');
let content = fs.readFileSync('src/api/products.ts', 'utf8');

const regex = /if \(search && typeof search === 'string'\) \{[\s\S]*?const allProducts/m;
const newSearchLogic = `if (search && typeof search === 'string' && search.trim() !== '') {
      // Postgres Full-Text Search
      // Using english dictionary to stem words
      const tsQuery = search.trim().split(/\\s+/).map(word => word + ':*').join(' & ');
      
      query = query.where(
        sql\`to_tsvector('english', \${products.title} || ' ' || coalesce(\${products.description}, '')) @@ to_tsquery('english', \${tsQuery})\`
      ) as any;
    }
    
    const allProducts`;

content = content.replace(regex, newSearchLogic);
fs.writeFileSync('src/api/products.ts', content);
