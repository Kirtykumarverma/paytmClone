import { User } from "../model/user.model.js";
import { Account } from "../model/account.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import zod from "zod";
import mongoose from "mongoose";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message ||
        "something went wrong while genrating access and refresh token"
    );
  }
};
const signup = async (req, res) => {
  try {
    const signupBody = zod.object({
      username: zod.string().email(),
      firstName: zod.string(),
      lastName: zod.string(),
      password: zod.string(),
    });

    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      throw new ApiError(411, "Incorrect Input");
    }

    //check existing user
    const existingUser = await User.findOne({
      username: req.body?.username,
    });

    //   //if we found user
    if (existingUser) {
      throw new ApiError(409, "user already exists");
    }

    const registerUser = await User.create({
      username: req.body?.username.toLowerCase(),
      firstName: req.body?.firstName,
      lastName: req.body?.lastName,
      password: req.body?.password,
    });

    if (!registerUser) {
      throw new ApiError(
        500,
        registerUser || "SOmethign went wrong while creating the user"
      );
    }
    const user = registerUser._id;

    const addAccounBalance = await Account.create({
      user_id: user,
      balance: 1 + Math.random() * 1000,
    });

    if (!addAccounBalance) {
      throw new ApiError(
        500,
        "Somethign wet wrong whille adding account balance"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, registerUser, "User SignedUp Successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message);
  }
};

const signin = async (req, res) => {
  const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
  });

  const { username, password } = req?.body;
  console.log(username, password);
  const { success } = signinBody.safeParse(req.body);
  console.log("success" + success);
  if (!success) {
    throw new ApiError(411, "Incorrect Input");
  }

  //check user exists
  const user = await User.findOne({
    username: req.body.username,
  });

  if (!user) {
    throw new ApiError(404, "user does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(req.body.password);
  console.log("Pasword valid" + isPasswordValid);
  if (!isPasswordValid) {
    throw new ApiError(500, "Invalid credentials");
  }

  const { accessToken } = await generateAccessToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password ");
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, { loggedInUser, accessToken }, "Login successfully")
    );
};

const updateUser = async (req, res) => {
  const updateUserBody = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
  });

  try {
    const { success } = updateUserBody.safeParse(req?.body);

    if (!success) {
      throw new ApiError(411, "Incorrect Input");
    }

    const { firstName, lastName } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        firstName,
        lastName,
      },
    }).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while updating user"
    );
  }
};

const filterUser = async (req, res) => {
  try {
    const filter = req.query.filter || "";
    console.log(filter);

    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: filter,
            $options: "i",
          },
        },
      ],
    }).select("-password");

    return res.status(200).json(new ApiResponse(200, { users }, ""));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, error?.message));
  }
};

export { signup, signin, updateUser, filterUser };
