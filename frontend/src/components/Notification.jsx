 
import { useEffect } from "react";

function Notification({
    message,
    type = "success",
    onClose
}) {
    useEffect(() => {
        if (!message || !onClose) {
            return;
        }

        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => {
            clearTimeout(timer);
        };
    }, [message, onClose]);

    if (!message) {
        return null;
    }

    return (
        <div className={`notification notification-${type}`}>

            <div className="notification-content">

                <span className="notification-icon">
                    {type === "success" && "✅"}
                    {type === "error" && "❌"}
                    {type === "warning" && "⚠️"}
                    {type === "info" && "ℹ️"}
                </span>

                <span className="notification-message">
                    {message}
                </span>

            </div>

            <button
                className="notification-close"
                onClick={onClose}
                aria-label="Close notification"
            >
                ×
            </button>

        </div>
    );
}

export default Notification;
 
