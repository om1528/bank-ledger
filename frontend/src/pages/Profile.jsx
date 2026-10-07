import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";

function Profile() {
    const [user, setUser] = useState(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        loadProfile();
    }, []);

    const showNotification = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
    };

    const closeNotification = () => {
        setMessage("");
    };

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(response.data.user);

        } catch (error) {
            showNotification(
                error.response?.data?.message ||
                "Failed to load profile",
                "error"
            );
        }
    };

    const copyUserId = async () => {
        try {
            await navigator.clipboard.writeText(
                String(user.id)
            );

            showNotification(
                "User ID copied!",
                "info"
            );

        } catch (error) {
            showNotification(
                "Failed to copy User ID",
                "error"
            );
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar />

            <Notification
                message={message}
                type={messageType}
                onClose={closeNotification}
            />

            <main className="dashboard-content">

                <div className="profile-page">

                    <div className="profile-header">
                        <div className="profile-avatar">
                            👤
                        </div>

                        <h1>My Profile</h1>

                        <p>
                            Manage your Bank Ledger account
                        </p>
                    </div>

                    {user && (
                        <div className="profile-card">

                            <div className="profile-card-top">

                                <div className="profile-large-avatar">
                                    👤
                                </div>

                                <div>
                                    <h2>{user.name}</h2>
                                    <p>{user.email}</p>
                                </div>

                            </div>

                            <div className="profile-divider" />

                            <div className="profile-item">

                                <div className="profile-item-icon">
                                    👤
                                </div>

                                <div className="profile-item-content">
                                    <span>Full Name</span>
                                    <strong>
                                        {user.name}
                                    </strong>
                                </div>

                            </div>

                            <div className="profile-item">

                                <div className="profile-item-icon">
                                    📧
                                </div>

                                <div className="profile-item-content">
                                    <span>Email Address</span>
                                    <strong>
                                        {user.email}
                                    </strong>
                                </div>

                            </div>

                            <div className="profile-item">

                                <div className="profile-item-icon">
                                    🆔
                                </div>

                                <div className="profile-item-content">
                                    <span>User ID</span>
                                    <strong>
                                        #{user.id}
                                    </strong>
                                </div>

                                <button
                                    className="profile-copy-btn"
                                    onClick={copyUserId}
                                >
                                    📋 Copy
                                </button>

                            </div>

                            <div className="profile-security">

                                <div className="security-icon">
                                    🔒
                                </div>

                                <div>
                                    <strong>
                                        Account Security
                                    </strong>

                                    <p>
                                        Your account is protected
                                        by JWT authentication.
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}

                    <div className="profile-actions">

                        <Link
                            to="/dashboard"
                            className="profile-back-btn"
                        >
                            ← Back to Dashboard
                        </Link>

                        <Link
                            to="/transactions"
                            className="profile-transactions-btn"
                        >
                            📋 View Transactions
                        </Link>

                    </div>

                </div>

            </main>
        </div>
    );
}

export default Profile;