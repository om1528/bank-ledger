import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            return;
        }

        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="navbar">

            <div className="logo">
                🏦 Bank Ledger
            </div>

            <div className="nav-links">

                <Link to="/dashboard">
                    🏠 Dashboard
                </Link>

                <Link to="/transfer">
                    💸 Send Money
                </Link>

                <Link to="/transactions">
                    📋 Transactions
                </Link>

                <Link to="/profile">
                    👤 Profile
                </Link>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;