
// we make this middlewaere to get userid,
// from req.body we cant get directy userID
// THAT WILL FIND THE TOKEN from the cokkie and from the cookie it fimd the user id

import jwt from "jsonwebtoken";
// after completing the code of userAuth,it will execute next,
// from next it execute our controler function
const userAuth= async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return res.json({success:false,message:"not authorise login again"})
    }

    try {
      const tokenDecode=  jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.body.userId=tokenDecode.id
        }
        else{
            return res.json({success:false,message:"not authorise login again"})
        }

        next();

    } catch (error) {
         return res.json({success:false,message:"not authorise login again"})
    }
}
export default userAuth;