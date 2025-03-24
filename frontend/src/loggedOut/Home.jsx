import React, { useState } from "react";
import Nav from "../Nav.jsx";
import group from "../assets/Group 137.png";
import creator from "../assets/creator.png";
import { MdGroups } from "react-icons/md";
import { BsFillBuildingsFill } from "react-icons/bs";
import { FaHandshake } from "react-icons/fa";
import Footer from "../Footer.jsx";
export default function Home() {
  const [email, setEmail] = useState(null);

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleClick = () => {
    console.log("clicked");
  };
  return (
    <div>
      <Nav />
      <div className="xl:px-20 lg:px-10 px-5">
        <div className="flex flex-col lg:flex-row xl:space-x-10 items-center">
          <div className=" xl:space-y-5 space-y-2 text-center lg:text-left">
            <h1 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
              Work <span className=" text-blue">Remotely</span>
              <br /> from your home or any other place
            </h1>
            <h1>
              We curate the best digital jobs for those who are looking to start
              their career in developing ideas to products.
            </h1>
            <div className="flex border border-black rounded-full overflow-hidden max-w-xs m-auto lg:m-0">
              <input
                type="text"
                placeholder="Enter your email"
                className="2xl:py-1 2xl:px-5 px-3  outline-none text-sm flex-grow"
                name="email"
                onChange={handleChange}
              />
              <button
                className="m-1 p-2 xl:px-3 bg-green text-white text-sm rounded-full hover:bg-blue transition"
                onClick={handleClick}
              >
                Get Started
              </button>
            </div>
          </div>
          <img src={group} className=" 2xl:h-[600px] xl:h-[400px] h-[300px] " />
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-evenly 2xl:space-x-[200px] pb-7">
          <img
            src={creator}
            className="2xl:h-[700px] xl:h-[400px] h-[300px] w-1/2 order-2 lg:order-1 "
          />
          <div className=" xl:space-y-5 space-y-2 order-1 text-center lg:text-lef lg:order-2t">
            <h1 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
              Where <span className=" text-green">Idea</span>
              <br /> meets <span className="text-blue">Talent</span>
            </h1>
            <h1>Turn your ideas into the best it could be.</h1>
          </div>
        </div>
      </div>
      <div className="xl:space-y-14 space-y-8">
        <div className="flex flex-col  items-center space-y-5">
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold ">
            Manage your entire community<br></br> in a single system
          </h1>
          <span>Who is DevX suitable for?</span>
        </div>
        <div className="grid lg:grid-cols-3 items-center px-20 lg:gap-[200px] gap-10">
          <div className="flex flex-col items-center text-center relative">
            <div
              className="bg-[#A7F3D0] absolute left-1/2 transform rounded-tl-3xl rounded-br-3xl 2xl:w-16 2xl:h-16 lg:w-11 lg:h-11"
              aria-hidden="true"
            ></div>
            <MdGroups className="text-green text-4xl lg:text-4xl 2xl:text-6xl z-10 " />
            <h1 className="2xl:text-2xl xl:text-xl font-semibold mt-4">
              Membership Organizations
            </h1>
            <span className="hidden xl:block mt-2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus id
              obcaecati ad quibusdam et impedit officiis dicta dolorem minima
              dolorum, labore neque doloremque blanditiis enim quas maxime
              sapiente? Sequi, iure!
            </span>
          </div>
          <div className="flex flex-col items-center text-center relative">
            <div
              className="bg-[#A7F3D0] absolute left-1/2 transform rounded-tl-3xl rounded-br-3xl 2xl:w-16 2xl:h-16 lg:w-11 lg:h-11"
              aria-hidden="true"
            ></div>
            <BsFillBuildingsFill className="text-green text-4xl lg:text-4xl 2xl:text-6xl z-10 " />
            <h1 className="2xl:text-2xl xl:text-xl font-semibold mt-4">
              National Associations
            </h1>
            <span className="hidden xl:block mt-2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus id
              obcaecati ad quibusdam et impedit officiis dicta dolorem minima
              dolorum, labore neque doloremque blanditiis enim quas maxime
              sapiente? Sequi, iure!
            </span>
          </div>
          <div className="flex flex-col items-center text-center relative">
            <div
              className="bg-[#A7F3D0] absolute left-1/2 transform rounded-tl-3xl rounded-br-3xl 2xl:w-16 2xl:h-16 lg:w-11 lg:h-11"
              aria-hidden="true"
            ></div>
            <FaHandshake className="text-green text-4xl 2xl:text-6xl z-10 " />
            <h1 className="2xl:text-2xl xl:text-xl font-semibold mt-4">
              Clubs & Groups
            </h1>
            <span className="hidden xl:block mt-2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus id
              obcaecati ad quibusdam et impedit officiis dicta dolorem minima
              dolorum, labore neque doloremque blanditiis enim quas maxime
              sapiente? Sequi, iure!
            </span>
          </div>
        </div>
        {/* <div>
          <div className="flex flex-col items-center space-y-5 py-5">
            <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold ">
              Our Clients
            </h1>
            <span className="text-center">
              We have been working with some Fortune 500+ clients
            </span>
          </div>
        </div> */}
      </div>
      <Footer />
    </div>
  );
}
