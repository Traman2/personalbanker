import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: { type: Date, required: true },
  phoneNumber: String,
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin:{
    type: Boolean,
    default: false
  }
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({_id: this._id}, "secretstring1234");
}

export default mongoose.model("User", userSchema);
