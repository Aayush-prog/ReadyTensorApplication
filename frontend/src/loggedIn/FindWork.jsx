import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import WorkCard from "./WorkCard";
import { AuthContext } from "../AuthContext";

export default function FindWork() {
  const api = import.meta.env.VITE_URL;
  const { authToken, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [originalJobs, setOriginalJobs] = useState([]); // Store the original jobs
  const [showCount, setShowCount] = useState(16); // Default show count
  const [sortBy, setSortBy] = useState("default"); // Default sort option

  useEffect(() => {
    const fetchJobs = async () => {
      console.log("fetching jobs");
      var url = `${api}/jobs`;
      if (role === "developer") {
        url = `${api}/jobs/matchJob`;
      }
      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setJobs(response.data.data);
        setOriginalJobs([...response.data.data]); // Store the original data
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [authToken, api]);

  // Function to handle sorting
  const handleSort = (event) => {
    const selectedValue = event.target.value;
    setSortBy(selectedValue);

    if (selectedValue === "default") {
      setJobs([...originalJobs]); // Reset to original order
      return;
    }

    let sortedJobs = [...jobs]; // Create a copy to avoid mutating the state directly

    if (selectedValue === "budgetAsc") {
      sortedJobs.sort((a, b) => {
        const budgetA =
          typeof a.budget === "string"
            ? a.budget.toLowerCase().includes("negotiable")
              ? Number.MIN_SAFE_INTEGER
              : parseFloat(a.budget)
            : a.budget;
        const budgetB =
          typeof b.budget === "string"
            ? b.budget.toLowerCase().includes("negotiable")
              ? Number.MIN_SAFE_INTEGER
              : parseFloat(b.budget)
            : b.budget;

        return budgetA - budgetB;
      });
    } else if (selectedValue === "budgetDsc") {
      sortedJobs.sort((a, b) => {
        const budgetA =
          typeof a.budget === "string"
            ? a.budget.toLowerCase().includes("negotiable")
              ? Number.MIN_SAFE_INTEGER
              : parseFloat(a.budget)
            : a.budget;
        const budgetB =
          typeof b.budget === "string"
            ? b.budget.toLowerCase().includes("negotiable")
              ? Number.MIN_SAFE_INTEGER
              : parseFloat(b.budget)
            : b.budget;

        return budgetB - budgetA;
      });
    }
    setJobs(sortedJobs); // Update jobs state with the sorted list
  };
  // Function to handle show count
  const handleShowCountChange = (event) => {
    setShowCount(parseInt(event.target.value, 10));
  };

  // Calculate jobs to display based on showCount
  const jobsToDisplay = jobs ? jobs.slice(0, showCount) : [];

  return (
    <div>
      <Nav />

      <div className="xl:px-20 lg:px-10 px-5 my-5 xl:my-10 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 -z-10 mx-auto w-[300px] h-[50px] lg:w-[600px]  bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] rounded-full blur-3xl opacity-50"></div>
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
            Find <span className="text-blue">Work </span>
          </h1>
        </div>
        <div className="bg-green text-white p-4 rounded-md flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-transparent text-white hover:bg-white/20 rounded-md">
              Filter
            </button>
            <span>
              Showing 1–{jobsToDisplay.length} of {jobs.length} results
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                className="w-[70px] bg-white text-black px-2 py-1 border rounded-md"
                value={showCount}
                onChange={handleShowCountChange}
              >
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={48}>48</option>
                <option value={jobs.length}>All</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span>Sort By</span>
              <select
                className="w-[120px] bg-white text-black px-2 py-1 border rounded-md"
                value={sortBy}
                onChange={handleSort}
              >
                <option value="default">Default</option>
                <option value="budgetAsc">Budget (Ascending)</option>
                <option value="budgetDsc">Budget (Descending)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-5 ">
          {jobsToDisplay &&
            jobsToDisplay.map((element) => {
              console.log(element);
              return <WorkCard key={element._id} job={element} />;
            })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
