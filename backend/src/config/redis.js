const { createClient } = require("redis");

const redisClient = createClient({
    socket: {
        host: "127.0.0.1",
        port: 6379
    }
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error);
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Redis connected successfully");
    } catch (error) {
        console.error("Redis connection failed:", error.message);
    }
}

module.exports = {
    redisClient,
    connectRedis
};
