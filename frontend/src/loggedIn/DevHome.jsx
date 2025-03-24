import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import Nav from "../Nav";
import Footer from "../Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PieChartCard from "./DevPie";
import Card from "./justCard";

export default function DevHome() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applied, setApplied] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${api}/developer/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        setUser(response.data.data);
        setJobs(response.data.jobs);
        // set the applied state here
        setApplied(response.data.applied);
        setFilteredJobs([...response.data.jobs, ...response.data.applied]); // Initially set all jobs
        setLoading(false);
        console.log(response.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    if (authToken) {
      fetchProfile();
    }
  }, [authToken]);

  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
    if (selectedStatus === "All") {
      setFilteredJobs([...jobs, ...applied]);
    } else if (selectedStatus === "Applied") {
      setFilteredJobs(applied);
    } else {
      const filtered = jobs.filter((job) => job.status === selectedStatus);
      setFilteredJobs(filtered);
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
      {user && (
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
              {["Applied", "Completed", "In Progress"].map((status, index) => (
                <div key={status} className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-sm font-medium">{`${status} Jobs`}</h2>
                  <div className="text-2xl font-bold mt-2">
                    {status === "Applied"
                      ? applied.length
                      : status === "Completed"
                      ? user.completedJobs.length
                      : user.ongoingJobs.length}
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
                      applied.length,
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
                    <option value="Applied">Applied</option>
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
      <Footer />
    </div>
  );
}
