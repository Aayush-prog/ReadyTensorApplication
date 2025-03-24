"use client";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../Footer";
import Nav from "../Nav";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export function JobApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [appForm, setAppForm] = useState({
    coverLetter: "",
    budget: "",
    timeframe: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // If the input type is number, try parsing to int and use default 0 if parsing fails
    const parsedValue = type === "number" ? parseInt(value) || 0 : value;

    setAppForm({ ...appForm, [name]: parsedValue });

    console.log(`${name}:${parsedValue}`);
    console.log("Current State:", appForm); // added console.log to check state
  };

  const { authToken } = useContext(AuthContext);
  const api = import.meta.env.VITE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const data = new FormData();
    data.append("coverLetter", appForm.coverLetter);
    data.append("budget", appForm.budget);
    data.append("timeframe", appForm.timeframe);
    try {
      const response = await axios.post(
        `${api}/developer/applyJob/${jobId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        setSuccessMessage("Thank you for your application!");
        setAppForm({ coverLetter: "", budget: "", timeframe: 0 });
      } else {
        setErrors({ general: "Failed to submit application." });
        console.error("Failed to submit:", response);
      }
    } catch (e) {
      setErrors({ general: e.message || "An error occured" });
      console.error("Error during submission:", e);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-50 space-y-10">
      <Nav />
      <div className="max-w-3xl mx-auto bg-white  border border-gray-200  rounded-lg shadow-md p-6">
        {successMessage && (
          <div className="text-green-600 font-bold text-center mb-4">
            {successMessage}
          </div>
        )}
        {!successMessage && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 ">
                Apply for this Job
              </h2>
              <p className="text-gray-600 ">
                Showcase your expertise and let the client know why you're the
                best fit for their project.
              </p>
            </div>
            {errors.general && (
              <div className="text-red-500 mb-4">{errors.general}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 ">
                  Cover Letter
                </label>
                <textarea
                  name="coverLetter"
                  value={appForm.coverLetter}
                  onChange={handleChange}
                  placeholder="Highlight your skills, experience, and why you're the perfect fit..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50  text-gray-800  min-h-[200px] focus:ring-primary focus:border-primary"
                  required
                />
                <p className="text-sm text-gray-500 ">
                  Provide a detailed explanation of why you're the best
                  candidate for this job.
                </p>
                {errors.coverLetter && (
                  <span className="text-sm text-red-500">
                    {errors.coverLetter}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Your Budget ($)
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={appForm.budget}
                    onChange={handleChange}
                    placeholder="Enter your proposed budget"
                    className="w-full p-3 border border-gray-300  rounded-md bg-gray-50 text-gray-800  focus:ring-primary focus:border-primary"
                    required
                  />
                  {errors.budget && (
                    <span className="text-sm text-red-500">
                      {errors.budget}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Timeframe (Days)
                  </label>
                  <input
                    type="number"
                    name="timeframe"
                    value={appForm.timeframe}
                    onChange={handleChange}
                    placeholder="Enter the estimated completion time"
                    className="w-full p-3 border border-gray-300  rounded-md bg-gray-50  text-gray-800  focus:ring-primary focus:border-primary"
                    required
                  />
                  {errors.timeframe && (
                    <span className="text-sm text-red-500">
                      {errors.timeframe}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 bg-green text-white rounded-md hover:bg-blue focus:ring-2 focus:ring-primary focus:outline-none ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Proposal"}
              </button>
            </form>
            <div className="text-center text-sm text-gray-500  mt-4">
              By submitting your proposal, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              .
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
