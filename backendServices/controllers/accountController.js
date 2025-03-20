import Account from "../models/accountModel.js";
import User from "../models/userModel.js";

// Create a new account
const createAccount = async (req, res) => {
  try {
    const { accountName, userId } = req.body;
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
    const { accountNum } = req.params;
    const { amount } = req.body;
    if (amount <= 0) {
      return res
        .status(400)
        .send({ message: "Deposit amount must be greater than 0" });
    }
    const account = await Account.findOne({ accountNumber: accountNum });
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
    const { accountNum } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
      return res
        .status(400)
        .send({ message: "Withdrawal amount must be greater than 0" });
    }

    const account = await Account.findOne({ accountNumber: accountNum });
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
    const { accountNum } = req.params;

    const deletedAccount = await Account.findOneAndDelete({
      accountNumber: accountNum,
    });

    if (!deletedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.send({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error });
  }
};

//Transfer Money
const transferMoney = async (req, res) => {
  try {
    const { accountNum, recipient } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
      return res
        .status(400)
        .send({ message: "Transfer amount must be greater than 0" });
    }

    const senderAccount = await Account.findOne({ accountNumber: accountNum });
    const recipientAccount = await Account.findOne({
      accountNumber: recipient,
    });

    if (!senderAccount) {
      return res.status(404).send({ message: "Sender account not found" });
    }
    if (!recipientAccount) {
      return res.status(404).send({ message: "Recipient account not found" });
    }

    if (senderAccount.balance < amount) {
      return res.status(400).send({ message: "Insufficient funds" });
    }

    senderAccount.balance -= amount;
    recipientAccount.balance += amount;

    await senderAccount.save();
    await recipientAccount.save();

    res.send({
      message: "Transfer successful",
      senderBalance: senderAccount.balance,
      recipientBalance: recipientAccount.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing transfer", error });
  }
};

export {
  createAccount,
  getAccountByUserId,
  depositMoney,
  withdrawMoney,
  deleteAccount,
  transferMoney,
};
