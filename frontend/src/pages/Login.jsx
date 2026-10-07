import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Notification from "../components/Notification";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const showNotification = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
    };

    const closeNotification = () => {
        setMessage("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        closeNotification();

        if (!email || !password) {
            showNotification(
                "Please enter email and password",
                "warning"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            showNotification(
                "Login successful! Welcome back.",
                "success"
            );

            setTimeout(() => {
                navigate("/dashboard");
            }, 700);

        } catch (error) {
            showNotification(
                error.response?.data?.message ||
                "Login failed",
                "error"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* NOTIFICATION */}

            <Notification
                message={message}
                type={messageType}
                onClose={closeNotification}
            />


            <div className="auth-card">

                {/* LOGO */}

                <div className="auth-logo">
                    🏦
                </div>


                {/* TITLE */}

                <h1>
                    Bank Ledger
                </h1>

                <p className="auth-subtitle">
                    Securely manage your money
                </p>


                {/* LOGIN FORM */}

                <form onSubmit={handleLogin}>

                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <div className="password-input-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        className="login-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                {/* REGISTER LINK */}

                <p className="register-text">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create Account
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;