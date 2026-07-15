const postgres = require('postgres');
const sql = postgres('postgres://baduser:badpass@badhost:5432/baddb', { max: 1, idle_timeout: 1 });
async function test() {
  try {
    await sql`SELECT 1`;
  } catch (err) {
    console.log("Caught:", err.message);
  }
}
test();
