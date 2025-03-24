import React, { useContext } from "react";
import { FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function WorkCard(props) {
  const { id } = useContext(AuthContext);
  const job = props.job;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/job/${job._id}`);
  };
  const handleApply = () => {
    navigate(`/applyJob/${job._id}`);
  };
  return (
    <div
      className="p-6 border rounded-lg shadow-sm bg-white"
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="text-[#63c132] mr-1">✔</span>
              <span>{job.client}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600">{job.description}</p>

        <div className="flex flex-wrap gap-2">
          {job.requiredTags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-[#63c132] font-semibold">{job.budget}</span>
              <span className="text-gray-500">/hour</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="font-semibold">{job.applicants.length}</span>
              <span className="ml-1">proposals</span>
            </div>
          </div>
          {job.status === "Open" && (
            <button
              className="px-4 py-2 bg-green text-white rounded-md hover:bg-green/90"
              onClick={handleApply}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
