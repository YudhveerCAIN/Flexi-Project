const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();  // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// GET all transactions
app.get("/transactions", async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST new transaction
app.post("/transactions", async (req, res) => {
    const { description, amount, category, type } = req.body;
    const transaction = new Transaction({ description, amount, category, type });

    try {
        const savedTransaction = await transaction.save();
        res.json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update transaction by ID
app.put("/transactions/:id", async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,    // The ID of the transaction to update
            req.body,         // The new data (sent from the frontend)
            { new: true }     // Return the updated transaction
        );
        res.json(updatedTransaction);   // Send back the updated transaction
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE transaction by ID
app.delete("/transactions/:id", async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
