import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";

//router files
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import accountRoutes from './routes/accountRoutes.js'

const port = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request body
app.use(express.json());
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.log("Connection failed...", err));

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})