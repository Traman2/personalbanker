import express from "express";
import {
    createAccount,
    getAccountByUserId,
    depositMoney,
    withdrawMoney,
    deleteAccount,
    transferMoney
} from "../controllers/accountController.js";

const router = express.Router();

router.post("/create", createAccount); // Create new account
router.get("/:userId", getAccountByUserId); // Get account by user ID
router.put("/:accountNum/deposit", depositMoney); // Deposit money id is of account
router.put("/:accountNum/withdraw", withdrawMoney); // Withdraw money
router.delete("/:accountNum", deleteAccount); // Delete account by account id
router.put("/:accountNum/:recipient/transfer", transferMoney); // transfer money first senderAccount num and then targetAccount num

export default router;
