const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema(
  {
    coverLetter: { type: String, required: true },
    timeframe: { type: Number, required: true },
    budget: { type: String, required: true },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
