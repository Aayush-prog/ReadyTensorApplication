const mongoose = require("mongoose");

const getQuestion = async (req, res) => {
  console.log("here");
  const QuestionModel = mongoose.model("Question");
  try {
    const questions = await QuestionModel.find().select("question options ");
    res.status(200).send({ data: questions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

module.exports = getQuestion;
