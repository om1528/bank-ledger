import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function TransactionDetails() {
    const location = useLocation();
    const transaction = location.state?.transaction;

    const handlePrint = () => {
        window.print();
    };

    if (!transaction) {
        return (
            <div className="dashboard-container">

                <Navbar />

                <main className="dashboard-content">

                    <div className="empty-transactions">

                        <div className="empty-icon">
                            🔍
                        </div>

                        <h2>
                            Transaction Not Found
                        </h2>

                        <p>
                            Please select a transaction
                            from your transaction history.
                        </p>

                        <Link
                            to="/transactions"
                            className="action-btn transactions-btn"
                        >
                            ← Back to Transactions
                        </Link>

                    </div>

                </main>

            </div>
        );
    }

    const isDebit =
        transaction.entry_type === "DEBIT";

    return (
        <div className="dashboard-container">

            <Navbar />

            <main className="dashboard-content">

                <div className="transaction-detail-page">

                    {/* BACK BUTTON */}

                    <Link
                        to="/transactions"
                        className="back-link no-print"
                    >
                        ← Back to Transactions
                    </Link>


                    {/* RECEIPT */}

                    <div className="transaction-receipt">

                        {/* RECEIPT HEADER */}

                        <div className="receipt-header">

                            <div className="receipt-logo">
                                🏦
                            </div>

                            <div>

                                <h1>
                                    Bank Ledger
                                </h1>

                                <p>
                                    Transaction Receipt
                                </p>

                            </div>

                        </div>


                        <div className="receipt-divider" />


                        {/* STATUS */}

                        <div className="receipt-status">

                            <span
                                className={
                                    transaction.status ===
                                    "COMPLETED"
                                        ? "status completed"
                                        : "status"
                                }
                            >
                                {transaction.status ===
                                "COMPLETED"
                                    ? "✓ COMPLETED"
                                    : transaction.status}
                            </span>

                        </div>


                        {/* AMOUNT */}

                        <div className="receipt-amount">

                            <span>
                                {isDebit
                                    ? "Amount Debited"
                                    : "Amount Credited"}
                            </span>

                            <strong
                                className={
                                    isDebit
                                        ? "debit"
                                        : "credit"
                                }
                            >
                                {isDebit ? "−" : "+"}
                                ₹
                                {Number(
                                    transaction.amount
                                ).toFixed(2)}
                            </strong>

                        </div>


                        <div className="receipt-divider" />


                        {/* TRANSACTION INFORMATION */}

                        <div className="receipt-section">

                            <h3>
                                Transaction Information
                            </h3>


                            <div className="receipt-row">

                                <span>
                                    Transaction ID
                                </span>

                                <strong>
                                    #{transaction.id}
                                </strong>

                            </div>


                            <div className="receipt-row">

                                <span>
                                    Account ID
                                </span>

                                <strong>
                                    #{transaction.account_id}
                                </strong>

                            </div>


                            <div className="receipt-row">

                                <span>
                                    Transaction Type
                                </span>

                                <strong
                                    className={
                                        isDebit
                                            ? "debit"
                                            : "credit"
                                    }
                                >
                                    {isDebit
                                        ? "↗ DEBIT"
                                        : "↙ CREDIT"}
                                </strong>

                            </div>


                            <div className="receipt-row">

                                <span>
                                    Status
                                </span>

                                <strong className="success-text">
                                    ✓ {transaction.status}
                                </strong>

                            </div>


                            <div className="receipt-row">

                                <span>
                                    Date & Time
                                </span>

                                <strong>
                                    {new Date(
                                        transaction.created_at
                                    ).toLocaleString()}
                                </strong>

                            </div>

                        </div>


                        <div className="receipt-divider" />


                        {/* REFERENCE */}

                        <div className="receipt-section">

                            <h3>
                                Reference Information
                            </h3>

                            <div className="receipt-reference">

                                <span>
                                    Reference ID
                                </span>

                                <strong>
                                    {transaction.reference_id}
                                </strong>

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div className="receipt-footer">

                            <p>
                                🔒 Securely recorded in the
                                double-entry ledger.
                            </p>

                            <small>
                                Thank you for using Bank Ledger.
                            </small>

                        </div>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="receipt-actions no-print">

                        <button
                            className="print-receipt-btn"
                            onClick={handlePrint}
                        >
                            🖨️ Print Receipt
                        </button>

                        <Link
                            to="/transactions"
                            className="receipt-back-btn"
                        >
                            ← Back to Transactions
                        </Link>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default TransactionDetails;