import mongoose from "mongoose";

// Function to generate a unique 12-digit account number
const generateAccountNumber = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

// Define Account Schema
const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        unique: true,
        required: true,
        default: generateAccountNumber,
    },
    accountName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a 'User' model
        required: true,
    },

    balance: {
        type: Number,
        required: true,
        default: 0, // Default balance is 0
    }
}, {timestamps: true});

// Create Account Model
export default mongoose.model("Account", accountSchema);