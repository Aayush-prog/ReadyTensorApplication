import React, { useContext, useState, useEffect } from "react";
import moment from "moment"; // Import moment for date formatting
//optional import react icons
import { FaStar } from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const ReviewCard = (props) => {
  const reviewId = props.reviewId;
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [review, setReview] = useState(null);
  const [user, setUser] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  if (!reviewId) {
    return <div className="p-4 text-gray-500">No review data provided.</div>;
  }

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `${api}/developer/review/${reviewId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setReview(response.data.data);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [api, authToken, reviewId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (review?.reviewer) {
        try {
          const response = await axios.get(
            `${api}/getUser/${review.reviewer}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setUser(response.data.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [api, authToken, review?.reviewer]);

  useEffect(() => {
    if (review?.createdAt) {
      setFormattedDate(moment(review.createdAt).format("MMM DD, YYYY"));
    }
  }, [review?.createdAt]);

  const generateStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`inline-block ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  if (!review) {
    return <div className="p-4 text-gray-500">Loading review...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">
            {user?.name || "Anonymous User"}
          </h3>
          {formattedDate && (
            <span className="text-gray-500 text-sm">{formattedDate}</span>
          )}
        </div>
        <div className="flex gap-1">{generateStars(review.rating)}</div>
      </div>
      <p className="text-gray-700 italic">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
