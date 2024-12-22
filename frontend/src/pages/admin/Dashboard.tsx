import React from "react";
import SummaryBox from "../../components/Admin/SummaryBox";
import PieChart from "../../components/Admin/PieChart";
import BarChart from "../../components/Admin/BarChart";
import { Users, BarChart as BarIcon } from "lucide-react";

/**
 * The Dashboard component for the admin panel.
 *
 * This component provides a summary of key metrics (e.g., total users, active users, revenue, etc.)
 * and visualizes data using pie and bar charts. It is structured with a grid layout for both
 * summary boxes and charts.
 *
 * @returns The `Dashboard` React component.
 */
const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryBox
          title="Total Users"
          value={350}
          icon={<Users className="text-orange-500 h-6 w-6" />}
          bgColor="bg-orange-100"
        />
        <SummaryBox
          title="Active Users"
          value={200}
          icon={<BarIcon className="text-green-500 h-6 w-6" />}
          bgColor="bg-green-100"
        />
        <SummaryBox
          title="Revenue"
          value={7500}
          icon={<BarIcon className="text-purple-500 h-6 w-6" />}
          bgColor="bg-purple-100"
        />
        <SummaryBox
          title="Top Selling"
          value={"Lenovo Legion 5"}
          icon={<BarIcon className="text-black-500 h-6 w-6" />}
          bgColor="bg-blue-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
          <PieChart />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
