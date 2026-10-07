const { pool } = require("../config/db");


// =========================
// CREATE ACCOUNT
// =========================

async function createAccount(req, res) {
    try {
        const userId = req.user.userId;

        // Generate a simple account number
        const accountNumber =
            "ACC" + Date.now() + Math.floor(Math.random() * 1000);

        const [result] = await pool.execute(
            `INSERT INTO accounts 
            (user_id, account_number, balance, currency)
            VALUES (?, ?, ?, ?)`,
            [userId, accountNumber, 0, "INR"]
        );

        res.status(201).json({
            message: "Account created successfully",
            account: {
                id: result.insertId,
                account_number: accountNumber,
                balance: 0,
                currency: "INR"
            }
        });

    } catch (error) {
        console.error("Create account error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}


// =========================
// GET MY ACCOUNTS
// =========================

async function getMyAccounts(req, res) {
    try {
        const userId = req.user.userId;

        const [accounts] = await pool.execute(
            `SELECT id, account_number, balance, currency, created_at
             FROM accounts
             WHERE user_id = ?
             ORDER BY id DESC`,
            [userId]
        );

        res.json({
            accounts: accounts
        });

    } catch (error) {
        console.error("Get accounts error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    createAccount,
    getMyAccounts
};
