
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productStoreRoutes = require('./routes/productStoreRoute');
const productRoutes = require('./routes/productRoutes');
const cashRegisterRoutes = require("./routes/cashRegisterRoutes");
const alertsRoutes = require("./routes/alertsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/product-store', productStoreRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cash-register", cashRegisterRoutes);
app.use("/api/alerts", alertsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
