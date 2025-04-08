

const db = require('./db_connection');

db.query("CREATE DATABASE IF NOT EXISTS grocery_management", (err, result) => {
  if (err) {
    console.error("Error creating database:", err);
    return;
  }
  console.log("Database created or already exists");
});
