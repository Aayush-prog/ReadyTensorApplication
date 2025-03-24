import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import { CiMail } from "react-icons/ci";
import { FaPhoneAlt } from "react-icons/fa";
import { LuMessageSquareText } from "react-icons/lu";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
function DevDisplay() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken, id, role } = useContext(AuthContext);
  const { devId } = useParams();
  const [dev, setDev] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("completedJobs");
  const handleChatClick = () => {
    navigate(`/chat?currentUser=${id}&chatUser=${devId}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${api}/developer/getDevById/${devId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setDev(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [devId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!dev) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Talent not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* Added min-h-screen for full height */}
      <Nav />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="space-y-6">
                {" "}
                {/* Added space-y-6 for spacing within */}
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="md:w-1/3 flex items-center">
                    <img
                      src={`${api}/images/${dev.image}`}
                      alt={dev.name}
                      className="rounded-full object-cover w-48 h-48 mx-auto"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h1 className="text-3xl font-bold mb-2">{dev.name}</h1>
                    <p className="text-xl text-gray-600 mb-4">{dev.tag}</p>
                    <p className="mb-4">{dev.description}</p>
                    <div className="grid lg:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Contact</h2>
                        <p className="flex itmes-center gap-3 ">
                          <CiMail /> {dev.email}
                        </p>
                        <p className="flex itmes-center gap-3 ">
                          <FaPhoneAlt /> {dev.phone}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Rate</h2>
                        <p>${dev.rate}/hour</p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {dev.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 mb-6">
                      <a
                        href={`${api}/resumes/${dev.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue text-white px-4 py-2 rounded hover:bg-green"
                      >
                        View Resume
                      </a>
                      <button
                        className="flex items-center border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 gap-3"
                        onClick={handleChatClick}
                      >
                        <LuMessageSquareText />
                        Chat with me
                      </button>
                    </div>
                  </div>
                </div>
                {/* Tabs Section */}
                <div className="mt-8">
                  <div className="flex border-b">
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "completedJobs"
                          ? "text-gray-900 border-b-2 border-[#82c91e]"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      id="completedJobs-tab"
                      onClick={() => setActiveTab("completedJobs")}
                    >
                      Projects
                    </button>
                    {role === "client" && (
                      <button
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "reviews"
                            ? "text-gray-900 border-b-2 border-[#82c91e]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        id="reviews-tab"
                        onClick={() => setActiveTab("reviews")}
                      >
                        Reviews
                      </button>
                    )}
                  </div>

                  <div className="mt-4">
                    {activeTab === "completedJobs" && (
                      <p className="text-gray-600">
                        {dev.completedJobs.length}
                      </p>
                    )}
                    {activeTab === "reviews" && (
                      <>
                        <ReviewForm revieweeId={dev._id} reviewerId={id} />
                        {dev.review?.length > 0
                          ? dev.review.map((reviewId, index) => {
                              return (
                                <ReviewCard reviewId={reviewId} key={index} />
                              );
                            })
                          : "No reivews yet "}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DevDisplay;
