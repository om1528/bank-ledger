const express = require("express");

const {
    createAccount,
    getMyAccounts
} = require("../controllers/accountController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createAccount);

router.get("/", authenticateToken, getMyAccounts);

module.exports = router; 