import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("ALL");

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/transfers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTransactions(response.data.transactions);

        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load transactions"
            );
        }
    };

    const clearFilters = () => {
        setSearch("");
        setFilterType("ALL");
    };

    const filteredTransactions = transactions.filter(
        (transaction) => {

            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                String(transaction.id)
                    .toLowerCase()
                    .includes(searchText) ||
                String(transaction.account_id)
                    .toLowerCase()
                    .includes(searchText) ||
                String(transaction.reference_id)
                    .toLowerCase()
                    .includes(searchText) ||
                String(transaction.amount)
                    .toLowerCase()
                    .includes(searchText);

            const matchesType =
                filterType === "ALL" ||
                transaction.entry_type === filterType;

            return matchesSearch && matchesType;
        }
    );

    return (
        <div className="dashboard-container">

            <Navbar />

            <main className="dashboard-content">

                <div className="transactions-page">

                    {/* HEADER */}

                    <div className="transactions-header">

                        <h1>
                            📋 Transaction History
                        </h1>

                        <p>
                            View and manage your account activity
                        </p>

                    </div>


                    {/* SEARCH & FILTER */}

                    <div className="transaction-filters">

                        <div className="transaction-search">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search transaction, account, reference..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        <div className="transaction-filter-row">

                            <select
                                value={filterType}
                                onChange={(e) =>
                                    setFilterType(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    All Transactions
                                </option>

                                <option value="DEBIT">
                                    ↗ Debit
                                </option>

                                <option value="CREDIT">
                                    ↙ Credit
                                </option>

                            </select>


                            <button
                                className="clear-filter-btn"
                                onClick={clearFilters}
                            >
                                🧹 Clear
                            </button>

                        </div>

                    </div>


                    {/* RESULTS COUNT */}

                    {transactions.length > 0 && (

                        <div className="transaction-results">

                            Showing{" "}
                            <strong>
                                {filteredTransactions.length}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {transactions.length}
                            </strong>{" "}
                            transactions

                        </div>

                    )}


                    {/* MESSAGE */}

                    {message && (
                        <div className="transfer-message">
                            {message}
                        </div>
                    )}


                    {/* EMPTY */}

                    {transactions.length === 0 ? (

                        <div className="empty-transactions">

                            <div className="empty-icon">
                                📭
                            </div>

                            <h2>
                                No Transactions Yet
                            </h2>

                            <p>
                                Your completed transactions
                                will appear here.
                            </p>

                            <Link
                                to="/transfer"
                                className="action-btn send-btn"
                            >
                                💸 Send Money
                            </Link>

                        </div>

                    ) : filteredTransactions.length === 0 ? (

                        <div className="empty-transactions">

                            <div className="empty-icon">
                                🔍
                            </div>

                            <h2>
                                No Matching Transactions
                            </h2>

                            <p>
                                Try changing your search or filter.
                            </p>

                            <button
                                className="action-btn transactions-btn"
                                onClick={clearFilters}
                            >
                                🧹 Clear Filters
                            </button>

                        </div>

                    ) : (

                        <div className="transaction-list">

                            {filteredTransactions.map(
                                (transaction) => (

                                    <div
                                        className="transaction-card"
                                        key={transaction.id}
                                    >

                                        {/* TOP */}

                                        <div className="transaction-top">

                                            <div>

                                                <h3>
                                                    Transaction #
                                                    {transaction.id}
                                                </h3>

                                                <p className="transaction-date">

                                                    {new Date(
                                                        transaction.created_at
                                                    ).toLocaleString()}

                                                </p>

                                            </div>


                                            <span
                                                className={
                                                    transaction.status ===
                                                    "COMPLETED"
                                                        ? "status completed"
                                                        : "status"
                                                }
                                            >
                                                {transaction.status}
                                            </span>

                                        </div>


                                        {/* DETAILS */}

                                        <div className="transaction-details">

                                            <div>

                                                <span>
                                                    Type
                                                </span>

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

                                            </div>


                                            <div>

                                                <span>
                                                    Amount
                                                </span>

                                                <strong className="transaction-amount">
                                                    ₹
                                                    {Number(
                                                        transaction.amount
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Account ID
                                                </span>

                                                <strong>
                                                    #
                                                    {transaction.account_id}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* REFERENCE */}

                                        <div className="reference-id">

                                            <span>
                                                Reference ID
                                            </span>

                                            <small>
                                                {
                                                    transaction.reference_id
                                                }
                                            </small>

                                        </div>


                                        {/* DETAILS BUTTON */}

                                        <Link
                                            to={`/transactions/${transaction.id}`}
                                            state={{
                                                transaction
                                            }}
                                            className="view-details-btn"
                                        >
                                            View Details →
                                        </Link>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default Transactions;