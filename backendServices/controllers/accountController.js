import Account from "../models/accountModel.js";
import User from "../models/userModel.js";

// Create a new account
const createAccount = async (req, res) => {
    try {
        const { accountName, userId } = req.body;
        console.log(typeof userId);
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create new account
        const newAccount = new Account({
            accountName,
            userName: user.userName,
            userId,
        });

        const savedAccount = await newAccount.save();
        res.status(201).send(savedAccount);
    } catch (error) {
        res.status(500).json({ message: "Error creating account", error });
    }
};

// Get account details by userId
const getAccountByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const account = await Account.find({ userId });
        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        res.send(account);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving account", error });
    }
};

// Deposit money into an account
const depositMoney = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        if (amount <= 0) {
            return res.status(400).send({ message: "Deposit amount must be greater than 0" });
        }
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        account.balance += amount;
        const finalEdit = await account.save();

        res.send({ message: "Deposit successful", balance: finalEdit.balance });
    } catch (error) {
        res.status(500).send({ message: "Error processing deposit", error });
    }
};

// Withdraw money from an account
const withdrawMoney = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (amount <= 0) {
            return res.status(400).send({ message: "Withdrawal amount must be greater than 0" });
        }

        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        if (account.balance < amount) {
            return res.status(400).send({ message: "Insufficient funds" });
        }

        account.balance -= amount;
        const finalEdit = await account.save();

        res.send({ message: "Withdrawal successful", balance: finalEdit.balance });
    } catch (error) {
        res.status(500).json({ message: "Error processing withdrawal", error });
    }
};

// Delete an account
const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAccount = await Account.findByIdAndDelete(id);

        if (!deletedAccount) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.send({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting account", error });
    }
};

export {
    createAccount,
    getAccountByUserId,
    depositMoney,
    withdrawMoney,
    deleteAccount
}
