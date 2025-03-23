import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Assuming you have a 'User' model
            required: true,
        },
        accountNumber: {
            type: String, // Used account model unique 12 digit account number
            required: true,
        },
        transactionType: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        recipientAccountNumber: {
            type: String, // Recipient account model unique 12 digit account number
            default: null, // Default is null, as not all transactions have a recipient.
        },
        description: {
            type: String, // Optional description or notes
        },
        previousBalance: {
            type: Number,
            required: true,
        },
        newBalance: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);