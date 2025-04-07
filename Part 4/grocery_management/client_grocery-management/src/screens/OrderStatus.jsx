// screens/OrderStatus.jsx
import React from 'react';
import OrderPage from '../components/OrderPage';

const OrderStatus = () => {
  return <OrderPage title="הזמנות בתהליך" filterStatus={['Pending', 'Process']} />;
};

export default OrderStatus;
