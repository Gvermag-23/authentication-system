import bcrypt from 'bcryptjs';

export const register= async(req,res)=>{
    const {name, email,password}=req.body

    if(!name||!email||!password){
        return res.json({success:false,message:'missing detailed'})
    }
    try {
        

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}