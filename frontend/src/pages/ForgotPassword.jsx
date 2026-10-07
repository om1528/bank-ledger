import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            setMessage("Please enter your email address.");
            return;
        }

        setMessage(
            "Password reset instructions will be sent to your email."
        );
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* ICON */}

                <div className="auth-logo">
                    🔐
                </div>


                {/* TITLE */}

                <h1>
                    Forgot Password?
                </h1>

                <p className="auth-subtitle">
                    Enter your email address and we'll help you
                    reset your password.
                </p>


                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Email Address
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


                    <button
                        className="login-btn"
                        type="submit"
                    >
                        📧 Send Reset Link
                    </button>

                </form>


                {/* MESSAGE */}

                {message && (
                    <div className="auth-message">
                        {message}
                    </div>
                )}


                {/* BACK TO LOGIN */}

                <p className="register-text">

                    Remember your password?{" "}

                    <Link to="/">
                        Back to Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default ForgotPassword;