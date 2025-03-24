import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
export default function TalentCard(props) {
  const dev = props.dev;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/dev/${dev._id}`);
  };

  return (
    <div
      className="p-6 border rounded-lg shadow-sm bg-white"
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{dev.name}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="text-[#63c132] mr-1">✔</span>
              <span>{dev.tag}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">
                <FaPhoneAlt />
              </span>
              <span>{dev.phone}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600">{dev.description}</p>

        <div className="flex flex-wrap gap-2">
          {dev.skills.map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-[#63c132] font-semibold">${dev.rate}</span>
              <span className="text-gray-500">/hour</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="font-semibold">{dev.completedJobs.length}</span>
              <span className="ml-1">projects completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
