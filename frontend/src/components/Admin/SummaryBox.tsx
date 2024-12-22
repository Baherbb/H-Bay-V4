import React from "react";

interface SummaryBoxProps {
  title: string;
  value: number|string;
  icon?: React.ReactNode; // Optional icon
  bgColor?: string; // Optional background color
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ title, value, icon, bgColor }) => {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow-md ${bgColor || "bg-white"}`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mr-4">
        {icon}
      </div>
      <div>
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default SummaryBox;
