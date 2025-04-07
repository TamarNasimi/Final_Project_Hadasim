// var mysql = require('mysql2');

// var db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "12345678",
//   port:3306
// });

// db.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   db.query("CREATE DATABASE grocery_management", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

// module.exports = db;

const db = require('./db_connection');

db.query("CREATE DATABASE IF NOT EXISTS grocery_management", (err, result) => {
  if (err) {
    console.error("Error creating database:", err);
    return;
  }
  console.log("Database created or already exists");
});
