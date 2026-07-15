const postgres = require('postgres');
const sql = postgres('postgres://baduser:badpass@198.51.100.1:5432/baddb', { max: 1, idle_timeout: 1, connect_timeout: 1 });
async function test() {
  try {
    await sql`SELECT 1`;
  } catch (err) {
    console.log("Caught:", err.message);
  }
}
test();
setTimeout(() => console.log('Done waiting'), 2000);
