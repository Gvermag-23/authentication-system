import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

import transporter from '../config/nodemailer.js'


// user registratiion controller function
export const register= async(req,res)=>{
    const {name, email,password}=req.body
    console.log(req.body);
    
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
// WE ARE SEDING EMAIL BEFORE RENDNG THE SUCEES FUL RESPONSE
        
//sending welcome emal
        const mailOptions={
             from:process.env.SENDER_EMAIL,
             
             to:email,
             subject:'welcome to my authentication system',
             text:`welcome to my authentucation system your acccount is created with this email id ${email}`

        }
        await transporter.sendMail(mailOptions);

         return res.json({success:true});

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// --------------------------------
// here we are making login control function which help to 
// check login credintial and accces

export const login=async(req,res)=>{
    const {email,password}=req.body;
 
    if(!email||!password){
        return res.json({success:false,message:'email and password are required'})
    }

    try {
        const user= await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:'imvalid email'})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        
        if(!isMatch){
             return res.json({success:false,message:'imvalid password'})
        }

         const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn:'7d'});

        res.cookie('token',token ,{ 
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24 *60*60*1000,
            path:'/'
            
        })
        return res.json({success:true});


    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

// -----------------------------------------
// making logout controller
export const logout =async( req,res)=>{

    try {
        res.clearCookie('token',{
              httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
                 

            path:'/'
            
        });
        return res.json({success:true,message:'logged out'});

    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}



// ***************** VERIFICATION*******
// send otp to users email
export const sendVerifyOtp=async(req,res)=>{
    try {
        const {userId}=req.body;
        const user=await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:false,message:"account is alrraeay verifed"})
        }
        // TO GERNATE OTP  6digt
        const otp= String(Math.floor(100000+ Math.random()*900000));
// console.log("Generated OTP:", otp);
// console.log("Sending mail to:", user.email);

        user.verifyOtp=otp;
        //1day expory 1day
         user.verifyOtpExpireAt=Date.now()+24*60*60*1000

         await user.save();

         const mailOptions={
             from:process.env.SENDER_EMAIL,
             to:user.email,
             subject:'account verfication otp',
             text:`your otp is  ${otp}. verify your account using this otp`

         }
        //  const info = await transporter.sendMail(mailOptions);
// 
// console.log("Mail sent:", info.messageId);
         await transporter.sendMail(mailOptions);
       return  res.json({success:true,message:"verfication otp is send on your email"});

    } catch (error) {
      return  res.json({success:false,message:"u enter the wrong otp"});
    }
}

// *********************VERIFY EAMIL USNG OTP***********
export const verifiyEmail=async(req,res)=>{
     const {userId,otp}=req.body;

     if(!userId||!otp){
      return  res.json({success:false,message:"missing details of id or otp"})
     }
     try {
        const user=await userModel.findById(userId);
        if(!user){
           return res.json({success:false,message:"user not found"}); 
        }
        if(user.verifyOtp===''||user.verifyOtp!==otp){
            return res.json({success:false,message:'invalid otp'});
        }
        // chckiking otp expirty time 
        if(user.verifyOtpExpireAt<Date.now()){
            return res.json({success:false,message:'otpis expired'});
        }
        // account verifaction true krdiye hai.
        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;

        await user.save();
        return res.json({success:true,message:'email verified succesfully'});

        
     } catch (error) {
      return  res.json({success:false,message:error.message})

     }

}


// IS AUTHTNTICATIONS: check if user is authenticates or not
export const isAuthenticated=async(req,res)=>{

    try {
         return res.json({success:true});
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
// *******************send password reset otp

export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;

    if(!email){
        return res.json({success:false,message:"email is requierd"});

    }

    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:error.message});
        }
         
           // TO GERNATE OTP  6digt
        const otp= String(Math.floor(100000+ Math.random()*900000));

        user.resetOtp=otp;
        //1day expory 15min
         user.resetOtpExpireAt=Date.now()+15*60*1000

         await user.save();

         const mailOptions={
             from:process.env.SENDER_EMAIL,
             to:user.email,
             subject:'password reset  otp',
             text:`your otp for resettinh your password is  ${otp}. uset this otp to proccess with resetting your password `
         }
         await transporter.sendMail(mailOptions);
         return res.json({success:true,message:"otp send to ypur email"});

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}


// **********user can verify the optp and reset the password

export const resetPassword=async(req,res)=>{
    const {email,otp,newPassword}=req.body;

    if(!email||!otp||!newPassword){
         return res.json({success:false,message:"email and otp and pass are requird"})
    }

    try {
        const user=await userModel.findOne({email});
        console.log(email);
        if(!user){
             return res.json({success:false,message:"user not found"})

        }
        if(user.resetOtp===""||user.resetOtp!==otp){
            console.log("your otp",otp);
             return res.json({success:false,message:"invalid otp"})
        }
        if(user.resetOtpExpireAt<Date.now()){
             return res.json({success:false,message:"otp is expired"});
        }

        //encrpting new pass before saving
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        user.resetOtp="";
        user.resetOtpExpireAt=0;
        
        await user.save();
         return res.json({success:true,message:"password is cahnge and saved"})

    } catch (error) {
         return res.json({success:false,message:error.message})
    }
}