import { Database } from "./database.class";
import { Finance } from "./finance.class";

(async () => {

  console.log("=== TESTING START ===\n\n");

  const db = new Database();
  const fn = new Finance(db);

  await fn.setCategories({
    'Recebimentos': 2,
    'Cartão de Crédito': 1,
    'Despesas Fixas': 3
  });

  console.log(await fn.getCategories());
  console.log(await fn.getCategories(true));

  // await fn.setInput(11, 2025, {
  //   day: 2,
  //   category: 0,
  //   description: 'Salário',
  //   value: 32000,
  //   done: true,
  //   step: [3, 12]
  // });


  // console.log(await fn.getMonth(3, 2026));

  // await fn.removeInput(3, 2026, '990fd5c1-f5c9-4e15-812e-6e0e91b41b53', 'ALL');

  console.log("\n\n=== TESTING END ===");

})();
