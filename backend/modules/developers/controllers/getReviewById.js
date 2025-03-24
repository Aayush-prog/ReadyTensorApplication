const mongoose = require("mongoose");
const getReviewById = async (req, res) => {
  const ReviewModel = mongoose.model("Review");
  const { id } = req.params;
  const review = await ReviewModel.findById(id);
  res.status(200).send({ data: review });
};
module.exports = getReviewById;
