import React, { useContext, useState, useEffect } from "react";
import logo from "./assets/devx.png";
import { CiSearch } from "react-icons/ci";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";
export default function Nav() {
  const navigate = useNavigate();
  const { authToken, role, logout } = useContext(AuthContext);
  const [search, setSearch] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(response.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    if (authToken && role) {
      fetchProfile();
    }
  }, [authToken, role]);
  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleClick = () => {
    console.log("clicked");
  };
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const targetPath = role ? "/home" : "/";
  console.log(targetPath);
  return (
    <nav className="">
      {/* Navbar Section */}
      <div className="relative flex justify-between items-center p-4 bg-white z-50 xl:px-20 lg:px-10 px-5">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-1">
            <img src={logo} alt="DevX Logo" className="w-12 h-12" />
            <span className="font-bold text-xl">DevX</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:block">
            <ul className="flex space-x-6 font-medium">
              <NavLink
                data-testid="desktopHome"
                to={targetPath}
                className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8"
              >
                Home
              </NavLink>
              <NavLink
                data-testid="desktopFindTalent"
                to="/findTalent"
                className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8"
              >
                Find Talent
              </NavLink>
              <NavLink
                data-testid="desktopFindWork"
                to="/findWork"
                className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8"
              >
                Find Work
              </NavLink>
              <NavLink
                data-testid="desktopWhyDevX"
                to="/whyDevX"
                className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8"
              >
                Why DevX
              </NavLink>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden xl:flex items-center space-x-6">
          {/* Search Bar */}
          <div className="flex items-center border border-black rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search"
              className="p-2 pl-3 outline-none xl:w-[100px] 2xl:w-[200px]"
              name="Search"
              onChange={handleChange}
            />
            <button className="p-2 bg-blue" onClick={handleClick}>
              <CiSearch className="text-2xl" />
            </button>
          </div>
          {/* Logout and Profile */}
          <div
            className={`${
              role ? "block" : "hidden"
            } flex items-center space-x-4 `}
          >
            <button data-testid="desktopLogout" onClick={handleLogout}>
              Log Out
            </button>
            <Link to="/settings">
              <img
                data-testid="desktopProfile"
                src={`http://localhost:8000/images/${user ? user.image : null}`}
                className="rounded-xl w-10 h-10"
              ></img>
            </Link>
          </div>
          {/* Login & Signup Buttons */}
          <div
            className={`${
              role ? "hidden" : "block"
            } flex items-center space-x-4 `}
          >
            <Link
              data-testid="desktopLogin"
              to="/login"
              className="text-black hover:underline underline-offset-8"
            >
              Login
            </Link>
            <Link
              data-testid="desktopSignUp"
              to="/signUp"
              className="bg-green rounded-lg p-2 px-3  text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="xl:hidden ml-auto flex items-center">
          <button onClick={toggleMobileMenu} className="text-xl">
            {mobileMenuOpen ? "X" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } fixed top-0 left-0 w-full h-full bg-white z-40 flex flex-col items-center justify-start shadow-lg mt-16`}
      >
        <ul className="space-y-6 text-xl font-medium w-full flex flex-col items-center">
          <NavLink
            to={targetPath}
            className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8 w-full text-center py-4"
            onClick={toggleMobileMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/findTalent"
            className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8 w-full text-center py-4"
            onClick={toggleMobileMenu}
          >
            Find Talent
          </NavLink>
          <NavLink
            to="/findWork"
            className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8 w-full text-center py-4"
            onClick={toggleMobileMenu}
          >
            Find Work
          </NavLink>
          <NavLink
            to="/whyDevX"
            className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8 w-full text-center py-4"
            onClick={toggleMobileMenu}
          >
            Why DevX
          </NavLink>
          <Link to="/settings" className={`${role ? "block" : "hidden"} `}>
            <img
              src={`http://localhost:8000/images/${user ? user.image : null}`}
              className="rounded-xl w-10 h-10"
            ></img>
          </Link>
          <button
            onClick={handleLogout}
            className={`${role ? "block" : "hidden"}`}
          >
            Log Out
          </button>
          <Link
            to="/login"
            className={`${
              role ? "hidden" : "block"
            } text-black hover:underline underline-offset-8`}
          >
            Login
          </Link>
          <Link
            to="/signUp"
            className={`${
              role ? "hidden" : "block"
            }bg-green rounded-lg p-2 px-3  text-white`}
          >
            Sign Up
          </Link>
        </ul>
      </div>
    </nav>
  );
}
