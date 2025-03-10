import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { userAuthModel, QuizModel } from "../models.js"
import mongoose from "mongoose";
const router=express.Router();

//connecting mongoDB


const uri=process.env.MONGODB_URI;
    mongoose.connect(uri, {
        serverSelectionTimeoutMS: 20000, // Adjust the timeout as needed
        socketTimeoutMS: 20000, // Adjust the timeout as needed
    }).then(() => console.log("DB connected"))
      .catch((err) => console.log("DB connection error:", err));

      router.post("/quiz/quiz-scoreposting", async (req, res) => {
        const { email, score, name } = req.body; // Change username to name
        console.log("Request body received:", req.body);
        if (!email || !score || !name) { // Change username to name
            return res.status(400).json({ error: "Email, score, and name are required." });
        }
        try {
            const userDetails = await userAuthModel.findOne({ email });
            console.log(userDetails)
            if (!userDetails) {
                return res.status(400).json({ error: "Email not found." });
            }
            const existingScore = await QuizModel.findOne({ userId: userDetails._id });
            if (existingScore) {
                return res.status(200).send("Quiz score already exists. Only the first attempt is stored.");
            } else {
                const newScore = new QuizModel({ userId: userDetails._id, name: userDetails.name, email: userDetails.email, score }); // Change username to name
                await newScore.save();
                res.status(200).send("Quiz score saved successfully...");
            }
        } catch (err) {
            res.status(400).json({ error: "Error saving quiz score", details: err.message });
        }
    });

router.get("/quiz-getData",async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||5;
        //skipping the data

        const skip=(page-1)*limit
        const totaldocuments=await QuizModel.countDocuments()
        const quizdata=await QuizModel.find().skip(skip).limit(limit)
        // console.log('Fetched quiz data:', quizdata); // Log the fetched data
      res.status(200).json({
        quizdata:quizdata,
        currentPage:page,
        totalPages:Math.ceil(totaldocuments/limit)
      });

    }
    catch (err) {
        res.status(400).send({ error: 'Error fetching quiz data', details: err.message });
      }
  
})

export default router