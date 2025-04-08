// import React from "react";
// import { useNavigate } from "react-router-dom";
// import AlertsPanel from "../components/AlertsPanel"; // נייבא את קומפוננטת ההתראות
// import "../styles/styles.css";

// const OrderManagement = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="order-management-container">
//       <div className="main-content">
//         <h2>ניהול הזמנות</h2>
//         <div className="card-grid">
//           <div className="card" onClick={() => navigate("/new-order")}>
//             <h3>צור הזמנה חדשה</h3>
//             <p>הזמנה לספק עם מוצרים</p>
//           </div>
//           <div className="card" onClick={() => navigate("/order-status")}>
//             <h3>סטטוס הזמנות</h3>
//             <p>הצג הזמנות ממתינות/בתהליך</p>
//           </div>
//           <div className="card" onClick={() => navigate("/all-orders")}>
//             <h3>כל ההזמנות</h3>
//             <p>צפייה בכלל ההזמנות</p>
//           </div>
//           <div className="card" onClick={() => navigate("/product-store")}>
//             <h3>ניהול מלאי מוצרים בחנות</h3>
//             <p>עדכון כמות מינימלית והוספת מוצרים לחנות</p>
//           </div>
//         </div>
//       </div>

//       {/* פאנל ההתראות בצד המסך */}
//       <AlertsPanel /> 
//     </div>
//   );
// };

// export default OrderManagement;
import React from "react";
import { useNavigate } from "react-router-dom";
import AlertsPanel from "../components/AlertsPanel"; // נייבא את קומפוננטת ההתראות
import "../styles/styles.css";

const OrderManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="order-management-container">
      {/* תוכן ראשי */}
      <div className="main-content">
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
          <div className="card" onClick={() => navigate("/product-store")}>
            <h3>ניהול מלאי מוצרים בחנות</h3>
            <p>עדכון כמות מינימלית והוספת מוצרים לחנות</p>
          </div>
        </div>
      </div>

      {/* פאנל ההתראות מימין */}
      <div className="alerts-wrapper">
        <AlertsPanel />
      </div>
    </div>
  );
};

export default OrderManagement;
