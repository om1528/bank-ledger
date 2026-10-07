 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        loadDashboard();
    }, []);

    const showNotification = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
    };

    const closeNotification = () => {
        setMessage("");
    };

    const loadDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const userResponse = await api.get("/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const accountResponse = await api.get("/accounts", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const transactionResponse = await api.get("/transfers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(userResponse.data.user);
            setAccounts(accountResponse.data.accounts);
            setTransactions(transactionResponse.data.transactions);

        } catch (error) {
            console.error(error);

            showNotification(
                error.response?.data?.message ||
                "Failed to load dashboard",
                "error"
            );
        }
    };

    const createAccount = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.post(
                "/accounts",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            showNotification(
                "Account created successfully!",
                "success"
            );

            await loadDashboard();

        } catch (error) {
            showNotification(
                error.response?.data?.message ||
                "Failed to create account",
                "error"
            );
        }
    };

    const copyAccountNumber = async (accountNumber) => {
        try {
            await navigator.clipboard.writeText(accountNumber);

            showNotification(
                "Account number copied!",
                "info"
            );

        } catch (error) {
            showNotification(
                "Failed to copy account number",
                "error"
            );
        }
    };

    const totalBalance = accounts.reduce(
        (total, account) =>
            total + Number(account.balance),
        0
    );

    const totalAccounts = accounts.length;

    const totalTransactions = transactions.length;

    const totalCredit = transactions
        .filter(
            (transaction) =>
                transaction.entry_type === "CREDIT"
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

    const totalDebit = transactions
        .filter(
            (transaction) =>
                transaction.entry_type === "DEBIT"
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

    const netFlow = totalCredit - totalDebit;

    return (
        <div className="dashboard-container">

            <Navbar />

            <Notification
                message={message}
                type={messageType}
                onClose={closeNotification}
            />

            <main className="dashboard-content">

                {user && (
                    <div className="welcome-card">
                        <h1>
                            Welcome, {user.name} 👋
                        </h1>

                        <p>
                            {user.email}
                        </p>
                    </div>
                )}

                {/* Dashboard Statistics */}

                <div className="dashboard-statistics">

                    <div className="stat-card balance-stat">

                        <div className="stat-icon">
                            💰
                        </div>

                        <div className="stat-content">

                            <span>
                                Total Balance
                            </span>

                            <strong>
                                ₹{totalBalance.toFixed(2)}
                            </strong>

                            <small>
                                Across all accounts
                            </small>

                        </div>

                    </div>

                    <div className="stat-card account-stat">

                        <div className="stat-icon">
                            💳
                        </div>

                        <div className="stat-content">

                            <span>
                                Total Accounts
                            </span>

                            <strong>
                                {totalAccounts}
                            </strong>

                            <small>
                                Active accounts
                            </small>

                        </div>

                    </div>

                    <div className="stat-card transaction-stat">

                        <div className="stat-icon">
                            📋
                        </div>

                        <div className="stat-content">

                            <span>
                                Total Transactions
                            </span>

                            <strong>
                                {totalTransactions}
                            </strong>

                            <small>
                                Recorded transactions
                            </small>

                        </div>

                    </div>

                </div>


                {/* Financial Overview */}

                <div className="financial-overview">

                    <div className="financial-overview-header">

                        <div>

                            <h2>
                                📈 Financial Overview
                            </h2>

                            <p>
                                Summary of your transaction activity
                            </p>

                        </div>

                    </div>

                    <div className="financial-grid">

                        <div className="financial-card credit-card">

                            <div className="financial-icon">
                                ↙
                            </div>

                            <div className="financial-content">

                                <span>
                                    Total Credit
                                </span>

                                <strong>
                                    ₹{totalCredit.toFixed(2)}
                                </strong>

                                <small>
                                    Money received
                                </small>

                            </div>

                        </div>


                        <div className="financial-card debit-card">

                            <div className="financial-icon">
                                ↗
                            </div>

                            <div className="financial-content">

                                <span>
                                    Total Debit
                                </span>

                                <strong>
                                    ₹{totalDebit.toFixed(2)}
                                </strong>

                                <small>
                                    Money sent
                                </small>

                            </div>

                        </div>


                        <div className="financial-card net-card">

                            <div className="financial-icon">
                                ⚖️
                            </div>

                            <div className="financial-content">

                                <span>
                                    Net Flow
                                </span>

                                <strong
                                    className={
                                        netFlow >= 0
                                            ? "net-positive"
                                            : "net-negative"
                                    }
                                >
                                    {netFlow >= 0 ? "+" : "−"}
                                    ₹{Math.abs(netFlow).toFixed(2)}
                                </strong>

                                <small>
                                    Credit minus Debit
                                </small>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Accounts */}

                <div className="section-header">

                    <h2>
                        💳 My Accounts
                    </h2>

                    <button
                        className="create-btn"
                        onClick={createAccount}
                    >
                        + Create New Account
                    </button>

                </div>


                {accounts.length === 0 ? (

                    <div className="welcome-card">

                        <p>
                            No accounts found.
                        </p>

                    </div>

                ) : (

                    <div className="account-grid">

                        {accounts.map((account) => (

                            <div
                                className="account-card"
                                key={account.id}
                            >

                                <h3>
                                    Account #{account.id}
                                </h3>

                                <p className="account-number">
                                    {account.account_number}
                                </p>


                                <button
                                    className="copy-account-btn"
                                    onClick={() =>
                                        copyAccountNumber(
                                            account.account_number
                                        )
                                    }
                                >
                                    📋 Copy Account Number
                                </button>


                                <p className="balance-label">
                                    Available Balance
                                </p>

                                <p className="balance">
                                    ₹
                                    {Number(
                                        account.balance
                                    ).toFixed(2)}
                                </p>

                                <p className="currency">
                                    {account.currency}
                                </p>

                                <p className="account-created">
                                    📅 Created:{" "}
                                    {new Date(
                                        account.created_at
                                    ).toLocaleDateString()}
                                </p>


                                {/* Account Details Button */}

                                 

                            </div>

                        ))}

                    </div>

                )}


                {/* Recent Transactions */}

                <div className="recent-transactions">

                    <div className="section-header">

                        <h2>
                            📋 Recent Transactions
                        </h2>

                        <Link
                            to="/transactions"
                            className="view-all-link"
                        >
                            View All →
                        </Link>

                    </div>


                    {transactions.length === 0 ? (

                        <div className="welcome-card">

                            <p>
                                No transactions yet.
                            </p>

                        </div>

                    ) : (

                        <div className="recent-transaction-list">

                            {transactions
                                .slice(0, 5)
                                .map((transaction) => (

                                    <div
                                        className="recent-transaction-card"
                                        key={transaction.id}
                                    >

                                        <div className="recent-transaction-info">

                                            <strong>
                                                Transaction #
                                                {transaction.id}
                                            </strong>

                                            <span>
                                                {new Date(
                                                    transaction.created_at
                                                ).toLocaleString()}
                                            </span>

                                        </div>


                                        <div className="recent-transaction-right">

                                            <strong
                                                className={
                                                    transaction.entry_type ===
                                                    "DEBIT"
                                                        ? "debit"
                                                        : "credit"
                                                }
                                            >
                                                {transaction.entry_type ===
                                                "DEBIT"
                                                    ? "↗ DEBIT"
                                                    : "↙ CREDIT"}
                                            </strong>

                                            <span className="recent-amount">
                                                ₹
                                                {Number(
                                                    transaction.amount
                                                ).toFixed(2)}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                        </div>

                    )}

                </div>


                {/* Quick Actions */}

                <div className="quick-actions">

                    <Link
                        to="/transfer"
                        className="action-btn send-btn"
                    >
                        💸 Send Money
                    </Link>

                    <Link
                        to="/transactions"
                        className="action-btn transactions-btn"
                    >
                        📋 View Transactions
                    </Link>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;
 
