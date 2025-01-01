import express from "express"
import products1 from "./products info/getting-products-info.js"
import addproducs from "./products info/getting-products-info.js"
import userAuth from "./uerAuthentication/userAuth.js"
import cors from "cors"
const port=process.env.PORT||1800;
const app=express()
app.use(cors({
    origin: 'http://localhost:1803',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
//CORS:   This setup is useful for developing and testing your application locally, 
// ensuring that only specific origins and methods are permitted to interact with your server

app.use(express.json()); //have middleware to parse JSON bodies in your requests. Add app.use(express.json()); before your routes

app.get("/",(req,res)=>{
    res.send("hello hemanth don't worry all will be for you  ...")
})
app.use("/",products1)
app.use("/",addproducs)
app.use("/",userAuth)
app.listen(port,()=>console.log("server running"))