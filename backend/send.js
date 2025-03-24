const mongoose = require("mongoose");
const Question = require("./models/questionModel");
require("dotenv").config();
mongoose
  .connect(process.env.mongo_connect, {})
  .then(() => console.log("mongo connected"))
  .catch((e) => console.log(e));
const javaQuestions = [
  {
    question: "What does JVM stand for?",
    options: [
      "Java Virtual Machine",
      "Java Visual Machine",
      "Java Variable Machine",
      "JavaScript Virtual Machine",
    ],
    correctAnswer: 0, // "Java Virtual Machine"
  },
  {
    question: "Which keyword is used to create a class in Java?",
    options: ["class", "new", "object", "type"],
    correctAnswer: 0, // "class"
  },
  {
    question: "Which of the following is not a primitive data type in Java?",
    options: ["int", "float", "String", "boolean"],
    correctAnswer: 2, // "String"
  },
  {
    question: "What is the correct way to declare a constant in Java?",
    options: [
      "const int x = 10;",
      "final int x = 10;",
      "constant int x = 10;",
      "static int x = 10;",
    ],
    correctAnswer: 1, // "final int x = 10;"
  },
  {
    question: "Which operator is used for equality comparison in Java?",
    options: ["=", "==", "===", ":="],
    correctAnswer: 1, // "=="
  },
  {
    question:
      "What is the output of the following code?\n\n ```java\nint a = 5;\nSystem.out.println(a++);\n```",
    options: ["5", "6", "Error", "7"],
    correctAnswer: 0, // "5"
  },
  {
    question: "Which access modifier provides the most restrictive access?",
    options: ["public", "protected", "private", "default"],
    correctAnswer: 2, // "private"
  },
  {
    question: "Which keyword is used to inherit a class?",
    options: ["inherit", "extends", "implements", "subclass"],
    correctAnswer: 1, // "extends"
  },

  {
    question: "Which of the following is used to handle exceptions in Java?",
    options: ["try...catch", "if...else", "loop", "switch"],
    correctAnswer: 0, // "try...catch"
  },
  {
    question:
      'What is the output of the following code?\n\n ```java\nfor (int i = 0; i < 2; i++) {\nSystem.out.print(i + " ");\n}\n```',
    options: ["0 1", "1 2", "0 1 2", "1 0"],
    correctAnswer: 0, // "0 1"
  },
];

async function seedDatabase() {
  try {
    // Check if questions already exist
    const questionCount = await Question.countDocuments();
    if (questionCount > 0) {
      console.log(
        "Questions already exist in the database. Skipping the seed."
      );
      mongoose.disconnect();
      return;
    }
    // Insert all questions
    await Question.insertMany(javaQuestions);
    console.log("Successfully inserted all questions!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect(); // Close the connection
  }
}

// Call the seed function
seedDatabase();
