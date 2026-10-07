const express = require("express");

const { register, login } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticateToken, async (req, res) => {
    try {
        const { pool } = require("../config/db");

        const [users] = await pool.execute(
            "SELECT id, name, email FROM users WHERE id = ?",
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: users[0]
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Failed to load profile"
        });
    }
});

module.exports = router;