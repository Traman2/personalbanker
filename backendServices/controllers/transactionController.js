import Transaction from "../models/transactionModel.js";

// Get all transactions by user ID
const getTransactionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.find({ userId });
        res.status(200).send(transactions);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving transactions", error });
    }
};

// Get all transactions by account Number
const getTransactionsByAccountNumber = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const transactions = await Transaction.find({ accountNumber: accountNumber });
        res.status(200).send(transactions);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving transactions", error });
    }
};

export { getTransactionsByUserId, getTransactionsByAccountNumber };