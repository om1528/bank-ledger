const express = require("express");

const {
    transferMoney,
    getMyTransfers,
    reconcileLedger
} = require("../controllers/transferController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, transferMoney);

router.get("/", authenticateToken, getMyTransfers);

router.get("/reconcile", authenticateToken, reconcileLedger);

module.exports = router;