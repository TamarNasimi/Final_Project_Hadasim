

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const SupplierRegister = () => {
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([{ name: "", price: "", minQuantity: "" }]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validatePhone = (phone) => /^0\d{8,9}$/.test(phone);
  const validateNumber = (num) => num !== "" && Number(num) >= 0;

  const handleRegister = async () => {
    if (!companyName.trim()) return setError("שם החברה חובה");
    if (!representativeName.trim()) return setError("שם הנציג חובה");
    if (!validateEmail(email)) return setError("אימייל לא תקין");
    if (!validatePassword(password)) return setError("סיסמה חייבת להכיל לפחות 6 תווים");
    if (!validatePhone(phone)) return setError("מספר טלפון לא תקין (חייב להכיל 9 או 10 ספרות ולהתחיל ב-0)");

    for (let product of products) {
      if (product.name.trim() && (!validateNumber(product.price) || !validateNumber(product.minQuantity))) {
        return setError("מחיר וכמות מינימלית חייבים להיות מספרים חיוביים");
      }
    }

    const cleanedProducts = products.filter(p => p.name.trim() !== "");

    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: companyName,
        email,
        password,
        phone,
        representativeName,
        role: "supplier",
        products: cleanedProducts
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        role: data.user.role,
        name: data.user.name
      }));
      navigate("/supplier-order-management");
    } else {
      setError(data.message);
    }
  };

  const updateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  return (
    <div className="container">
      <h2>הרשמת ספק</h2>
      <input type="text" placeholder="שם חברה" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      <input type="text" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input type="text" placeholder="שם נציג" value={representativeName} onChange={(e) => setRepresentativeName(e.target.value)} />
      <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} />

      <h3>:מוצרים</h3>
      
      {products.map((product, index) => (
    <div 
        key={index} 
        style={{ 
            border: "1px solid #ccc", 
            padding: "10px", 
            marginBottom: "15px", 
            borderRadius: "5px",
            backgroundColor: "#f9f9f9"
        }}
    >
        <input
            type="text"
            placeholder="שם מוצר"
            value={product.name}
            onChange={(e) => updateProduct(index, "name", e.target.value)}
        />
        <input
            type="number"
            placeholder="מחיר"
            value={product.price}
            onChange={(e) => updateProduct(index, "price", e.target.value)}
            min="0"
        />
        <input
            type="number"
            placeholder="כמות מינימלית"
            value={product.minQuantity}
            onChange={(e) => updateProduct(index, "minQuantity", e.target.value)}
            min="0"
        />
    </div>
))}

      <button className="primary-btn small-btn" onClick={() => setProducts([...products, { name: "", price: "", minQuantity: "" }])}>הוסף מוצר</button>
      <button className="primary-btn" onClick={handleRegister}>הירשם</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SupplierRegister;
