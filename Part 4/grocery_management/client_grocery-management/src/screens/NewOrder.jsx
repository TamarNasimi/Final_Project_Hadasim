
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewOrder = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [successMessage, setSuccessMessage] = useState(""); 
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/users/suppliers")
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedSupplier) {
            fetch(`http://localhost:5000/api/orders/supplier/${selectedSupplier}/products`)
                .then(res => res.json())
                .then(data => setProducts(data))
                .catch(err => console.error(err));
        } else {
            setProducts([]);
            setSelectedProducts({});
            setTotalPrice(0);
        }
    }, [selectedSupplier]);

    const handleQuantityChange = (productId, minQuantity, price, quantity) => {
        if (quantity < minQuantity) return;

        setSelectedProducts(prev => ({
            ...prev,
            [productId]: { quantity, price }
        }));

        const newTotal = Object.values({ 
            ...selectedProducts, 
            [productId]: { quantity, price } 
        }).reduce((sum, item) => sum + (item.quantity * item.price), 0);

        setTotalPrice(newTotal);
    };

    const handleSubmit = () => {
        if (!selectedSupplier || Object.keys(selectedProducts).length === 0) {
            alert("בחר ספק והוסף מוצרים להזמנה");
            return;
        }

        const orderData = {
            supplierId: selectedSupplier,
            products: Object.entries(selectedProducts).map(([id, details]) => ({
                id: Number(id),
                quantity: details.quantity,
                price: details.price
            }))
        };

        fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        })
            .then(res => res.json())
            .then(() => {
                setSuccessMessage("ההזמנה בוצעה בהצלחה!"); 
                setTimeout(() => navigate("/order-management"), 1500); 
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container">
            <h2>הזמנה חדשה</h2>
            <label>בחר ספק:</label>
            <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
                <option value="">בחר ספק</option>
                {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                        {supplier.supplier_name} ({supplier.representative_name})
                    </option>
                ))}
            </select>

            {products.length > 0 && (
                <div>
                    <h3>מוצרים זמינים</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>מוצר</th>
                                <th>מחיר</th>
                                <th>כמות מינימלית</th>
                                <th>כמות להזמנה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.price} ₪</td>
                                    <td>{product.min_quantity}</td>
                                    <td>
                                        <input 
                                            type="number" 
                                            min={product.min_quantity} 
                                            onChange={(e) => handleQuantityChange(product.id, product.min_quantity, product.price, Number(e.target.value))}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>סה"כ להזמנה: {totalPrice} ₪</h3>
                    <button onClick={handleSubmit}>שלח הזמנה</button>
                    {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default NewOrder;
