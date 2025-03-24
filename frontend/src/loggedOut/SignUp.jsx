import React from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import { BsSuitcaseLg } from "react-icons/bs";
import { MdOutlineLaptopMac } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const handleClientClick = () => {
    navigate("/client");
  };
  const handleDevClick = () => {
    navigate("/talent");
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-1">
        <div className="my-5 lg:my-10">
          <div>
            <h1 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-center">
              Join as a <span className="text-green">client</span> or a{" "}
              <span className="text-blue">talent</span>
            </h1>
          </div>
          <div className="flex lg:flex-row flex-col justify-center">
            <div
              className="flex flex-col space-y-5 items-center border rounded-lg m-5 lg:m-10 p-10 cursor-pointer"
              onClick={handleClientClick}
            >
              <BsSuitcaseLg className="lg:text-6xl text-4xl" />
              <h1>I'm a client hiring for a project.</h1>
            </div>
            <div
              data-testid="talent-card"
              className="flex flex-col space-y-5 items-center border rounded-lg m-5 lg:m-10 p-10 cursor-pointer "
              onClick={handleDevClick}
            >
              <MdOutlineLaptopMac className="lg:text-6xl text-4xl" />
              <h1>I'm a talent looking for ideas.</h1>
            </div>
          </div>
          <h1 className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue">
              Login
            </Link>
          </h1>
        </div>
      </div>
      <Footer />
    </div>
  );
}
