const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    additionalInfo: { type: String },
    catchphrase: { type: String, required: true },
    budget: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    requiredTags: {
      type: [String],
      default: [],
    },
    applicants: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      ref: "User",
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
