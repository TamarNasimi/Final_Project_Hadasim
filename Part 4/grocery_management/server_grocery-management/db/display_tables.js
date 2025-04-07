const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  port: 3306,
  database: "grocery_management",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to DB");

  const tables = ["users", "products", "supplier_products", "orders", "order_items"];

  let queriesCompleted = 0;

  tables.forEach((table) => {
    con.query(`SELECT * FROM ${table}`, (err, results) => {
      if (err) {
        console.error(`Error fetching from ${table}:`, err.message);
      } else {
        console.log(`\nTable: ${table}`);
        console.table(results);
      }

      queriesCompleted++;
      if (queriesCompleted === tables.length) {
        con.end();
      }
    });
  });
});


