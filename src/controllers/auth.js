import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "./../utils/email.js";
import { hashPassword } from "./../utils/password.js";
import { errorMessages, successMessages } from "./../utils/message.js";

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": "Trường Name là bắt buộc",
    "string.empty": "Trường Name không được để trống",
    "string.min": "Trường Name tối thiểu là {#limit} ký tự",
    "string.max": "Trường Name tối đa là {#limit} ký tự",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Trường Email là bắt buộc !",
    "string.empty": "Trường Email không được để trống",
    "string.email": "Trường Email không phải là email hợp lệ",
  }),
  password: Joi.string().min(3).max(30).required().messages({
    "any.required": "Trường Password là bắt buộc",
    "string.empty": "Trường Password không được để trống",
    "string.min": "Trường Password tối thiểu là {#limit} ký tự",
    "string.max": "Trường Password tối đa là {#limit} ký tự",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.required": "Trường Confirm Password là bắt buộc",
    "any.only": "Mật khẩu không trùng khớp",
  }),
  avatar: Joi.string().uri().messages({
    "string.uri": "Trường Avatar không phải là URL hợp lệ",
  }),
});

export const signup = async (req, res) => {
  const { email, password, name, avatar } = req.body;
  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((item) => item.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messages });
  }
  const exitsUser = await User.findOne({ email });
  if (exitsUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: ["Email đã tồn tại !"] });
  }

  const hashPass = await bcryptjs.hash(password, 10);
  const role = (await User.countDocuments({})) === 0 ? "admin" : "user";
  const user = await User.create({
    ...req.body,
    password: hashPass,
    role,
  });
  return res.status(StatusCodes.CREATED).json({ user });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      messages: ["Email không tồn tại"],
    });
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      messages: ["Mật khẩu không chính xác"],
    });
  }
  const token = jwt.sign({ userId: user._id }, "giangdeptrai", {
    expiresIn: "7d",
  });
  return res.status(StatusCodes.OK).json({
    user,
    token,
  });
};
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: errorMessages.USER_NOT_FOUND,
      });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    const hashPass = await hashPassword(newPassword);
    if (!hashPass) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: errorMessages?.HASH_PASSWORD_ERROR,
      });
    }

    user.password = hashPass;
    await user.save();

    const emailSubject = "Test Noti Forgot Password by Hoàng Anh";
    const emailText = `Mật khẩu mới của bạn là: ${newPassword}`;
    await sendEmail(email, emailSubject, emailText);

    return res.status(StatusCodes.OK).json({
      message: successMessages?.RESET_PASSWORD_SUCCESS,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {};
