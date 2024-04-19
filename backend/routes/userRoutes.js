import express from "express";
import {
  authUser,
  login,
  logout,
  signUp,
} from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.delete("/logout",logout);
userRouter.get("/authUserSessionEverytime",authUser);

export default userRouter;
