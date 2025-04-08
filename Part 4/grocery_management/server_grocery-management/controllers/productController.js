const db = require("../db/db_connection");

// שליפת כל המוצרים הקיימים במכולת כולל המלאי
const getAllProducts = (req, res) => {
    const query = `
      SELECT p.id, p.name, ps.current_quantity AS quantity, sp.price 
      FROM product_store ps
      JOIN products p ON ps.product_id = p.id
      LEFT JOIN supplier_products sp ON p.id = sp.product_id
    `;
    
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
};

module.exports = { getAllProducts };