const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    port: 3306,
    database: "grocery_management"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");

    // מחיקת טבלאות אם הן קיימות
    const dropTables = [
        "DROP TABLE IF EXISTS supplier_products",
        "DROP TABLE IF EXISTS orders",
        "DROP TABLE IF EXISTS products",
        "DROP TABLE IF EXISTS users"
    ];

    dropTables.forEach((query) => {
        con.query(query, (err) => {
            if (err) throw err;
        });
    });

    console.log("Existing tables dropped (if existed)");

    const sql = [
        // טבלת משתמשים (ספקים ובעל המכולת)
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('supplier', 'manager') NOT NULL,
            representative_name VARCHAR(255) DEFAULT NULL,
            phone VARCHAR(20) DEFAULT NULL
        )`,

        // טבלת מוצרים (כל המוצרים האפשריים להזמנה)
        `CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            price DECIMAL(10,2) NOT NULL,
            min_quantity INT NOT NULL
        )`,

        // טבלת הזמנות
        `CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            supplier_id INT,
            status ENUM('Pending', 'Process', 'Completed') DEFAULT 'Pending',
            FOREIGN KEY (supplier_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // קשר בין ספקים למוצרים
        `CREATE TABLE IF NOT EXISTS supplier_products (
            supplier_id INT,
            product_id INT,
            PRIMARY KEY (supplier_id, product_id),
            FOREIGN KEY (supplier_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            product_id INT,
            quantity INT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )`
    ];

    sql.forEach((query) => {
        con.query(query, (err) => {
            if (err) throw err;
        });
    });

    // הכנסת בעל המכולת עם שם משתמש וסיסמה קבועים
    const insertAdminQuery = `INSERT INTO users (name, email, password, role) 
                              VALUES ('Admin', 'admin@store.com', 'admin123', 'manager')
                              ON DUPLICATE KEY UPDATE email=email`;

    con.query(insertAdminQuery, (err) => {
        if (err) throw err;
        console.log("Admin user inserted successfully!");
    });

    console.log("Tables created successfully!");
    con.end();
});
