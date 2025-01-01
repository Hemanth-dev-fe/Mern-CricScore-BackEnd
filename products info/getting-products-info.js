import express from "express"
let router=express.Router();

let products=[
    {
        id:1,
        name:"mobile"
    },
    {
        id:2,
        name:"fruits"
    },
    {
        id:3,
        name:"vegitables"
    }
]
//  router.get("/product/:id",(req,res)=>{
//    const newProduct=products.filter((data)=>data.id.toString()===req.query.id)
//     res.json(newProduct)
// })
router.get("/product",(req,res)=>{
    if(req.query.id)
    {
        const newProduct=products.filter((data)=>data.id.toString()===req.query.id)
    res.json(newProduct)
    }
    else{
        res.json(products)
    }
})
router.post("/addProducts",(req,res)=>{
    const {id,name}=req.body;
    try{
        res.send("data stored");
        console.log(id,name)
    }
    catch(error)
    {
        res.send(error)
    }
})
export default router