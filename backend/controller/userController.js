import bcrypt from "bcrypt";
import { User } from "../model/userModel.js";
import mongoose from "mongoose";

function setMongoose() {
  return mongoose.set("toJSON", {
    virtuals: true,
    transform: (doc, returnValue) => {
      delete returnValue._id;
      delete returnValue.__v;
      delete returnValue.createdAt;
      delete returnValue.updatedAt;
    },
  });
}

export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({ msg: "User Registerd SuccessFully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Invalid Credentials" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(403).json({ msg: "Invalid Credentials" });
    }
    req.session.userId = user.id;
    const { id } = user;
    email = user.email;
    return res
      .status(200)
      .json({msg: "Login SuccessFull", login: true, id, email });
  } catch (error) {
    return res.status(500).json({ login: false, error: error.message });
  }
};

export const logout = async (req, res, next) => {
  try {
    req.session.destroy((error) => {
      if (error) return res.status(400).json({ msg: "Logout Unsuccessfull" });
      res.clearCookie("connect.sid");
      res.status(200).json({ msg: "Logout Successfull" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const authUser = async (req, res , next) => {
  if (!req.session.userId) {
    return res.status(403).send({ msg: "Please Login Again" });
  }
  const user = await User.findById({
    _id: req.session.userId,
  });
  if (!user) {
    res.status(404).json({ msg: "Invalid Credentials" });
  }
  const { id, name, isAuthenticated, superAdmin , email } = user;
  res.status(200).json({ login: true, id, name, email, isAuthenticated, superAdmin });
};

