import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData } from "../controllers/userControler.js";

const userRouter=express.Router();//we have creted the router


userRouter.get('/data',userAuth,getUserData);

export default userRouter;