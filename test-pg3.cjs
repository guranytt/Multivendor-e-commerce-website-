const postgres = require('postgres');
const sql = postgres('postgres://bad:pass@localhost:54321/db', { max: 1 });
sql`SELECT 1`.catch(e => console.log('caught query error'));
