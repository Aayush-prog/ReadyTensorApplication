import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import Nav from "../Nav";
import Footer from "../Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PieChartCard from "./PieChartCard";
import Card from "./justCard";
export default function ClientHome() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [createJob, setCreateJob] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    catchphrase: "",
    additionalInfo: "",
    requiredTags: [""],
  });
  const [statusFilter, setStatusFilter] = useState("All"); // State for dropdown filter

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobForm({ ...jobForm, [name]: value });
  };
  const handleTagsChange = (index, value) => {
    console.log("on tag change");
    const newTags = [...jobForm.requiredTags];
    newTags[index] = value;
    setJobForm({ ...jobForm, requiredTags: newTags });
  };
  const addTag = () => {
    console.log("on tag change");
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
    try {
      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }
      const response = await axios.post(`${api}/client/createJob`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCreateJob(false);
      navigate("/home");
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${api}/client/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(response.data.data);
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs); // Initially set filtered jobs to all jobs
        setLoading(false);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    if (authToken) {
      // Only fetch if authToken is available
      fetchProfile();
    }
  }, [authToken]); // Add authToken to the dependency array

  // Function to handle status filter changes
  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    if (selectedStatus === "All") {
      setFilteredJobs(jobs); // Show all jobs
    } else {
      const filtered = jobs.filter((job) => job.status === selectedStatus);
      setFilteredJobs(filtered); // Apply filter
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <Nav />
      {createJob && (
        <div className="xl:px-20 lg:px-10 px-5 my-5 xl:my-10 space-y-8">
          <h1 className="text-2xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-bold text-center">
            Pitch your <span className="text-green">idea</span> for{" "}
            <span className="text-blue">talents</span> to be hired!
          </h1>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium">Job Title</label>
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
              <label className="block text-sm font-medium">Job Budget</label>
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
                Add Syllabus Item
              </button>
            </div>
            <button
              type="submit"
              className=" text-center p-2 bg-green text-white text-sm font-medium rounded-md w-full"
            >
              Submit
            </button>
          </form>
        </div>
      )}
      {user && !createJob && (
        <div className="px-4 lg:px-8 xl:px-10 my-5 xl:my-10 space-y-8 xl:space-y-20 mx-auto max-w-7xl">
          <div className="relative">
            <div className="absolute inset-0 -z-10 mx-auto w-[300px] h-[50px] lg:w-[600px]  bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] rounded-full blur-3xl opacity-50"></div>
            <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
              Welcome <span className="text-blue">{user.name} </span> !
            </h1>
          </div>

          <div className="space-y-14">
            <h2
              className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold"
              aria-label="User Insights"
            >
              Here are your insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {["Ongoing", "Completed", "Open"].map((status, index) => (
                <div key={status} className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-sm font-medium">{`${status} Jobs`}</h2>
                  <div className="text-2xl font-bold mt-2">
                    {status === "Ongoing"
                      ? user.ongoingJobs.length
                      : status === "Completed"
                      ? user.completedJobs.length
                      : user.openJobs.length}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4">
                  Job Status Overview (%)
                </h2>
                <div className="w-full max-w-xs mx-auto">
                  <PieChartCard
                    data={[
                      user.openJobs.length,
                      user.ongoingJobs.length,
                      user.completedJobs.length,
                    ]}
                  />
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold ">All Jobs</h2>
                  <select
                    className="border rounded-md p-2 text-sm"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="All">All</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card job={job} key={job._id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        className="fixed bottom-6 right-6 bg-blue hover:bg-green text-white p-4 rounded-full shadow-lg focus:outline-none"
        aria-label="Floating Action Button"
        onClick={(e) => {
          setCreateJob(!createJob);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
      <Footer />
    </div>
  );
}
