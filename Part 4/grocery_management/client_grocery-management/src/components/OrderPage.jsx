
import React, { useEffect, useState, useCallback } from 'react';
import OrderList from '../components/OrderList';

const OrderPage = ({ title, filterStatus = [] }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const supplierId = user?.id;
    let url = 'http://localhost:5000/api/orders';
    if (user?.role === 'supplier') {
      url += `?supplierId=${supplierId}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const filtered = filterStatus.length > 0
          ? data.filter(order => filterStatus.includes(order.status))
          : data;
        setOrders(filtered);
      })
      .catch(err => console.error('שגיאה בקבלת הזמנות:', err));
  }, [filterStatus]); 

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="orders-container">
      <h2 className="orders-title">{title || 'ניהול הזמנות'}</h2>
      <OrderList orders={orders} onStatusChange={fetchOrders} />
    </div>
  );
};

export default OrderPage;
