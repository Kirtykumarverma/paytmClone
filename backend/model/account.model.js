import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Account = mongoose.model("Account", accountSchema);
