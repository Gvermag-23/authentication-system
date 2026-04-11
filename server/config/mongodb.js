
 import mongoose from "mongoose";

 const connectDB= async ()=>{
    try{
        // for messge proting that connection is establish
    mongoose.connection.on('connected',()=>{
        console.log("database is connected");
        
    })
    await mongoose.connect(`${process.env.MONGODB_URL}/AUTENTICATION_SYSTEM`)
  }catch(error){
      console.log("monodb cooncetion error",error);
        process.exit(1)
        
  }
 };
 export default connectDB;