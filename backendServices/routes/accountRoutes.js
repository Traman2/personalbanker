import express from "express";
import {
    createAccount,
    getAccountByUserId,
    depositMoney,
    withdrawMoney,
    deleteAccount
} from "../controllers/accountController.js";

const router = express.Router();

router.post("/create", createAccount); // Create new account
router.get("/:userId", getAccountByUserId); // Get account by user ID
router.put("/:id/deposit", depositMoney); // Deposit money id is of account
router.put("/:id/withdraw", withdrawMoney); // Withdraw money
router.delete("/:id", deleteAccount); // Delete account by account id

export default router;
