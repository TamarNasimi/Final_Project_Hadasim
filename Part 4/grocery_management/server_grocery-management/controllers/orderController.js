const db = require('../db/db_connection');

const getOrders = (req, res) => {
    const { supplierId } = req.query;
    let sql = `
        SELECT 
            o.id AS order_id,
            o.status,
            u.name AS supplier_name,
            u.representative_name,
            p.name AS product_name,
            oi.quantity,
            oi.price,
            o.supplier_id
        FROM orders o
        JOIN users u ON o.supplier_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
    `;

    const params = [];

    if (supplierId !== undefined && supplierId !== null && supplierId !== '' && supplierId !== 'undefined') {
        sql += ' WHERE o.supplier_id = ?';
        params.push(supplierId);
      }

    sql += ' ORDER BY o.id DESC';

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json(err);

        const ordersMap = {};

        results.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    orderId: row.order_id,
                    status: row.status,
                    supplierId: row.supplier_id,
                    supplierName: row.supplier_name,
                    representativeName: row.representative_name,
                    products: [],
                    total: 0
                };
            }

            ordersMap[row.order_id].products.push({
                name: row.product_name,
                quantity: row.quantity,
                price: row.price
            });

            ordersMap[row.order_id].total += row.quantity * row.price;
        });

        const orders = Object.values(ordersMap);
        res.json(orders);
    });
};


const getSupplierProducts = (req, res) => {
    const { supplierId } = req.params;

    db.query(
        `SELECT p.id, p.name, p.price, p.min_quantity 
         FROM products p 
         JOIN supplier_products sp ON p.id = sp.product_id 
         WHERE sp.supplier_id = ?`, 
        [supplierId], 
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
};

const updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "חובה לציין סטטוס" });
    }

    db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: `סטטוס הזמנה עודכן ל-${status}` });
    });
};

const createOrder = (req, res) => {
    const { supplierId, products } = req.body;

    if (!supplierId || !products || products.length === 0) {
        return res.status(400).json({ error: "חובה לבחור ספק ולפחות מוצר אחד" });
    }

    // יצירת ההזמנה
    db.query('INSERT INTO orders (supplier_id) VALUES (?)', [supplierId], (err, result) => {
        if (err) return res.status(500).json(err);

        const orderId = result.insertId;

        // הוספת המוצרים להזמנה
        const orderItems = products.map(product => [orderId, product.id, product.quantity, product.price]);

        db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [orderItems], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "הזמנה נוצרה בהצלחה", orderId });
        });
    });
};


module.exports = { getOrders, updateOrderStatus, createOrder, getSupplierProducts };
