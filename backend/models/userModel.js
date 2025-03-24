const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Email is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    phone: {
      type: String,
      require: [true, "Phone number is requires"],
    },
    rate: {
      type: String,
      default: "Flexible",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["developer", "client"],
    },
    image: {
      type: String,
    },
    tag: {
      type: String,
    },
    resume: {
      type: String,
    },
    applied: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      ref: "Job",
    },
    org: {
      type: String,
    },
    skills: {
      type: [String],
    },
    openJobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      ref: "Job",
    },
    ongoingJobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      ref: "Job",
    },
    completedJobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      ref: "Job",
    },
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    review: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      ref: "Review",
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
