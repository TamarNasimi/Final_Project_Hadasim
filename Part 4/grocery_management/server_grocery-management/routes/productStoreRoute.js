
const express = require("express");
const router = express.Router();
const { getProductStore, addProductStore, updateProductStore} = require("../controllers/productStoreController");

router.get("/", getProductStore);
router.put("/:product_id", updateProductStore);

module.exports = router;
