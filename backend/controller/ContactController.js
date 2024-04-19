import { Support } from "../model/ContactModel.js";
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

export const createSupport = async (req, res) => {
  try {
    const { name, message, phoneNumber , email } = req.body;
    await Support.create({
      name,
      message,
      email,
      phoneNumber
    });

    return res.status(201).json({msg: "Successfully Submitted"});
  } catch (error) {
    return res.status(400).json({msg:error.message});
  }
};

export const getAllSupport = async (req, res) => {
  try {
    const supportData = await Support.find().sort({ createdAt: -1 });
    setMongoose();
    return res.status(201).json(supportData);
  } catch (error) {
    return res.status(400).json({msg:error.message});
  }
};


