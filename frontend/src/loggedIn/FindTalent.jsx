import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import { AuthContext } from "../AuthContext";
import TalentCard from "./TalentCard";

const jobRoles = [
  "Data Scientist",
  "Database Engineer",
  "Designer",
  "DevOps Engineer",
  "DotNet Developer",
  "Information Technology",
  "Java Developer",
  "Network Security Engineer",
  "Python Developer",
  "QA",
  "React Developer",
  "SAP Developer",
  "SQL Developer",
];

export default function FindWork() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allDevs, setAllDevs] = useState([]);
  const [devs, setDevs] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [showCount, setShowCount] = useState(16);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchJobs = async () => {
      console.log("fetching devs");
      const response = await axios.get(`${api}/developer/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setAllDevs(response.data.data);
      console.log(response.data.data);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [selectedRole, showCount, sortBy, allDevs]);

  const handleFilterChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleShowChange = (event) => {
    setShowCount(parseInt(event.target.value, 10));
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const applyFiltersAndSort = () => {
    let filteredAndSortedDevs = [...allDevs];

    // Apply filter
    if (selectedRole && selectedRole !== "all") {
      filteredAndSortedDevs = filteredAndSortedDevs.filter(
        (dev) => dev.tag === selectedRole
      );
    }

    //Apply sorting
    if (sortBy === "rate") {
      filteredAndSortedDevs.sort((a, b) => {
        const rateA = parseFloat(a.rate);
        const rateB = parseFloat(b.rate);

        // Ensure that 'Negotiable' or non-numeric values are always last by treating as Max Value (for this example)
        const isANegotiable = isNaN(rateA);
        const isBNegotiable = isNaN(rateB);

        if (isANegotiable && isBNegotiable) return 0;
        if (isANegotiable) return 1; // 'Negotiable' or non-numeric values come last.
        if (isBNegotiable) return -1; // 'Negotiable' or non-numeric values come last.

        return rateA - rateB; // Numerical Sort
      });
    } else if (sortBy === "projects") {
      filteredAndSortedDevs.sort(
        (a, b) => b.completedJobs.length - a.completedJobs.length
      );
    }

    //Apply Show Count
    filteredAndSortedDevs = filteredAndSortedDevs.slice(0, showCount);
    setDevs(filteredAndSortedDevs);
  };
  return (
    <div>
      <Nav />
      <div className="xl:px-20 lg:px-10 px-5 my-5 xl:my-10 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 -z-10 mx-auto w-[300px] h-[50px] lg:w-[600px]  bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] rounded-full blur-3xl opacity-50"></div>
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
            Find <span className="text-green">Talent </span>
          </h1>
        </div>
        <div className="bg-[#23a6f0] text-white p-4 rounded-md flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Filter</span>
              <select
                className="w-[150px] bg-white text-black px-2 py-1 border rounded-md"
                onChange={handleFilterChange}
                value={selectedRole}
              >
                <option value="all">All</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <span>
              Showing {devs.length} of {allDevs.length} results
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                className="w-[70px] bg-white text-black px-2 py-1 border rounded-md"
                onChange={handleShowChange}
                value={showCount}
              >
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="48">48</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span>Sort By</span>
              <select
                className="w-[120px] bg-white text-black px-2 py-1 border rounded-md"
                onChange={handleSortChange}
                value={sortBy}
              >
                <option value="default">Default</option>
                <option value="rate">Hourly Rate</option>
                <option value="projects">Projects</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-5 ">
          {devs &&
            devs.map((element) => {
              return <TalentCard key={element._id} dev={element} />;
            })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
