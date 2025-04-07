
const db = require("../db/db_connection");

const registerSupplier = (req, res) => {
    const { name, email, password, representativeName, phone, products } = req.body;

    db.query(
        "INSERT INTO users (name, email, password, role, representative_name, phone) VALUES (?, ?, ?, 'supplier', ?, ?)",
        [name, email, password, representativeName, phone],
        async (err, result) => {
            if (err) return res.status(500).json({ message: "שגיאה בהרשמה", error: err });

            const supplierId = result.insertId;
            try {
                await Promise.all(products.map(product => handleProduct(product, supplierId)));
    
                db.query("SELECT id, name, email, role FROM users WHERE id = ?", [supplierId], (err, results) => {
                    if (err || results.length === 0) {
                        return res.status(500).json({ message: "שגיאה בשליפת נתוני המשתמש" });
                    }
                    res.json({ message: "ספק נרשם בהצלחה", user: results[0] });
                   
                });

            } catch (error) {
                res.status(500).json({ message: "שגיאה בהרשמת מוצרים", error });
            }
        }
    );
};


function handleProduct(product, supplierId) {
    const { name, price = 0.00, minQuantity = 1 } = product;
    return new Promise((resolve, reject) => {
        db.query("SELECT id FROM products WHERE name = ?", [name], (err, results) => {
            if (err) return reject(err);

            if (results.length > 0) {
                const productId = results[0].id;
                insertSupplierProduct(supplierId, productId, resolve, reject);
            } else {
                db.query(
                    "INSERT INTO products (name, price, min_quantity) VALUES (?, ?, ?)",
                    [name, price, minQuantity],
                    (err, result) => {
                        if (err) return reject(err);
                        const productId = result.insertId;
                        insertSupplierProduct(supplierId, productId, resolve, reject);
                    }
                );
            }
        });
    });
}

function insertSupplierProduct(supplierId, productId, resolve, reject) {
    db.query("INSERT INTO supplier_products (supplier_id, product_id) VALUES (?, ?)", [supplierId, productId], (err) => {
        if (err) return reject(err);
        resolve();
    });
}

const login = (req, res) => {
    const { email, password, role } = req.body;

    const roleQuery = role === 'manager'
        ? "SELECT * FROM users WHERE email = ? AND password = ? AND role = 'manager'"
        : "SELECT * FROM users WHERE email = ? AND password = ? AND role = 'supplier'";

    db.query(roleQuery, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: "שגיאה בהתחברות", error: err });

        if (results.length === 0) {
            return res.status(401).json({ message: "שם משתמש או סיסמה לא נכונים" });
        }

        res.json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} התחברות בהצלחה`, user: results[0] });
    });
};

const getSuppliers = (req, res) => {
    db.query('SELECT id, name AS supplier_name, representative_name FROM users WHERE role = "supplier"', 
    (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};



module.exports = { registerSupplier, login, getSuppliers  };
