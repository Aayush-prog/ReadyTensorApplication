import React, { useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import axios from "axios";
const ReviewForm = ({ revieweeId, reviewerId }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken, id } = useContext(AuthContext);
  const [rating, setRating] = useState(0); // Use a number for rating state
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`cursor-pointer inline-block ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => handleStarClick(i)}
        />
      );
    }
    return stars;
  };

  const handleSubmit = async (e) => {
    console.log("here");
    e.preventDefault();
    setError("");
    setMessage("");

    if (rating === 0 || !comment) {
      setError("Rating and comment are required.");
      return;
    }

    try {
      console.log("sendiong to backend");
      const response = await axios.post(
        `${api}/client/createReview?reviewee=${revieweeId}&reviewer=${reviewerId}`,
        {
          rating, // Include rating in the request body
          comment, // Include comment in the request body
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if ((response.data.status = "success")) {
        setMessage(data.status || "Review submitted successfully!");
        setRating(0);
        setComment("");
      } else {
        setError(data.status || "Review submission failed.");
      }
    } catch (err) {
      setError("Failed to submit the review. Please try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
      {message && <p className="mb-2 text-green">{message}</p>}
      {error && <p className="mb-2 text-red">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700"
          >
            Rating (1-5):
          </label>
          <div className="mt-1">{generateStars()}</div>
        </div>
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comment:
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue hover:bg-green text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
