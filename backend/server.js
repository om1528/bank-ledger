const express = require("express");
const cors = require("cors");
require("dotenv").config();


const { testConnection } = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");
const authRoutes = require("./src/routes/authRoutes");
const accountRoutes = require("./src/routes/accountRoutes");
const transferRoutes = require("./src/routes/transferRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transfers", transferRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Bank Ledger Backend is running!"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    await testConnection();
    await connectRedis();   
});
