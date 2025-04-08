const db = require("../db/db_connection");

const getAlerts = async (req, res) => {
    try {
        const query = "SELECT * FROM alerts ORDER BY created_at DESC";
        const [alerts] = await db.promise().query(query);
        res.json(alerts);
    } catch (error) {
        console.error("שגיאה בשליפת ההתראות:", error);
        res.status(500).json({ error: "שגיאה בשליפת ההתראות" });
    }
};

module.exports = { getAlerts };
