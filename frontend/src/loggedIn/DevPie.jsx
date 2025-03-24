import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

const PieChartCard = ({ data, title }) => {
  if (!data || data.length !== 3) {
    return (
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{title || "Task Status"}</h2>
        <p className="text-gray-500">
          Invalid data. Please provide three data points.
        </p>
      </div>
    );
  }

  const total = data.reduce((acc, val) => acc + val, 0);
  const percentages = data.map((val) =>
    total === 0 ? 0 : ((val / total) * 100).toFixed(1)
  );

  const chartData = {
    labels: ["Applied", "Ongoing", "Completed"],
    datasets: [
      {
        data: percentages,
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets[0].data.map((value, i) => ({
              text: `${chart.data.labels[i]}: ${value}%`,
              fillStyle: datasets[0].backgroundColor[i],
              strokeStyle: datasets[0].backgroundColor[i],
              lineWidth: 1,
              hidden: false,
              index: i,
            }));
          },
        },
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
  };
  return (
    <div className="p-6 bg-white rounded-lg">
      <div w-full>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default PieChartCard;
