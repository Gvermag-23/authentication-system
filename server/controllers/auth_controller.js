import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { use } from 'react';


// user registratiion controller function
export const register= async(req,res)=>{
    const {name, email,password}=req.body

    if(!name||!email||!password){
        return res.json({success:false,message:'missing detailed'})
    }
    try {
        //checking email
        const existingUser=await userModel.findOne({email})
        // if email already exist send message
        if(existingUser){
         return res.json({success:false,message:"user already exits"});
        }
        // encrypting the user password
        const hashedPassword= await bcrypt.hash(password,10);
        //stroe the user detial in databases
        const user=new userModel({name,email, password:hashedPassword});
        await user.save();

        //genrating tokens
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn:'7d'});

        res.cookie('token',token ,{ 
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24 *60*60*1000
        })

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
// --------------------------------
