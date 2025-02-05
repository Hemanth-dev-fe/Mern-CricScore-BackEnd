import mongoose from "mongoose";

// User schema and model
const userAuthSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true,index: true },
    password: { type: String, required: true }
});

const userAuthModel = 
mongoose.models['userauthentications'] || 
mongoose.model("userauthentications", userAuthSchema);

// Quiz schema and model
// const timeValue=new Date().toLocaleTimeString()
// const dateValue=new Date().toLocaleDateString()
// const dateTime=`${dateValue}${timeValue}`

// const getISTDateTime = () => {
//     const now = new Date();
//     const utcOffset = now.getTime() + (now.getTimezoneOffset() * 60000);
//     const istOffset = 5.5 * 60 * 60000; // IST offset in milliseconds
//     return new Date(utcOffset + istOffset);
//   };
//   console.log(getISTDateTime())
function getISTDateTimeString() {
    const date = new Date();
    const utcOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istDate = new Date(date.getTime() + utcOffset + istOffset);
    const timeValue = istDate.toLocaleTimeString('en-US', { hour12: false });
    const dateValue = istDate.toLocaleDateString('en-US');
    return `${dateValue} ${timeValue}`;
  }
  console.log(getISTDateTimeString())
const QuizAuthenticationSchema=new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"userAuthentication",required:true,index: true},
        name:{type:String,required:true},
        email:{type:String,required:true},
        score:{type:Number,required:true},
        date: { type: String, default: getISTDateTimeString()}
    }
)
const QuizModel=
mongoose.models['Quiz-Score']||
mongoose.model("Quiz-Score",QuizAuthenticationSchema)

export { userAuthModel, QuizModel };