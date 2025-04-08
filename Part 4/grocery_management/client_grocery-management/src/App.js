import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import SupplierRegister from "./screens/SupplierRegister";
import OrderManagement from "./screens/OrderManagement";
import SupplierOrderManagement from "./screens/SupplierOrderManagement";
import NewOrder from "./screens/NewOrder";
import OrderStatus from "./screens/OrderStatus";
import AllOrders from "./screens/AllOrders";
import ProductStore from "./screens/ProductStore";
import CashRegister from "./screens/CashRegister";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/supplier-register" element={<SupplierRegister />} />
      <Route path="/order-management" element={<OrderManagement />} />
      <Route path="/supplier-order-management" element={<SupplierOrderManagement />} />
      <Route path="/new-order" element={<NewOrder />} />
      <Route path="/order-status" element={<OrderStatus />} />
      <Route path="/all-orders" element={<AllOrders />} />
      <Route path="/product-store" element={<ProductStore />} />
      <Route path="/cash-register" element={<CashRegister />} />
    </Routes>
  );
}

export default App;
