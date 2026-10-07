import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";

function Transfer() {
    const [accounts, setAccounts] = useState([]);
    const [fromAccountId, setFromAccountId] = useState("");
    const [toAccountId, setToAccountId] = useState("");
    const [amount, setAmount] = useState("");

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAccounts();
    }, []);

    const showNotification = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
    };

    const closeNotification = () => {
        setMessage("");
    };

    const loadAccounts = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/accounts", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAccounts(response.data.accounts);

        } catch (error) {
            showNotification(
                error.response?.data?.message ||
                "Failed to load accounts",
                "error"
            );
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();

        closeNotification();

        if (!fromAccountId || !toAccountId || !amount) {
            showNotification(
                "Please fill all fields",
                "warning"
            );
            return;
        }

        if (Number(fromAccountId) === Number(toAccountId)) {
            showNotification(
                "Sender and receiver accounts must be different",
                "warning"
            );
            return;
        }

        if (Number(amount) <= 0) {
            showNotification(
                "Amount must be greater than 0",
                "warning"
            );
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const idempotencyKey =
                "transfer-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 10);

            const response = await api.post(
                "/transfers",
                {
                    fromAccountId: Number(fromAccountId),
                    toAccountId: Number(toAccountId),
                    amount: Number(amount),
                    idempotencyKey: idempotencyKey
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            showNotification(
                response.data.message +
                " | Transaction ID: " +
                response.data.transaction.id,
                "success"
            );

            setAmount("");
            setToAccountId("");

            await loadAccounts();

        } catch (error) {
            showNotification(
                error.response?.data?.message ||
                "Transfer failed",
                "error"
            );

        } finally {
            setLoading(false);
        }
    };

    const selectedAccount = accounts.find(
        (account) =>
            Number(account.id) === Number(fromAccountId)
    );

    return (
        <div className="dashboard-container">

            <Navbar />

            <Notification
                message={message}
                type={messageType}
                onClose={closeNotification}
            />

            <main className="dashboard-content">

                <div className="transfer-page">

                    <div className="transfer-header">

                        <h1>
                            💸 Send Money
                        </h1>

                        <p>
                            Transfer money securely between accounts
                        </p>

                    </div>


                    <div className="transfer-card">

                        <form onSubmit={handleTransfer}>

                            {/* FROM ACCOUNT */}

                            <div className="form-group">

                                <label>
                                    From Account
                                </label>

                                <select
                                    value={fromAccountId}
                                    onChange={(e) =>
                                        setFromAccountId(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select sender account
                                    </option>

                                    {accounts.map((account) => (

                                        <option
                                            key={account.id}
                                            value={account.id}
                                        >
                                            Account #{account.id}
                                            {" — "}
                                            {account.account_number}
                                            {" — ₹"}
                                            {Number(
                                                account.balance
                                            ).toFixed(2)}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* AVAILABLE BALANCE */}

                            {selectedAccount && (

                                <div className="available-balance">

                                    <span>
                                        Available Balance
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            selectedAccount.balance
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            )}


                            {/* RECEIVER */}

                            <div className="form-group">

                                <label>
                                    Receiver Account ID
                                </label>

                                <input
                                    type="number"
                                    placeholder="Enter receiver account ID"
                                    value={toAccountId}
                                    onChange={(e) =>
                                        setToAccountId(
                                            e.target.value
                                        )
                                    }
                                />

                                <small>
                                    Enter the account ID of the
                                    person receiving the money.
                                </small>

                            </div>


                            {/* AMOUNT */}

                            <div className="form-group">

                                <label>
                                    Amount
                                </label>

                                <div className="amount-input">

                                    <span>
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            {/* SEND BUTTON */}

                            <button
                                className="transfer-btn"
                                type="submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Processing Transfer..."
                                    : "💸 Send Money"}

                            </button>

                        </form>

                    </div>


                    {/* SECURITY NOTE */}

                    <div className="security-note">

                        🔒 Your transfer is protected by
                        transaction processing and
                        duplicate-transfer protection.

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Transfer;