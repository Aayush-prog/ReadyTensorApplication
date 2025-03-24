import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import axios from "axios";
export default function TalentCard(props) {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const application = props.application;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dev, setDev] = useState(null);
  const handleClick = () => {
    navigate(`/dev/${dev._id}`);
  };

  const handleHire = async (event) => {
    // Add 'event' as the parameter
    event.stopPropagation(); // Prevent click from bubbling up
    const response = await axios.post(`${api}/jobs/hire/${application._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response.data.status == "success") {
      alert("Hired succefully");
      navigate("/home");
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${api}/developer/getDevById/${application.developer}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setDev(response.data.data);

        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    if (authToken) {
      fetchProfile();
    }
  }, [authToken]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }
  return (
    <div className="grid lg:grid-cols-5 items-center p-6 border rounded-lg shadow-sm bg-white">
      <div>
        <h2>Cover Letter</h2>
        <p>{application.coverLetter}</p>
      </div>
      <div>
        <h2>Proposed Budget</h2>
        <p>{application.budget}</p>
      </div>
      <div>
        <h2>Proposed Timeframe</h2>
        <p>{application.timeframe}</p>
      </div>
      <div>
        <p className="hover:underline" onClick={handleClick}>
          {dev.name}
        </p>
      </div>
      <button onClick={handleHire} className="bg-green rounded-lg py-3">
        Hire Now
      </button>
    </div>
  );
}
