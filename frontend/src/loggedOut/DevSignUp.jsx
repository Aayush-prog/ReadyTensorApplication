import React, { useState } from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function DevSignUp() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    image: null,
    resume: null,
    name: "",
    description: "",
    email: "",
    phone: "",
    password: "",
    rate: 0,
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };
  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("password", formData.password);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("rate", formData.rate);
  formDataToSend.append("phone", formData.phone);
  formDataToSend.append("image", formData.image);
  formDataToSend.append("resume", formData.resume);
  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
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
      console.log(response);
      if (response.data.status === "success") {
        navigate("/login");
      }
    } catch (error) {
      setError(` ${error.response?.data?.msg || "error occurred"} `);
    }
  };

  return (
    <div>
      <Nav />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-lg space-y-4 mx-auto"
      >
        <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl font-bold">
          Expose your <span className="text-blue">talent</span> !
        </h1>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium">Profile Picture</label>
            <input
              type="file"
              name="image"
              required
              onChange={handleFileChange}
              className="block w-full mt-1 text-sm text-gray file:mr-4 file:py-2 file:px-4 file:border file:text-sm file:font-semibold file:bg-green file:text-white hover:file:bg-green"
            />
          </div>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium ">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="John Doe"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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

        <div className="grid lg:grid-cols-2 gap-3">
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
              required
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
              required
              placeholder="e.g. +9779800000000"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rate
          </label>
          <input
            type="string"
            name="rate"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="e.g. Negotiable"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
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
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        {/* Upload Resume */}
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
        {/* Agree to Terms */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            required
            className="h-4 w-4 text-green border rounded focus:ring-blue"
          />
          <label className="ml-2 text-sm ">
            I agree to the{" "}
            <a href="#" className="text-blue underline">
              terms and conditions
            </a>
          </label>
        </div>
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
