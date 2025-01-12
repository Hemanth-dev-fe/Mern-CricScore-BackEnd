import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userAuthModel } from "../models.js"; // Import the model

dotenv.config();

const router = express.Router();

// Connecting to MongoDB

const connectDB = (DBNAME) => {
    const uri = `${process.env.MONGODB_URI}${DBNAME}${process.env.MONGODB_OPTIONS}`;
    mongoose.connect(uri).then(() => console.log("DB connected"))
        .catch((err) => console.log("DB connection error:", err));
};
connectDB("CricScore");

// Register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const userData = new userAuthModel({ name, email, password: hashedPassword });
        await userData.save();
        res.status(200).send("User registered...");
    } catch (err) {
        res.status(400).send({ error: "Register error", details: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userAuthModel.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
            res.json({ token });
        } else {
            res.status(400).send("Invalid credentials");
        }
    } else {
        res.status(400).send("Invalid credentials");
    }
});

export default router;