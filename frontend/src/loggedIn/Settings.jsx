import React, { useContext, useEffect, useState } from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { FaCamera } from "react-icons/fa"; // Import the camera icon

export default function SettingsPage() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken, role } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [user, setUser] = useState();
  const [formData, setFormData] = useState({
    image: null,
    resume: null,
    name: "",
    description: "",
    email: "",
    phone: "",
    password: "",
    rate: 0,
  });
  const [imagePreview, setImagePreview] = useState(null);

  let url = `${api}/client/dashboard`;

  useEffect(() => {
    if (role === "developer") {
      url = `${api}/developer/dashboard`;
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(response.data.data);
        setLoading(false);
        console.log(response.data);
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError("Failed to fetch user data.");
      }
    };

    if (authToken) {
      // Only fetch if authToken is available
      fetchProfile();
    }
  }, [authToken, role, api, url]); // Added dependencies

  useEffect(() => {
    if (user) {
      setFormData({
        image: null, // Reset to null when user data loads, use existing image for preview
        description: user.description,
        rate: user.rate || null,
        email: user.email,
        resume: null, // Reset to null, use existing resume for preview
        name: user.name,
        phone: user.phone,
      });
      // Set initial image and resume preview if they exist
      if (user.image) {
        setImagePreview(`${api}/images/${user.image}`); // Or construct URL as appropriate
      }
    }
  }, [user, api]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData({ ...formData, [name]: file });

    // Set preview for image
    if (name === "image" && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("password", formData.password);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("rate", formData.rate);
  formDataToSend.append("phone", formData.phone);
  if (formData.image) {
    formDataToSend.append("image", formData.image);
  }
  if (formData.resume) {
    formDataToSend.append("resume", formData.resume);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${api}/signup/developer`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        navigate("/login");
      }
    } catch (error) {
      setError(` ${error.response?.data?.msg || "error occurred"} `);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-lg space-y-4 mx-auto"
      >
        <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl font-bold">
          Update your <span className="text-blue">Profile</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium">Profile Picture</label>
            <div
              onClick={() => document.getElementById("imageInput").click()}
              className="cursor-pointer border border-gray-300 p-2 rounded-full w-15 h-15 flex justify-center items-center overflow-hidden relative"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover "
                />
              ) : (
                <span>Click to upload Profile</span>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition">
                <FaCamera className="text-primary text-5xl" />
              </div>
            </div>
            <input
              type="file"
              id="imageInput"
              name="image"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium ">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +9779800000000"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {role === "developer" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rate
                </label>
                <input
                  type="string"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Negotiable"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload Resume */}
        {role === "developer" && (
          <div>
            <label className="block text-sm font-medium">Upload Resume</label>
            <input
              type="file"
              name="resume"
              required
              onChange={handleFileChange}
              className="block w-full mt-1 text-sm text-gray file:mr-4 file:py-2 file:px-4 file:border file:text-sm file:font-semibold file:bg-blue file:text-white hover:file:bg-blue"
            />
          </div>
        )}

        {error && <div className="text-red">{error}</div>}
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue hover:bg-green rounded-md focus:outline-none focus:ring-2 focus:ring-green"
        >
          Submit
        </button>
      </form>
      <Footer />
    </div>
  );
}
