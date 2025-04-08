const express = require("express");
const router = express.Router();
const { updateStockFromBuy } = require("../controllers/cashRegisterController");

router.post("/update-stock", updateStockFromBuy);

module.exports = router;
