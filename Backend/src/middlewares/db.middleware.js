const connectDB = require("../config/database");

async function ensureDBConnected(req, res, next) {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("DB connection failed:", err);
        res.status(500).json({
            message: "Database connection error. Please try again."
        });
    }
}

module.exports = { ensureDBConnected };