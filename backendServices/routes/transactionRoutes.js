import express from "express";
import {
    getTransactionsByUserId,
    getTransactionsByAccountNumber,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/user/:userId", getTransactionsByUserId); // Get transactions by user ID
router.get("/account/:accountNumber", getTransactionsByAccountNumber); // Get transactions by account ID

export default router;