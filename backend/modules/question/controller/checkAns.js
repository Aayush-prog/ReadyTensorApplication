const mongoose = require("mongoose");

const checkAns = async (req, res) => {
  const QuestionModel = mongoose.model("Question");
  const answers = req.body.answers; // Expecting an array of objects { questionId, selectedOption }

  if (!Array.isArray(answers) || answers.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid request data: answers array is required" });
  }

  try {
    const results = await Promise.all(
      answers.map(async (answer) => {
        const { questionId, selectedOption } = answer;

        if (!questionId || selectedOption === undefined) {
          return {
            questionId,
            error:
              "Invalid answer data: questionId and selectedOption required",
          };
        }
        const question = await QuestionModel.findById(questionId).select(
          "correctAnswer"
        );
        if (!question) {
          return { questionId, error: "Question not found" };
        }

        const isCorrect = Number(selectedOption) === question.correctAnswer;
        return { questionId, isCorrect };
      })
    );
    res.status(200).json({ results });
  } catch (error) {
    console.error("Error checking answers:", error);
    res.status(500).json({ error: "Failed to check answers" });
  }
};

module.exports = checkAns;
