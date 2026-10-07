const { pool } = require("../config/db");
const crypto = require("crypto");
const { redisClient } = require("../config/redis");

async function transferMoney(req, res) {
    const connection = await pool.getConnection();

    try {
        const userId = req.user.userId;

        const {
            fromAccountId,
            toAccountId,
            amount,
            idempotencyKey
        } = req.body;

        // Basic validation
        if (!fromAccountId || !toAccountId || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: "fromAccountId, toAccountId, amount and idempotencyKey are required"
            });
        }

        if (fromAccountId === toAccountId) {
            return res.status(400).json({
                message: "Cannot transfer to the same account"
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        await connection.beginTransaction();
        const redisKey = `idempotency:${idempotencyKey}`;

const redisExists = await redisClient.get(redisKey);

if (redisExists) {
    await connection.rollback();

    return res.json({
        message: "Transaction already processed (Redis)",
        transaction: JSON.parse(redisExists)
    });
}

        // Check idempotency key
        const [existingTransaction] = await connection.execute(
            `SELECT id, reference_id, status
             FROM ledger_transactions
             WHERE idempotency_key = ?
             FOR UPDATE`,
            [idempotencyKey]
        );

        if (existingTransaction.length > 0) {
            await connection.rollback();

            return res.json({
                message: "Transaction already processed",
                transaction: existingTransaction[0]
            });
        }

        // Lock sender account
        const [senderRows] = await connection.execute(
            `SELECT id, user_id, balance, currency
             FROM accounts
             WHERE id = ?
             FOR UPDATE`,
            [fromAccountId]
        );

        if (senderRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Sender account not found"
            });
        }

        // Check sender belongs to logged-in user
        if (senderRows[0].user_id !== userId) {
            await connection.rollback();

            return res.status(403).json({
                message: "You do not own the sender account"
            });
        }

        // Lock receiver account
        const [receiverRows] = await connection.execute(
            `SELECT id, user_id, balance, currency
             FROM accounts
             WHERE id = ?
             FOR UPDATE`,
            [toAccountId]
        );

        if (receiverRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Receiver account not found"
            });
        }

        const sender = senderRows[0];
        const receiver = receiverRows[0];

        // Check balance
        if (Number(sender.balance) < Number(amount)) {
            await connection.rollback();

            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const referenceId = crypto.randomUUID();

        // Create transaction
        const [transactionResult] = await connection.execute(
            `INSERT INTO ledger_transactions
             (reference_id, idempotency_key, status)
             VALUES (?, ?, 'PENDING')`,
            [referenceId, idempotencyKey]
        );

        const transactionId = transactionResult.insertId;

        // Debit sender
        await connection.execute(
            `UPDATE accounts
             SET balance = balance - ?
             WHERE id = ?`,
            [amount, fromAccountId]
        );

        // Credit receiver
        await connection.execute(
            `UPDATE accounts
             SET balance = balance + ?
             WHERE id = ?`,
            [amount, toAccountId]
        );

        // Ledger DEBIT
        await connection.execute(
            `INSERT INTO ledger_entries
             (transaction_id, account_id, entry_type, amount)
             VALUES (?, ?, 'DEBIT', ?)`,
            [transactionId, fromAccountId, amount]
        );

        // Ledger CREDIT
        await connection.execute(
            `INSERT INTO ledger_entries
             (transaction_id, account_id, entry_type, amount)
             VALUES (?, ?, 'CREDIT', ?)`,
            [transactionId, toAccountId, amount]
        );

        // Mark transaction completed
        await connection.execute(
            `UPDATE ledger_transactions
             SET status = 'COMPLETED'
             WHERE id = ?`,
            [transactionId]
        );

        await connection.commit();

const transactionData = {
    id: transactionId,
    reference_id: referenceId,
    from_account: fromAccountId,
    to_account: toAccountId,
    amount: amount,
    status: "COMPLETED"
};

await redisClient.set(
    redisKey,
    JSON.stringify(transactionData),
    {
        EX: 86400
    }
);

res.status(201).json({
    message: "Transfer successful",
    transaction: transactionData
});

    } catch (error) {

        await connection.rollback();

        console.error("Transfer error:", error);

        res.status(500).json({
            message: "Transfer failed"
        });

    } finally {
        connection.release();
    }
}
async function getMyTransfers(req, res) {
    try {
        const userId = req.user.userId;

        const [transactions] = await pool.execute(
            `SELECT
                lt.id,
                lt.reference_id,
                lt.status,
                lt.created_at,
                le.account_id,
                le.entry_type,
                le.amount
             FROM ledger_transactions lt
             JOIN ledger_entries le
                ON lt.id = le.transaction_id
             JOIN accounts a
                ON le.account_id = a.id
             WHERE a.user_id = ?
             ORDER BY lt.created_at DESC`,
            [userId]
        );

        res.json({
            transactions
        });

    } catch (error) {
        console.error("Get transfers error:", error);

        res.status(500).json({
            message: "Failed to get transaction history"
        });
    }
}
async function reconcileLedger(req, res) {
    try {
        const [rows] = await pool.execute(`
            SELECT
                COALESCE(SUM(CASE
                    WHEN entry_type = 'DEBIT' THEN amount
                    ELSE 0
                END), 0) AS total_debit,

                COALESCE(SUM(CASE
                    WHEN entry_type = 'CREDIT' THEN amount
                    ELSE 0
                END), 0) AS total_credit

            FROM ledger_entries
        `);

        const totalDebit = Number(rows[0].total_debit);
        const totalCredit = Number(rows[0].total_credit);

        const balanced =
            totalDebit.toFixed(4) === totalCredit.toFixed(4);

        res.json({
            balanced,
            total_debit: totalDebit,
            total_credit: totalCredit,
            difference: Number(
                (totalDebit - totalCredit).toFixed(4)
            ),
            message: balanced
                ? "Ledger is balanced"
                : "Ledger is NOT balanced"
        });

    } catch (error) {
        console.error("Reconciliation error:", error);

        res.status(500).json({
            message: "Reconciliation failed"
        });
    }
}
module.exports = {
    transferMoney,
    getMyTransfers,
    reconcileLedger
};