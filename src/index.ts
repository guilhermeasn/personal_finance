import { Database } from "./database.class";
import { Finance } from "./finance.class";

console.log("=== TESTING START ===\n\n");

console.log(Finance.getMonths(3, 25, [12, 18]));

(async () => {
  const db = new Database();
  // await db.set('test', { a: 'abc' });
  // await db.set('test', { b: 'abc' });
  console.log(await db.get('test'));
})();

console.log("\n\n=== TESTING END ===");
