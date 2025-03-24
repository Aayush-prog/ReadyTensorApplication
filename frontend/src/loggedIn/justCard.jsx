import React from "react";
import { useNavigate } from "react-router-dom";
export default function Card(props) {
  const job = props.job;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/job/${job._id}`);
  };
  return (
    <div
      key={job.id}
      className="p-4 border rounded-lg shadow-sm bg-gray-50"
      onClick={handleClick}
    >
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="text-sm text-gray-600">{job.company}</p>
      <p
        className={`inline-block px-2 py-1 mt-2 rounded text-sm font-medium ${
          job.status === "ongoing"
            ? "bg-blue-100 text-blue-700"
            : job.status === "completed"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {job.status}
      </p>
    </div>
  );
}
