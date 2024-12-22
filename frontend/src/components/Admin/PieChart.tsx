import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ["Active Users", "Inactive Users", "Pending Users"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div style={{ width: "300px", height: "300px" }}> {/* Container with fixed size */}
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
