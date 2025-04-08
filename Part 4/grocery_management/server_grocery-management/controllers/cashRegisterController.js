const db = require("../db/db_connection");

const updateStockFromBuy = async (req, res) => {
    try {
        const buyData = req.body; // JSON שמתקבל מהקופה
        
        for (const [productId, count] of Object.entries(buyData)) {
            // עדכון הכמות בטבלת product_store
            const updateQuery = `
              UPDATE product_store 
              SET current_quantity = current_quantity - ?
              WHERE product_id = ?
            `;
            await db.promise().query(updateQuery, [count, productId]);

            // בדיקה אם הכמות ירדה מתחת למינימום
            const checkQuery = `
            SELECT current_quantity, min_quantity 
            FROM product_store 
            WHERE product_id = ?
          `;
            const [rows] = await db.promise().query(checkQuery, [productId]);

            if (rows.length > 0 && rows[0].current_quantity < rows[0].min_quantity) {
                const currentQuantity = rows[0].current_quantity;
                const minQuantity = rows[0].min_quantity;
                const quantityToOrder = minQuantity - currentQuantity; // כמות שחסרה עד למינימום

                // מציאת הספק עם המחיר הזול ביותר
                const supplierQuery = `
                SELECT supplier_id, price, min_quantity 
                FROM supplier_products 
                WHERE product_id = ?
                ORDER BY price ASC 
                LIMIT 1
            `;
                const [supplierRows] = await db.promise().query(supplierQuery, [productId]);

                if (supplierRows.length > 0) {
                    const { supplier_id, price, min_quantity } = supplierRows[0];

                    if (quantityToOrder >= min_quantity) {
                        // יצירת הזמנה לספק
                        const orderQuery = `INSERT INTO orders (supplier_id) VALUES (?)`;
                        const [orderResult] = await db.promise().query(orderQuery, [supplier_id]);
                        const orderId = orderResult.insertId;

                        // הוספת המוצר להזמנה
                        const orderItemQuery = `
                            INSERT INTO order_items (order_id, product_id, quantity, price) 
                            VALUES (?, ?, ?, ?)
                        `;
                        await db.promise().query(orderItemQuery, [orderId, productId, quantityToOrder, price]);
                    } else {
                        // הוספת התראה שהכמות נמוכה מהמינימום של הספק
                        const [productRows] = await db.promise().query("SELECT name FROM products WHERE id = ?", [productId]);
                        const productName = productRows[0]?.name || `ID ${productId}`;
                        
                        const alertQuery = `
                            INSERT INTO alerts (product_id, message) 
                            VALUES (?, ?)
                        `;
                        await db.promise().query(alertQuery, [productId, `לא ניתן להזמין ${productName} כי הכמות הנדרשת (${quantityToOrder}) נמוכה ממינימום ההזמנה של הספק (${min_quantity}).`]);
                    }
                } else {
                    // אם אין ספקים, שמירת ההתראה בטבלה
                    const [productRows] = await db.promise().query("SELECT name FROM products WHERE id = ?", [productId]);
                    const productName = productRows[0]?.name || `ID ${productId}`;

                    const alertQuery = `
                        INSERT INTO alerts (product_id, message) 
                        VALUES (?, ?)
                    `;
                    await db.promise().query(alertQuery, [productId, `המלאי של ${productName} ירד מתחת למינימום ואין ספק שמספק אותו!`]);
                }
            }
        }

        res.json({ message: "מלאי עודכן בהצלחה!" });
    } catch (error) {
        console.error("שגיאה בעדכון המלאי:", error);
        res.status(500).json({ error: "שגיאה בעדכון המלאי" });
    }
};

module.exports = { updateStockFromBuy };
