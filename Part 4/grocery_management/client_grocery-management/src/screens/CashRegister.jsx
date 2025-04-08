
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const CashRegister = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Unexpected response:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("שגיאה בטעינת המוצרים:", err);
        setProducts([]);
      });
  }, []);

  const handleQuantityChange = (productId, availableQuantity, quantity) => {
    if (quantity > availableQuantity) {
      setErrorMessage("אין מספיק מלאי למוצר זה!");
      return;
    }

    setCart((prevCart) => ({
      ...prevCart,
      [productId]: quantity >= 0 ? quantity : 0,
    }));
    setErrorMessage("");
  };

  const handleAddToCart = (productId, availableQuantity) => {
    const currentQty = cart[productId] || 0;
    if (currentQty < availableQuantity) {
      setCart((prevCart) => ({
        ...prevCart,
        [productId]: currentQty,
      }));
      setErrorMessage("");
    } else {
      setErrorMessage("הגעת לכמות המקסימלית!");
    }
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = products.find((p) => p.id.toString() === id);
      return product ? sum + product.price * qty : sum;
    }, 0);
  };

  const handleBuy = async () => {
    try {
      const filteredCart = Object.fromEntries(
        Object.entries(cart).filter(([_, qty]) => qty > 0)
      );

      if (Object.keys(filteredCart).length === 0) {
        setErrorMessage("לא נבחרו מוצרים!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/cash-register/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredCart),
      });

      if (!response.ok) throw new Error("שגיאה בשליחת הנתונים לשרת");

      setCart({});
      setErrorMessage("");
      const updatedProducts = await fetch("http://localhost:5000/api/products").then((res) => res.json());
      setProducts(updatedProducts);
    } catch (err) {
      console.error("שגיאה בעדכון המלאי:", err);
      setErrorMessage("אירעה שגיאה בביצוע הקנייה. נסה שוב.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>קופה</h2>
      <button className="link-btn" onClick={() => navigate("/")}>מעבר לדף הראשי</button>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              margin: "10px",
              width: "250px",
              boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{product.name}</h3>
            <p>מחיר: {product.price} ₪</p>
            <p>מלאי זמין: {product.quantity}</p>
            <input
              type="number"
              min="0"
              max={product.quantity}
              value={cart[product.id] || ""}
              onChange={(e) =>
                handleQuantityChange(
                  product.id,
                  product.quantity,
                  parseInt(e.target.value)
                )
              }
              style={{ width: "60px", textAlign: "center" }}
            />
            {product.quantity > 0 && (
              <button onClick={() => handleAddToCart(product.id, product.quantity)} style={{ marginLeft: "10px" }}>
                הוסף לעגלה
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleBuy}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        בצע קנייה
      </button>

      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>{errorMessage}</p>
      )}

      <p style={{ marginTop: "10px", fontSize: "18px" }}>
        סך הכול לתשלום: {getTotalPrice().toFixed(2)} ₪
      </p>
    </div>
  );
};

export default CashRegister;
