import Account from "../models/accountModel.js";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js"
import OpenAI from "openai";
import fs from "fs";
import path from "path"; // Import path module
import { fileURLToPath } from 'url';

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

    // Log account creation transaction
    await Transaction.create({
      userId: userId,
      accountNumber: savedAccount.accountNumber,
      transactionType: "Account Creation",
      amount: 0, // Initial balance is 0
      previousBalance: 0,
      newBalance: 0,
    });

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
    else if(account.status === "Deactivated") return res.status(400).send({message: "Account already deleted"});

    const previousBalance = account.balance;
    account.balance += amount;
    const finalEdit = await account.save();

    // Log deposit transaction
    await Transaction.create({
      userId: account.userId,
      accountNumber: account.accountNumber,
      transactionType: "Deposited Money",
      amount: amount,
      previousBalance: previousBalance,
      newBalance: finalEdit.balance,
    });

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
    else if(account.status === "Deactivated") return res.status(400).send({message: "Account already deleted"});

    if (account.balance < amount) {
      return res.status(400).send({ message: "Insufficient funds" });
    }
    const previousBalance = account.balance;
    account.balance -= amount;
    const finalEdit = await account.save();

    // Log withdrawal transaction
    await Transaction.create({
      userId: account.userId,
      accountNumber: account.accountNumber,
      transactionType: "Withdrew Money",
      amount: amount,
      previousBalance: previousBalance,
      newBalance: finalEdit.balance,
    });

    res.status(202).send({ message: "Withdrawal successful", balance: finalEdit.balance });
  } catch (error) {
    res.status(500).json({ message: "Error processing withdrawal", error });
  }
};

// Delete an account
const deleteAccount = async (req, res) => {
  try {
    const { accountNum } = req.params;

    const checkAcc = await Account.findOne({accountNumber: accountNum});
    if (!checkAcc) {
      return res.status(404).json({ message: "Account not found" });
    }
    else if(checkAcc.balance > 0) return res.status(400).send({message: "Balance is not zero"});
    else if(checkAcc.status === "Deactivated") return res.status(400).send({message: "Account already deleted"});

    checkAcc.status = "Deactivated";
    await checkAcc.save();


    // Log account deletion transaction
    await Transaction.create({
      userId: checkAcc.userId,
      accountNumber: checkAcc.accountNumber,
      transactionType: "Deleted Account",
      amount: 0, // No amount in deletion
      previousBalance: 0,
      newBalance: 0, // Final balance
    });


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
    if(senderAccount.status === "Deactivated") return res.status(400).send({message: "Account deleted"});
    const recipientAccount = await Account.findOne({accountNumber: recipient });

    if (!senderAccount) {
      return res.status(404).send({ message: "Sender account not found" });
    }
    if (!recipientAccount) {
      return res.status(404).send({ message: "Recipient account not found" });
    }

    if (senderAccount.balance < amount) {
      return res.status(400).send({ message: "Insufficient funds" });
    }

    const senderPreviousBalance = senderAccount.balance;
    const recipientPreviousBalance = recipientAccount.balance;

    senderAccount.balance -= amount;
    recipientAccount.balance += amount;


    await senderAccount.save();
    await recipientAccount.save();

    //Sender to Recipient
    await Transaction.create({
      userId: senderAccount.userId,
      accountNumber: senderAccount.accountNumber,
      transactionType: "Sent Money (Transfer)",
      amount: amount,
      recipientAccountNumber: recipientAccount.accountNumber,
      previousBalance: senderPreviousBalance,
      newBalance: senderAccount.balance,
    });


    //Recipient to sender
    await Transaction.create({
      userId: recipientAccount.userId,
      accountNumber: recipientAccount.accountNumber,
      transactionType: "Received Money (Transfer)",
      amount: amount,
      recipientAccountNumber: senderAccount.accountNumber,
      previousBalance: recipientPreviousBalance,
      newBalance: recipientAccount.balance,
    });



    res.status(202).send({
      message: "Transfer successful",
      senderBalance: senderAccount.balance,
      recipientBalance: recipientAccount.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing transfer", error });
  }
};

//Code and api calls for Sambanova ai image processing
const openai = new OpenAI({
  apiKey: "b305baaf-97bc-4d17-82e1-193c3c4a7293",
  baseURL: "https://api.sambanova.ai/v1",
});

const main = async(imagePath)=> {
  try {
    const imageBase64 = encodeImage(imagePath);

    const response = await openai.chat.completions.create({
      model: "Llama-3.2-11B-Vision-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Give me a json object with one property called type which is either a withdraw or a deposit (Must use those two words: withdraw or deposit) and another property called amount which is a integer type (no other characters) with the balance due or being deposited, there can only be one json object. It can only be a withdrawal or a deposit, not both. If it does not say deposit anywhere, then assume withdrawl. Ignore the avaliable balance or total balance when shown. Only list one json object. Read it in english, dont give me any other text.",
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        },
      ],
    });

    console.log(JSON.parse(response.choices[0].message.content));
    return response.choices[0].message.content; // Return the response
  } catch (error) {
    console.error("Error in main function:", error);
    return { error: "An error occurred during AI processing" }; // return error object.
  }
}

// Helper function to encode the image
function encodeImage(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
}

//AI process image
const aiProcessMoney = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const { accountNum } = req.params;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = `${path.dirname(__dirname)}/uploads/${req.file.originalname}`; // Construct full file path

    const aiResponse = await main(filePath); // Pass file path to main function


    if (aiResponse.error) {
      return res.status(500).json(aiResponse);
    }

    const aiResJSON = JSON.parse(aiResponse);

    const account = await Account.findOne({ accountNumber: accountNum });

    if (!account) {
      return res.status(404).send({ message: "Account not found" });
    }
    else if(account.status === "Deactivated") return res.status(400).send({message: "Account already deleted"});

    const previousBalance = account.balance;

    let transactionType;
    let newBalance;

    console.log(aiResJSON);

    if (aiResJSON.type === "deposit") {
      account.balance += aiResJSON.amount;
      transactionType = "AI Deposit";
    } else if (aiResJSON.type === "withdraw") {
      if (account.balance < aiResJSON.amount) {
        return res.status(400).send({ message: "Insufficient funds" });
      }
      account.balance -= aiResJSON.amount;
      transactionType = "AI Withdrawal";
    } else {
      return res.status(400).send({ message: "Invalid transaction type from AI" });
    }

    newBalance = account.balance;
    await account.save();

    // Log transaction
    await Transaction.create({
      userId: account.userId,
      accountNumber: account.accountNumber,
      transactionType: transactionType,
      amount: aiResJSON.amount,
      previousBalance: previousBalance,
      newBalance: newBalance,
    });

    res.json({ message: "Transaction processed successfully", balance: account.balance });

  } catch (error) {
    console.error("Error during file upload and AI processing:", error);
    res.status(500).json({ error: "An error occurred during file processing." });
  }
}

export {
  createAccount,
  getAccountByUserId,
  depositMoney,
  withdrawMoney,
  deleteAccount,
  transferMoney,
  aiProcessMoney
};
