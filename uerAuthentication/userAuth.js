import express from "express"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const router=express.Router();

//creating mongodb

mongoose.connect("mongodb://127.0.0.1:27017/Hemanth").then(()=>console.log("db connected"))
.catch((err)=>console.log("db connection error:" ,err))

//creating the schema

const userAuthSchema=new mongoose.Schema({
    name:{type:String
    },
    email:{type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

//creating the model

const userAuthModel=mongoose.model("userAuthModelInfo",userAuthSchema)
//register
router.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    const hassedPassword= await bcrypt.hash(password,10)
    try{
        const userData=new userAuthModel(
            {
                name,email,password:hassedPassword
            }
        );
        await userData.save()
        res.status(200).send("user registered...")
    }
    catch(err){
        res.status(400).send({ error: "Register error", details: err.message });
    } 

})

//login

router.post("/login",async(req,res)=>{
    const{email,password}=req.body
    const user=await userAuthModel.findOne({email})
    if(user)
    {
        const isMatch=await bcrypt.compare(password,user.password)
        console.log("password match,", isMatch)
    
    if(isMatch)
    {
        const token=jwt.sign({email:user.email},"secret_key")
        res.json({token})
    }
    else{
        res.status(400).send("invalid credentials");
    }
}
else{
    res.status(400).send("invalid credentials");
}
})

export default router