
import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoute.js'

const app=express();
const port=process.env.PORT||4000

// middleware h
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));
// callong fun from mondb.js
connectDB()


// API end points
app.get('/',(req,res)=>{
 res.send("api workiong");
})
app.use('/api/auth',authRouter);




app.listen(port,()=>{
    //hello kdf: sd 
    console.log(`server  is started on the port ${port}`);
    
})