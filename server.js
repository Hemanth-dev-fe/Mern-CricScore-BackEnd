import express from "express";
import products1 from "./products info/getting-products-info.js";
import addproducs from "./products info/getting-products-info.js";
import userAuth from "./uerAuthentication/userAuth.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 1801;
const app = express();

const allowedOrigins = ['http://localhost:1803', 'https://cute-marigold-5db910.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello hemanth don't worry all will be for you ...");
});

app.use("/products", products1);
app.use("/addproducts", addproducs);
app.use("/auth", userAuth);

app.listen(port, () => console.log("server running on port", port));