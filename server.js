import express from "express";
import products1 from "./products info/getting-products-info.js";
import addproducs from "./products info/getting-products-info.js";
import userAuth from "./uerAuthentication/userAuth.js";
import cors from "cors";
import dotenv from "dotenv";
import quiz from "./quiz-game/quizgame.js";
import compression from "compression";


dotenv.config();
const port = process.env.PORT || 1801;
const app = express();

const allowedOrigins = ['http://localhost:1803', 'https://cricscoredev.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression()); // Enable gzip compression for all responses
// Handle preflight requests
app.options('*', cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello hemanth don't worry all will be for you ...");
});

app.use("/products", products1);
app.use("/addproducts", addproducs);
app.use("/auth", userAuth);
app.use("/quiz", quiz);

app.listen(port, () => console.log("server running on port", port));