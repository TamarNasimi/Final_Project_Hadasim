
// import React, { useEffect, useState } from "react";
// import "../styles/styles.css";

// const ProductStore = () => {
//   const [storeProducts, setStoreProducts] = useState([]);
//   const [minQuantities, setMinQuantities] = useState({});

//   useEffect(() => {
//     fetchProductStore();
//   }, []);

//   const fetchProductStore = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/product-store");
//       if (!res.ok) throw new Error("Failed to fetch product store");
//       const data = await res.json();
//       setStoreProducts(data);

//       const initialMinQuantities = {};
//       data.forEach(p => {
//         initialMinQuantities[p.product_id] = p.min_quantity;
//       });
//       setMinQuantities(initialMinQuantities);
//     } catch (err) {
//       console.error("Failed to fetch product store", err);
//     }
//   };

//   const handleMinChange = (productId, value) => {
//     setMinQuantities(prev => ({
//       ...prev,
//       [productId]: value,
//     }));
//   };

//   const updateMinQuantity = async (productId) => {
//     const minQty = minQuantities[productId];
//     try {
//       const res = await fetch(`http://localhost:5000/api/product-store/${productId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ min_quantity: minQty }),
//       });
//       if (!res.ok) throw new Error("Failed to update min quantity");
//       alert("כמות מינימלית עודכנה בהצלחה!");
//       fetchProductStore();
//     } catch (err) {
//       console.error("Error updating min quantity", err);
//       alert("שגיאה בעדכון כמות מינימלית");
//     }
//   };

//   return (
//     <div className="container">
//       <h2>מוצרים קיימים בחנות</h2>
//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>מזהה מוצר</th>
//               <th>כמות נוכחית</th>
//               <th>כמות מינימלית</th>
//               <th>עדכון</th>
//             </tr>
//           </thead>
//           <tbody>
//             {storeProducts.map((product) => {
//               const isLow = product.current_quantity < product.min_quantity;
//               return (
//                 <tr key={product.product_id} style={{ backgroundColor: isLow ? "#ffe5e5" : "white" }}>
//                   <td>{product.product_id}</td>
//                   <td style={{ color: isLow ? "red" : "black" }}>{product.current_quantity}</td>
//                   <td>
//                     <input
//                       type="number"
//                       value={minQuantities[product.product_id] || ""}
//                       onChange={(e) => handleMinChange(product.product_id, e.target.value)}
//                       style={{ width: "60px" }}
//                     />
//                   </td>
//                   <td>
//                     <button onClick={() => updateMinQuantity(product.product_id)}>
//                       עדכן
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductStore;


import React, { useEffect, useState } from "react";
import "../styles/styles.css";

const ProductStore = () => {
  const [storeProducts, setStoreProducts] = useState([]);
  const [minQuantities, setMinQuantities] = useState({});

  useEffect(() => {
    fetchProductStore();
  }, []);

  const fetchProductStore = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product-store");
      if (!res.ok) throw new Error("Failed to fetch product store");
      const data = await res.json();
      setStoreProducts(data);

      const initialMinQuantities = {};
      data.forEach((p) => {
        initialMinQuantities[p.product_id] = p.min_quantity;
      });
      setMinQuantities(initialMinQuantities);
    } catch (err) {
      console.error("Failed to fetch product store", err);
    }
  };

  const handleMinChange = (productId, value) => {
    const numericValue = Math.max(0, parseInt(value, 10) || 0);
    setMinQuantities((prev) => ({
      ...prev,
      [productId]: numericValue,
    }));
  };

  const updateMinQuantity = async (productId) => {
    const minQty = minQuantities[productId];
    try {
      const res = await fetch(`http://localhost:5000/api/product-store/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ min_quantity: minQty }),
      });
      if (!res.ok) throw new Error("Failed to update min quantity");
      alert("כמות מינימלית עודכנה בהצלחה!");
      fetchProductStore();
    } catch (err) {
      console.error("Error updating min quantity", err);
      alert("שגיאה בעדכון כמות מינימלית");
    }
  };

  return (
    <div className="container">
      <h2>מוצרים קיימים בחנות</h2>
      <div className="card-grid">
        {storeProducts.map((product) => {
          const isLow = product.current_quantity < product.min_quantity;
          return (
            <div key={product.product_id} className="product-card" style={{ borderColor: isLow ? "red" : "#d0e7ff" }}>
              <h3>{product.product_name}</h3>
              <p>
                <strong>כמות נוכחית:</strong>{" "}
                <span style={{ color: isLow ? "red" : "black" }}>{product.current_quantity}</span>
              </p>
              <p>
                <strong>כמות מינימלית:</strong>
              </p>
              <input
                type="number"
                value={minQuantities[product.product_id] || ""}
                onChange={(e) => handleMinChange(product.product_id, e.target.value)}
                style={{ width: "60px", textAlign: "center" }}
              />
              <button className="update-status-btn" onClick={() => updateMinQuantity(product.product_id)}>
                עדכן כמות מינימלית
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductStore;
