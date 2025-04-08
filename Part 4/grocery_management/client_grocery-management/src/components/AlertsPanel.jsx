
import { useEffect, useState } from "react";
import "../styles/styles.css";

const AlertsPanel = () => {
    const [alerts, setAlerts] = useState([]);

    //הבאת כל ההתראות שקיימות מהטבלה
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/alerts");
                const data = await response.json();
                setAlerts(data);
            } catch (error) {
                console.error("שגיאה בשליפת ההתראות:", error);
            }
        };

        fetchAlerts();
    }, []);

    return (
        <div className="alerts-container">
            <div className="alerts-panel">
                <h3>🔔 התראות</h3>
                {alerts.length === 0 ? (
                    <p className="no-alerts">אין התראות חדשות</p>
                ) : (
                    <ul>
                        {alerts.map(alert => (
                            <li key={alert.id} className="alert-item">
                                <span className="alert-icon">⚠️</span> 
                                {alert.message} 
                                <span className="alert-time">({new Date(alert.created_at).toLocaleString()})</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AlertsPanel;
