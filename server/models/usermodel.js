
import mongoose, { Mongoose } from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true,
        unique:true
    },
     password:{
        type:String,
        required:true
    },
     verifyOtp:{
        type:String,
        default:''
    },
     verifyOtpExpireAt:{
        type:Number,
        default:0
    },
     isAccountVerified:{
        type:Boolean,
        default:'false'
    },
     resetOtp:{
        type:String,
        default:''
    },
    resetOtpExpireAt:{
        type:Number,
        default:'0'
    }
})
    //    here we are useing or opertor checkomg user exist or not . if not then create and call
const  user= mongoose.models.user||Mongoose.model('user',userSchema);

export default user;
