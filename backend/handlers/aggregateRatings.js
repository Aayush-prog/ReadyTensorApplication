const mongoose = require("mongoose");
const aggregateUserRatings = async (userId) => {
  const ReviewModel = mongoose.model("Review");
  try {
    const aggregationResult = await ReviewModel.aggregate([
      {
        $match: {
          reviewee: userId,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (aggregationResult.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
    return aggregationResult[0];
  } catch (error) {
    throw new Error("Error aggregating ratings: " + error.message);
  }
};

module.exports = aggregateUserRatings;
