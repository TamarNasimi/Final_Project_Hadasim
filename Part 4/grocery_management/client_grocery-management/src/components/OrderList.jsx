
import React from 'react';
import '../styles/styles.css';

const OrderList = ({ orders, onStatusChange }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const getNextStatus = (current) => {
    if (user.role === 'manager' && current === 'Process') return 'Completed';
    if (user.role === 'supplier' && current === 'Pending') return 'Process';
    return null;
  };
//עדכון סטטוס ההזמנה
  const handleStatusUpdate = (orderId, newStatus) => {
    fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => res.json())
      .then(data => {
        onStatusChange(); // רענון הרשימה מחדש
      })
      .catch(err => console.error('שגיאה בעדכון סטטוס:', err));
  };

  if (!orders || orders.length === 0) {
    return <p className="no-orders">לא קיימות הזמנות.</p>;
  }

  return (
    <div className="order-grid">
      {orders.map((order, index) => {
        const nextStatus = getNextStatus(order.status);
        return (
          <div key={index} className="order-card">
            <div className="order-details">
              <p><strong>מזהה הזמנה:</strong> {order.orderId}</p>
              <p><strong>שם ספק:</strong> {order.supplierName}</p>
              <p><strong>שם נציג:</strong> {order.representativeName}</p>
              <p><strong>מוצרים:</strong></p>
              <ul>
                {(order.products || []).map((item, i) => (
                  <li key={i}>
                    {item.name} - כמות: {item.quantity}, מחיר ליחידה: ₪{item.price}
                  </li>
                ))}
              </ul>
              <p><strong>מחיר כולל:</strong> ₪{order.total}</p>
            </div>
            <p className="order-status"><strong>סטטוס:</strong> {order.status}</p>

            {nextStatus && (
              <button
                className="update-status-btn"
                onClick={() => handleStatusUpdate(order.orderId, nextStatus)}
              >
                שנה סטטוס ל־{nextStatus}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
