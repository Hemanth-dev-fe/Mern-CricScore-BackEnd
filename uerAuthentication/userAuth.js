import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userAuthModel } from "../models.js"; // Import the model

dotenv.config();

const router = express.Router();

// Connecting to MongoDB
const uri=process.env.MONGODB_URI;
    mongoose.connect(uri)
        .then(() => console.log("DB connected"))
        .catch((err) => console.log("DB connection error:", err));


// Register
console.time("register-time");

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        console.time("hashing-time");
        const hashedPassword = await bcrypt.hash(password, 8);
        console.timeEnd("hashing-time");

        console.time("check-email-time");
        const existingUser = await userAuthModel.findOne({ email });
        console.timeEnd("check-email-time");

        if (existingUser) {
            return res.status(400).send("Email already in use");
        }

        console.time("save-user-time");
        const userData = new userAuthModel({ name, email, password: hashedPassword });
        await userData.save();
        console.timeEnd("save-user-time");

        res.status(200).send("User registered...");
    } catch (err) {
        res.status(400).send({ error: "Register error", details: err.message });
        console.log(err);
    }

    console.timeEnd("register-time");
});

// checking exiting email from user

router.get("/check-email",async(req,res)=>{
    const {email}=req.query;
    try{
        const userEmail=await userAuthModel.findOne({email})
    if(userEmail)
    {
        res.status(200).json({exist:true})
    }
    else{
        res.status(200).json({exist:false})
    }
    }
    catch(error)
    {
        console.error("Error checking email:", error);
       res.status(500).json({ message: "Internal server error" });
    }
})

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userAuthModel.findOne({ email });
        user.explain("executionStats");
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET,{ expiresIn: '1h' });
                res.json({ token,
                    name: user.name,
                    email: user.email
                 });
                 
            } else {
                res.status(400).send("Invalid credentials");
            }
        } else {
            res.status(400).send("Invalid credentials");
        }
    } catch (err) {
        res.status(500).send({ error: "Login error", details: err.message });
    }
});

//creating the middleware for token verification

/* const AuthenticationToken=(req,res,next)=>{
    const token=req.headers['authorization']?.split(' ')[1]
    if(!token)
    {
        return res.sendStatus(401)
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err)
        {
            return res.sendStatus(403);
        }
        req.email=user;
        next()
    })

}
router.get("/protected",AuthenticationToken,(req,res)=>{
    res.json({ message: 'This is protected data.', user: req.email });
})
 */
export default router;