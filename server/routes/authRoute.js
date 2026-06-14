
import express from 'express'
import { login, logout, register, sendVerifyOtp, verifiyEmail } from '../controllers/auth_controller.js';
import userAuth from '../middleware/userAuth.js';

const authRouter=express.Router();

console.log(authRouter);
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-veriy-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifiyEmail);

export default authRouter;