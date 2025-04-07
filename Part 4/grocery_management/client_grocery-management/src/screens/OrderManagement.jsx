
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const OrderManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>ניהול הזמנות</h2>
      <div className="card-grid">
        <div className="card" onClick={() => navigate("/new-order")}>
          <h3>צור הזמנה חדשה</h3>
          <p>הזמנה לספק עם מוצרים</p>
        </div>
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

export default OrderManagement;
