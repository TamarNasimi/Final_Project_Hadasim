const express = require('express');
const { getOrders, createOrder, getSupplierProducts, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

router.get('/', getOrders);
router.get('/supplier/:supplierId/products', getSupplierProducts);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
