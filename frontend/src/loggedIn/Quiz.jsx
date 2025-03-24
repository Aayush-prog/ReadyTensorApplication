import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";

const Quiz = () => {
  const api = import.meta.env.VITE_URL;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${api}/questions/`);
        setQuestions(response.data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (e) => {
    setSelectedOption(Number(e.target.value));
  };

  const handleAnswer = async () => {
    if (selectedOption === null) {
      alert("Please select an option.");
      return;
    }

    const newAnswer = {
      questionId: questions[currentQuestionIndex]._id,
      selectedOption,
    };
    setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
    setSelectedOption(null); // reset selected option

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Handle submission of all answers
      try {
        const response = await axios.post(`${api}/questions/check`, {
          answers: [...answers, newAnswer],
        });
        setResults(response.data.results);
      } catch (error) {
        setError("Failed to check answers");
      }
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      return <div className="text-center mt-10">No questions available.</div>;
    }
    return (
      <div className="max-w-screen-md mx-auto bg-white p-6 rounded-md shadow-md w-full">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <p className="text-lg md:text-xl mb-6 text-center">
          {currentQuestion.question}
        </p>

        <div className="mb-6">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="mb-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="option"
                  value={index}
                  checked={selectedOption === index}
                  onChange={handleOptionChange}
                  className="mr-2 h-4 w-4 text-blue focus:ring-blue border-gray-300"
                />
                <span className="text-sm md:text-base">{option}</span>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleAnswer}
            className="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Next Question
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red">{error}</div>;
  }

  if (results) {
    let correctAnswers = 0;
    results.forEach((result) => {
      if (result.isCorrect) {
        correctAnswers++;
      }
    });
    return (
      <div className="max-w-screen-md mx-auto bg-white p-6 rounded-md shadow-md w-full">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
          Quiz Completed!
        </h2>
        <p className="text-lg md:text-xl mb-6 text-center">
          You got {correctAnswers} out of {questions.length} answers correct.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-1 flex justify-center items-center bg-gray-100">
        {renderQuestion()}
      </div>
      <Footer />
    </div>
  );
};

export default Quiz;
