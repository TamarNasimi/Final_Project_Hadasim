// screens/SupplierOrderManagement.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const SupplierOrderManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>ניהול הזמנות לספק</h2>
      <div className="card-grid">
        <div className="card" onClick={() => navigate("/order-status")}>
          <h3>סטטוס הזמנות</h3>
          <p>הצג הזמנות ממתינות/בתהליך</p>
        </div>
        <div className="card" onClick={() => navigate("/all-orders")}>
          <h3>כל ההזמנות</h3>
          <p>צפייה בכלל ההזמנות</p>
        </div>
      </div>
    </div>
  );
};

export default SupplierOrderManagement;
