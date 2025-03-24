const mongoose = require("mongoose");
const aggregateUserRatings = require("../handlers/aggregateRatings");
const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
reviewSchema.post("save", async function (doc, next) {
  const UserModel = mongoose.model("User");
  try {
    const userId = doc.reviewee; // Get the user ID of the person being reviewed
    const ratingInfo = await aggregateUserRatings(userId);

    // Find the user and update the average rating and total reviews in the User model
    await UserModel.findByIdAndUpdate(userId, {
      averageRating: ratingInfo.averageRating,
      totalReviews: ratingInfo.totalReviews,
    });

    next(); // Call next to continue with other middlewares
  } catch (error) {
    next(error); // pass error if found
  }
});
module.exports = mongoose.model("Review", reviewSchema);
