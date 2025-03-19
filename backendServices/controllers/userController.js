import User from "../models/userModel.js";
import bcrypt from 'bcrypt';

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByToken = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
}

const getUserByUsername = async (req, res) => {
  try {
    const user = await User.find(req.params);
    if (!user) {
      return res.status(404).json({ message: "User was not found" });
    }
    return res.status(202).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Use for signup portal
const createUser = async (req, res) => {
  try {
    const { userName, firstName, lastName, dob, phoneNumber, email, password } = req.body;

    const checkUserEmail = await User.findOne({email});
    const checkUserName = await User.findOne({userName});

    if(checkUserEmail || checkUserName){
      return res.status(400).json({message: "Username or email already taken"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ userName, firstName, lastName, dob, phoneNumber, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = savedUser.generateAuthToken();
    return res.header("x-auth-token", token).status(201).send( token );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
    getAllUsers,
    getUserByUsername,
    createUser,
    getUserByToken
};