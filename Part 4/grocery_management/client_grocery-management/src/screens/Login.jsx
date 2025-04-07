
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const Login = () => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
     // שומר את פרטי המשתמש
localStorage.setItem('user', JSON.stringify({
  id: data.user.id,
  role: data.user.role,
  name: data.user.name
}));
      if (data.user.role === 'supplier') {
        navigate("/supplier-order-management");
      } else if (data.user.role === 'manager') {
        navigate("/order-management");
      }
    } else {
      setError(data.message);
    }
  };

  return (
<div className="container login-container">     
   <h2>כניסה</h2>
      {!role ? (
        <div className="role-select">
          <button className="primary-btn" onClick={() => setRole("manager")}>כניסה כבעל מכולת</button>
          <button className="primary-btn" onClick={() => setRole("supplier")}>כניסה כספק</button>
        </div>
      ) : (
        <>
          <div className="form-group">
            <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="primary-btn" onClick={handleLogin}>התחבר</button>
          {role === "supplier" && (
          <button className="link-btn" onClick={() => navigate("/supplier-register")}>
           אין לך חשבון? הירשם כאן
          </button>
)}
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
};

export default Login;

