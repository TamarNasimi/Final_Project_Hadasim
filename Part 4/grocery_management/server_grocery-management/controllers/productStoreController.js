
const db = require("../db/db_connection");


const getProductStore = (req, res) => {
  const query = `
    SELECT ps.product_id, p.name AS product_name, ps.current_quantity, ps.min_quantity 
    FROM product_store ps 
    JOIN products p ON ps.product_id = p.id`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

const updateProductStore = (req, res) => {
  const { product_id } = req.params;
  const { min_quantity } = req.body;

  if (min_quantity == null) {
    return res.status(400).json({ error: "חובה להזין כמות מינימלית" });
  }

  const query = "UPDATE product_store SET min_quantity = ? WHERE product_id = ?";
  db.query(query, [min_quantity, product_id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
};

module.exports = { getProductStore, updateProductStore };
