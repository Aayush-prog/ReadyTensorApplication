import React from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import Problem from "../assets/problem.png";
import Solution from "../assets/solution.png";
import { useNavigate } from "react-router-dom";
const WhyDevX = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/signUp");
  };
  return (
    <div>
      <Nav />
      <div className="bg-white">
        <header className="py-12 bg-blue">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Why DevX?</h1>
            <p className="text-xl text-primary/80">
              Bridging the gap between talent and opportunity.
            </p>
          </div>
        </header>

        <section className="py-16">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="px-4 ">
              <h2 className="text-3xl font-semibold text-primary mb-4">
                The Developer Talent Challenge
              </h2>
              <p className="text-lg text-primary/80 mb-6">
                The rapid growth in computer science has created a saturated
                developer market. Employers struggle to find the right talent,
                while skilled developers often go unnoticed.
              </p>
              <p className="text-lg text-primary/80 mb-6">
                Traditional hiring methods are often costly, time-consuming, and
                inefficient. Existing platforms don't focus enough on precise
                skill matching.
              </p>
            </div>
            <div className="flex justify-center ">
              <img
                src={Problem}
                alt="Developer Talent Challenge"
                className=" w-5/6 max-w-md "
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <img
                src={Solution}
                alt="DevX Solution"
                className=" w-5/6 max-w-md "
              />
            </div>
            <div className="px-4">
              <h2 className="text-3xl font-semibold text-primary mb-4">
                DevX: Your Solution
              </h2>
              <p className="text-lg text-primary/80 mb-6">
                DevX is a web-based platform designed to bridge the gap between
                employers and developers through innovative methods.
              </p>
              <p className="text-lg text-primary/80 mb-6">
                Our advanced Natural Language Processing (NLP) automates
                skill-matching, making it easier for employers to discover the
                right talent. We ensure fair opportunities for all developers.
              </p>
              <p className="text-lg text-primary/80 mb-6">
                We prioritize skill-based matching, benefiting both employers
                and developers, with efficient and streamlined hiring process.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-semibold text-primary text-center mb-8">
              Core Features of DevX
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Profile Management
                </h3>
                <p className="text-primary/80">
                  Developers can create detailed profiles showcasing their
                  skills and experience.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Job Postings
                </h3>
                <p className="text-primary/80">
                  Employers can post detailed job descriptions, outlining the
                  specific needs for their roles.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Automated Recommendations
                </h3>
                <p className="text-primary/80">
                  Our smart system provides personalized recommendations,
                  ensuring the right matches.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Public Reviews
                </h3>
                <p className="text-primary/80">
                  Transparent public reviews ensure fair and reliable
                  interactions for both sides.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Skill-Based Matching
                </h3>
                <p className="text-primary/80">
                  We focus on skills to create better and more efficient
                  matches.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Efficient Hiring Process
                </h3>
                <p className="text-primary/80">
                  Optimized for speed and effectiveness, streamlining the hiring
                  process.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 ">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-semibold text-primary mb-6">
              Ready to experience a better way to hire and find opportunities?
            </h2>
            <button
              className="bg-blue hover:bg-green text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
              onClick={handleClick}
            >
              Join DevX Today
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default WhyDevX;
