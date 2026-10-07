import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Notification from "../components/Notification";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    const handleRegister = async (e) => {
        e.preventDefault();

        closeNotification();

        if (!name || !email || !password || !confirmPassword) {
            showNotification(
                "Please fill all fields",
                "warning"
            );
            return;
        }

        if (password.length < 6) {
            showNotification(
                "Password must be at least 6 characters",
                "warning"
            );
            return;
        }

        if (password !== confirmPassword) {
            showNotification(
                "Passwords do not match",
                "warning"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            showNotification(
                response.data.message ||
                "Account created successfully!",
                "success"
            );

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            showNotification(
                error.response?.data?.message ||
                "Registration failed",
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
                    Create Account
                </h1>

                <p className="auth-subtitle">
                    Create your secure Bank Ledger account
                </p>


                {/* REGISTER FORM */}

                <form onSubmit={handleRegister}>

                    {/* NAME */}

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                    </div>


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

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* REGISTER BUTTON */}

                    <button
                        className="login-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                {/* LOGIN LINK */}

                <p className="register-text">

                    Already have an account?{" "}

                    <Link to="/">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;