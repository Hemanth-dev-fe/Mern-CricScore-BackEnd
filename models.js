import mongoose from "mongoose";

// User schema and model
const userAuthSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const userAuthModel = 
mongoose.models['userauthentications'] || 
mongoose.model("userauthentications", userAuthSchema);

// Quiz schema and model

const QuizAuthenticationSchema=new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"userAuthentication",required:true},
        username:{type:String,required:true},
        email:{type:String,required:true},
        score:{type:Number,required:true},
        date:{type:Date,default:Date.now}
    }
)
const QuizModel=
mongoose.models['Quiz-Score']||
mongoose.model("Quiz-Score",QuizAuthenticationSchema)

export { userAuthModel, QuizModel };