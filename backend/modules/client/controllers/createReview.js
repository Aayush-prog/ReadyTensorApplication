const mongoose = require("mongoose");
const createReview = async (req, res) => {
  console.log("called");
  const ReviewModel = mongoose.model("Review");
  const UserModel = mongoose.model("User");
  const { rating, comment } = req.body;
  const { reviewee, reviewer } = req.query;
  // Basic input validation (you can add more robust validation if needed)
  if (!rating || !comment || !reviewer) {
    throw new Error("Rating, comment, and reviewer are required");
  }

  // Check if reviewer exists
  const user = await UserModel.findById(reviewer);
  if (!user) {
    throw new Error("Reviewer not found");
  }

  // Check if reviewee exists, if it's specified
  if (reviewee) {
    const revieweeUser = await UserModel.findById(reviewee);
    if (!revieweeUser) {
      throw new Error("Reviewee not found");
    }
  }

  try {
    const newReview = new ReviewModel({
      rating,
      comment,
      reviewer,
      reviewee,
    });
    await newReview.save();
    const updateUser = await UserModel.findByIdAndUpdate(reviewee, {
      $push: { review: newReview._id },
    });
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(500).send({ status: "Failed" });
  }
};

module.exports = createReview;
