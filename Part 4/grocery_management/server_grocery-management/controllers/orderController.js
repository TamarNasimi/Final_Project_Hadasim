
const db = require('../db/db_connection');

// שליפת כל ההזמנות (עם מוצרים) עבור ספק מסוים או עבור כולם
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

    if (supplierId && supplierId !== 'undefined') {
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

// שליפת מוצרים של ספק כולל מחיר וכמות מינימלית
const getSupplierProducts = (req, res) => {
    const { supplierId } = req.params;

    const sql = `
        SELECT 
            p.id, 
            p.name, 
            sp.price, 
            sp.min_quantity 
        FROM supplier_products sp
        JOIN products p ON sp.product_id = p.id
        WHERE sp.supplier_id = ?
    `;

    db.query(sql, [supplierId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// עדכון סטטוס של הזמנה, כולל עדכון הסחורה במכולת אם ההזמנה הושלמה
const updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "חובה לציין סטטוס" });
    }

    db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id], (err) => {
        if (err) return res.status(500).json(err);

        if (status === 'Completed') {
            const fetchItemsQuery = `
                SELECT oi.product_id, oi.quantity
                FROM order_items oi
                WHERE oi.order_id = ?
            `;

            db.query(fetchItemsQuery, [id], (err, items) => {
                if (err) return res.status(500).json(err);

                items.forEach(item => {
                    const { product_id, quantity } = item;

                    db.query('SELECT * FROM product_store WHERE product_id = ?', [product_id], (err, results) => {
                        if (err) return res.status(500).json(err);

                        if (results.length > 0) {
                            db.query(
                                'UPDATE product_store SET current_quantity = current_quantity + ? WHERE product_id = ?',
                                [quantity, product_id],
                                (err) => {
                                    if (err) console.error(err);
                                }
                            );
                        } else {
                            db.query(
                                'INSERT INTO product_store (product_id, current_quantity, min_quantity) VALUES (?, ?, 0)',
                                [product_id, quantity],
                                (err) => {
                                    if (err) console.error(err);
                                }
                            );
                        }
                    });
                });
            });
        }

        res.json({ message: `סטטוס הזמנה עודכן ל-${status}` });
    });
};

// יצירת הזמנה חדשה עם מוצרים
const createOrder = (req, res) => {
    const { supplierId, products } = req.body;

    if (!supplierId || !products || products.length === 0) {
        return res.status(400).json({ error: "חובה לבחור ספק ולפחות מוצר אחד" });
    }

    db.query('INSERT INTO orders (supplier_id) VALUES (?)', [supplierId], (err, result) => {
        if (err) return res.status(500).json(err);

        const orderId = result.insertId;

        const orderItems = products.map(product => [orderId, product.id, product.quantity, product.price]);

        db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [orderItems], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "הזמנה נוצרה בהצלחה", orderId });
        });
    });
};

module.exports = {
    getOrders,
    getSupplierProducts,
    updateOrderStatus,
    createOrder
};
