import express from "express";
import {
    createAccount,
    getAccountByUserId,
    depositMoney,
    withdrawMoney,
    deleteAccount,
    transferMoney,
    aiProcessMoney
} from "../controllers/accountController.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    },
});

const upload = multer({ storage: storage });

router.post("/create", createAccount); // Create new account
router.get("/:userId", getAccountByUserId); // Get account by user ID
router.put("/:accountNum/deposit", depositMoney); // Deposit money id is of account
router.put("/:accountNum/withdraw", withdrawMoney); // Withdraw money
router.delete("/:accountNum", deleteAccount); // Delete account by account id
router.put("/:accountNum/:recipient/transfer", transferMoney); // transfer money first senderAccount num and then targetAccount num
router.post("/:accountNum/api/upload", upload.single("file"), aiProcessMoney); //Uses AI to process image to deposit or withdraw account balance

export default router;
