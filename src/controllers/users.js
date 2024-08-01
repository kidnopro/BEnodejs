import { StatusCodes } from "http-status-codes";
import User from "../models/user";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email password createdAt");
    console.log("Fetched users:", users);
    if (users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không có thành viên nào" });
    }
    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    return res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

// export const updateUsers = async () => {};
