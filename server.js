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

const allowedOrigins = ['http://localhost:1803', 'https://cricscoredev.netlify.app','http://localhost:702'];

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


/* why we are using origin method when multiple origins are there

origin function is working on the against allowedorigin and here call back is represent 
the whether it allow the deny the request it is default when we are using in cors. 
callback having 2 parameters one error another one is Boolean whether it is true or false. */
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