import mongoose from "mongoose";
import { Account } from "../model/account.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const transferAmount = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;
    console.log("amount " + amount);
    console.log("to " + to);

    //fetching user => account details
    const account = await Account.findOne({ user_id: req.user._id }).session(
      session
    );

    console.log("USer account " + account);
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      throw new ApiError(400, "Insufficient Balance");
    }

    const toAccount = await Account.findOne({ user_id: to }).session(session);
    console.log("toAccount " + toAccount);
    if (!toAccount) {
      await session.abortTransaction();
      throw new ApiError(400, "Invalid Account");
    }

    //perform transaction
    await Account.updateOne(
      { user_id: req.user._id },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { user_id: to },
      { $inc: { balance: amount } }
    ).session(session);

    //commit the transacton
    await session.commitTransaction();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Transfer successful"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Somwthing went wrong while transfering the amount "
    );
  }
};

const fetchBalance = async (req, res) => {
  console.log(req.user._id._id);
  try {
    const account = await Account.findOne({
      user_id: req.user._id._id,
    });

    console.log("account " + account);
    return res
      .status(200)
      .json(new ApiResponse(200, { balance: account.balance }, ""));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching the balance"
    );
  }
};
export { transferAmount, fetchBalance };
