const express = require('express');
const { registerSupplier, login, getSuppliers } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerSupplier);
router.post('/login', login);
router.get('/suppliers', getSuppliers);

module.exports = router;


