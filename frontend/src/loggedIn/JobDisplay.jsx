import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../AuthContext";
import axios from "axios";
import Footer from "../Footer";
import Nav from "../Nav";
import { LuMessageSquareText } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import ApplicantCard from "./ApplicantCard";
import TalentCard from "./ApplicantCard";

const JobDisplay = () => {
  const api = import.meta.env.VITE_URL;
  const { jobId } = useParams();
  const { authToken, role, id } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [owner, setOwner] = useState(false);
  const [editJob, setEditJob] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    requiredTags: [],
    status: "",
    catchphrase: "",
    additionalInfo: "",
  });

  useEffect(() => {
    if (job) {
      setJobForm({
        title: job.title,
        description: job.description,
        budget: job.budget,
        requiredTags: job.requiredTags || [],
        status: job.status,
        catchphrase: job.catchphrase,
        additionalInfo: job.additionalInfo,
      });
    }
  }, [job]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobForm({ ...jobForm, [name]: value });
  };

  const handleTagsChange = (index, value) => {
    const newTags = [...jobForm.requiredTags];
    newTags[index] = value;
    setJobForm({ ...jobForm, requiredTags: newTags });
  };

  const addTag = () => {
    setJobForm({ ...jobForm, requiredTags: [...jobForm.requiredTags, ""] });
  };

  const removeTag = (index) => {
    const newTag = jobForm.requiredTags.filter((_, i) => i !== index);
    setJobForm({ ...jobForm, requiredTags: newTag });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", jobForm.title);
    data.append("description", jobForm.description);
    data.append("budget", jobForm.budget);
    data.append("catchphrase", jobForm.catchphrase);
    data.append("additionalInfo", jobForm.additionalInfo);
    jobForm.requiredTags.forEach((item, index) => {
      data.append(`requiredTags[${index}]`, item);
    });
    for (const [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const response = await axios.patch(
        `${api}/client/editJob/${jobId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEditJob(false);

      // Update local job state with edited data
      setJob((prevJob) => ({ ...prevJob, ...jobForm }));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleClientClick = () => {
    navigate(`/chat?currentUser=${id}&chatUser=${job.client}`);
  };

  const handleDelete = async () => {
    const response = await axios.delete(`${api}/client/delJob/${jobId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    navigate("/home");
  };

  const handleApply = () => {
    navigate(`/applyJob/${job._id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${api}/jobs/getJobById/${jobId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response.data.applicants);
        setJob(response.data.data);
        setApplications(response.data.applications);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, authToken]);

  useEffect(() => {
    if (job && id === job.client) {
      setOwner(true);
    } else {
      setOwner(false);
    }
  }, [job, id]);
  const completeJob = async () => {
    const res = await axios.post(`${api}/jobs/completeJob/${job._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (res.data.status === "success") {
      alert("Successfully completed the job");
    }
  };
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

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Job not found</p>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className=" mx-auto  p-4 md:p-8 bg-gray-50 ">
        {editJob && (
          <div className="xl:px-20 lg:px-10 px-5 mt-5 xl:mt-10 space-y-8">
            <h1 className="text-2xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-bold text-center">
              Edit your <span className="text-green">job</span> post!
            </h1>
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto space-y-4"
            >
              <div className="flex gap-4">
                <div>
                  <label className="w-full text-sm font-medium">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleChange}
                    className=" p-2 mt-1 block w-full border rounded-md shadow-sm"
                    placeholder="Enter your job title"
                    required
                  />
                </div>
                <div>
                  <label className="w-full  text-sm font-medium">
                    Job Budget
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={jobForm.budget}
                    onChange={handleChange}
                    className=" p-2 mt-1 block w-full border rounded-md shadow-sm"
                    placeholder="Enter your job budget or keep it negotiable"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Job CatchPhrase
                </label>
                <input
                  type="text"
                  name="catchphrase"
                  value={jobForm.catchphrase}
                  onChange={handleChange}
                  className=" p-2 mt-1 block w-full border rounded-md shadow-sm"
                  placeholder="Enter your catchphrase to attract talents"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleChange}
                  className=" p-2 mt-1 block w-full border rounded-md shadow-sm"
                  placeholder="Enter your job description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Additional Info
                </label>
                <textarea
                  name="additionalInfo"
                  value={jobForm.additionalInfo}
                  onChange={handleChange}
                  className=" p-2 mt-1 block w-full border rounded-md shadow-sm"
                  placeholder="Enter your job description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium ">
                  Required Tags for better talent finds
                </label>
                {jobForm.requiredTags.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleTagsChange(index, e.target.value)}
                      className="mt-1 block p-2 w-full border  rounded-md shadow-sm"
                      placeholder={`Required Tag ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className=" bg-red p-2 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="mt-2 inline-flex items-center px-3 py-2 bg-blue text-white text-sm font-medium rounded-md "
                >
                  Add Tag
                </button>
              </div>
              <button
                type="submit"
                className=" text-center p-2 bg-green text-white text-sm font-medium rounded-md w-full"
              >
                Submit
              </button>
              <button
                className=" text-center p-2 bg-red text-white text-sm font-medium rounded-md w-full"
                onClick={handleDelete}
              >
                Delete
              </button>
            </form>
          </div>
        )}
        {!editJob && (
          <div className="min-h-screen ">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-3 sm:px-3 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {job.title}
                      </h1>
                      <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaUser />
                          <span>Client Name</span>
                        </div>
                        <button
                          className="flex items-center gap-2"
                          onClick={handleClientClick}
                        >
                          <LuMessageSquareText />
                          <span>Chat with Client</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600">{job.catchphrase}</p>

                    <div className="flex flex-wrap gap-2">
                      {job.requiredTags.map((tag, index) => {
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded"
                        >
                          {tag}
                        </span>;
                      })}
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-[#82c91e] font-semibold">
                          ${job.budget}
                        </span>
                        <span className="text-gray-500">/hour</span>
                      </div>
                      {job.status === "Open" && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">
                            {job.applicants.length}
                          </span>
                          <span className="text-gray-500">proposals</span>
                        </div>
                      )}
                      {job.status === "In Progress" && owner && (
                        <div className="flex items-center gap-1">
                          <button
                            className="p-3 bg-green rounded-lg"
                            onClick={completeJob}
                          >
                            Complete Job
                          </button>
                        </div>
                      )}
                    </div>

                    {job.status === "Open" && (
                      <button
                        className="bg-[#82c91e] text-white px-4 py-2 rounded-md hover:bg-[#74b816]"
                        onClick={handleApply}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>

                  {/* Tabs Section */}
                  <div className="mt-8">
                    <div className="flex border-b">
                      <button
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "description"
                            ? "text-gray-900 border-b-2 border-[#82c91e]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        id="description-tab"
                        onClick={() => setActiveTab("description")}
                      >
                        Description
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "additional-info"
                            ? "text-gray-900 border-b-2 border-[#82c91e]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        id="additional-info-tab"
                        onClick={() => setActiveTab("additional-info")}
                      >
                        Additional Information
                      </button>
                      {owner && (
                        <button
                          className={`px-4 py-2 text-sm font-medium ${
                            activeTab === "applicants"
                              ? "text-gray-900 border-b-2 border-[#82c91e]"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                          id="applicants-tab"
                          onClick={() => setActiveTab("applicants")}
                        >
                          {job.developer ? "Developer" : "Applicants"}
                        </button>
                      )}
                    </div>

                    <div className="mt-4">
                      {activeTab === "description" && (
                        <p className="text-gray-600">{job.description}</p>
                      )}
                      {activeTab === "additional-info" && (
                        <p className="text-gray-600">{job.additionalInfo}</p>
                      )}
                      {activeTab === "applicants" &&
                        !job.developer &&
                        applications.map((application, key) => {
                          return <ApplicantCard application={application} />;
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
        {owner && (
          <button
            className="fixed bottom-6 right-6 bg-blue hover:bg-green text-white p-4 rounded-full shadow-lg focus:outline-none"
            aria-label="Floating Action Button"
            onClick={(e) => {
              setEditJob(!editJob);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default JobDisplay;
