import { response } from "express";
import userModel from "../models/userModel.js";

export const getUserData=async(req,res)=>{

    try {
        const {userId}=req.body;
        
    //    console.log(userId);
       
        const user=await userModel.findById(userId);
        if(!user){
            return res.json({success:true,message:"user not found"});
        }
console.log("users is" ,user);

      return  res.json({
            success:true,
            userData:{
                name:user.name,
                email:user.email,
                isAccountVerified:user.isAccountVerified
            }
        });

    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}
