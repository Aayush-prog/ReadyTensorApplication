"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const jobData = {
  ongoing: 5,
  completed: 12,
  open: 8,
  allJobs: [
    {
      id: 1,
      title: "Frontend Developer",
      status: "ongoing",
      company: "TechCorp",
      dueDate: "2023-07-15",
    },
    {
      id: 2,
      title: "UX Designer",
      status: "completed",
      company: "DesignHub",
      dueDate: "2023-06-30",
    },
    {
      id: 3,
      title: "Backend Engineer",
      status: "open",
      company: "DataSystems",
      dueDate: "2023-08-01",
    },
    {
      id: 4,
      title: "Product Manager",
      status: "ongoing",
      company: "ProductCo",
      dueDate: "2023-07-20",
    },
    {
      id: 5,
      title: "Data Scientist",
      status: "completed",
      company: "AITech",
      dueDate: "2023-06-25",
    },
  ],
};

export default function DashboardPage() {
  const chartData = {
    labels: ["Ongoing", "Completed", "Open"],
    datasets: [
      {
        data: [jobData.ongoing, jobData.completed, jobData.open],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Job Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {["Ongoing", "Completed", "Open"].map((status, index) => (
          <div key={status} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-sm font-medium">{`${status} Jobs`}</h2>
            <div className="text-2xl font-bold mt-2">
              {status === "Ongoing"
                ? jobData.ongoing
                : status === "Completed"
                ? jobData.completed
                : jobData.open}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Job Status Overview</h2>
          <div className="w-full max-w-xs mx-auto">
            <Pie data={chartData} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">All Jobs</h2>
          <div className="space-y-4">
            {jobData.allJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
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
                <p className="text-sm text-gray-500 mt-1">Due: {job.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
