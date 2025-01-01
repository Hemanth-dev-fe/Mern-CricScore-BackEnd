import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();

// Check if the environment variable is being read correctly
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Creating MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri).then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error:", err));

// Creating the schema
const userAuthSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Creating the model
const userAuthModel = mongoose.model("userAuthModelInfo", userAuthSchema);

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
    console.log("Password match:", isMatch);

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