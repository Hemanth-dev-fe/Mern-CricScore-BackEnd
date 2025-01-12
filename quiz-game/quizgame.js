import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { userAuthModel, QuizModel } from "../models.js"
import mongoose from "mongoose";
const router=express.Router();

//connecting mongoDB

const connectDB = (DBNAME) => {
    const uri = `${process.env.MONGODB_URI}${DBNAME}${process.env.MONGODB_OPTIONS}`;
    mongoose.connect(uri).then(() => console.log("DB connected"))
        .catch((err) => console.log("DB connection error:", err));
};
connectDB("CricScore");
router.post("/quiz-scoreposting",async(req,res)=>{
    console.log("Request Body:", req.body)
    const{email,score}=req.body;
    if(!email||!score)
    {
        return res.status(400).send("{error: email and score required.}")
    }
    try{
        const userDetails=await userAuthModel.findOne({email})
    if(!userDetails)
    {
        return res.status(400).send("{error: email is not found.}")   
    }
    const existingScore=await QuizModel.findOne({userId:userDetails._id})
    if(existingScore)
    {
        res.status(200).send("Quiz score already exists. Only the first attempt is stored.");
    }
    else{
        const newScore= new QuizModel({userId:userDetails._id,username:userDetails.username,email:userDetails.email,score})
        await newScore.save();
        res.status(200).send("Quiz score saved successfully...");
    }
    }
    catch(err)
    {
        res.status(400).send({ error: "Error saving quiz score", details: err.message });

    }

});

router.get("/quiz-getData",async(req,res)=>{
    try{
        const quizdata=await QuizModel.find({})
        console.log('Fetched quiz data:', quizdata); // Log the fetched data
      res.status(200).send(quizdata);

    }
    catch (err) {
        res.status(400).send({ error: 'Error fetching quiz data', details: err.message });
      }
  
})

export default router