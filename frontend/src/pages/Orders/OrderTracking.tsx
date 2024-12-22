import React, { useState } from "react";

const FullPage: React.FC = () => {
  const [progress, setProgress] = useState(50); // Progress value between 0 to 100

  // Steps for the progress tracker
  const steps = [
    { id: 1, label: "Order Confirmed", icon: "✔" },
    { id: 2, label: "Picked by Courier", icon: "📦" },
    { id: 3, label: "On the Way", icon: "🚚" },
    { id: 4, label: "Ready for Pickup", icon: "🏠" },
  ];

  /**
   * Determines the step status dynamically based on progress.
   * @param index - Step index in the steps array.
   * @returns "complete" or "pending"
   */
  const getStepStatus = (index: number) => {
    const stepPosition = (index / (steps.length - 1)) * 100;
    if (progress >= stepPosition) return "complete";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Page Container */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8 mt-10">
        {/* Page Title */}
        <h1 className="text-3xl font-extrabold text-orange-600 text-center mb-6">
          My Orders / Tracking
        </h1>

        {/* Order Details */}
        <div className="bg-gray-100 border rounded-lg p-6 mb-8">
          <div className="flex justify-between flex-wrap text-gray-700 text-lg">
            <p>
              <strong>Order ID:</strong>{" "}
              <span className="text-gray-900">OD45345345435</span>
            </p>
            <p>
              <strong>Estimated Delivery:</strong>{" "}
              <span className="text-gray-900">29 Nov 2019</span>
            </p>
            <p>
              <strong>Shipping BY:</strong>{" "}
              <span className="text-gray-900">BLUEDART</span> | 📞{" "}
              <span className="text-gray-900">+1-598675986</span>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-orange-500 font-bold">
                {steps[Math.floor((progress / 100) * (steps.length - 1))].label}
              </span>
            </p>
            <p>
              <strong>Tracking #:</strong>{" "}
              <span className="text-gray-900">BD045903594059</span>
            </p>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="relative w-full mb-10">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-2 bg-gray-300 z-0">
            {/* Active Progress */}
            <div
              className="h-2 bg-orange-500"
              style={{ width: `${progress}%, transition: "width 0.5s ease" ` }}
            ></div>
          </div>

          {/* Steps */}
          <div className="flex justify-between items-center relative z-10">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-300 ${
                      status === "complete"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      status === "complete"
                        ? "text-orange-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300">
            <img
              src="https://th.bing.com/th/id/OIP.Ix_6uKEOAmsXnhDbhqIadQHaHa?rs=1&pid=ImgDetMain"
              alt="Dell Laptop"
              className="w-24 h-24 mx-auto mb-4"
            />
            <p className="text-center font-semibold">
              Dell Laptop with 500GB HDD
            </p>
            <p className="text-center text-gray-600">$950</p>
          </div>
          <div className="bg-white border rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300">
            <img
              src="https://th.bing.com/th/id/OIP.Ix_6uKEOAmsXnhDbhqIadQHaHa?rs=1&pid=ImgDetMain"
              alt="HP Laptop"
              className="w-24 h-24 mx-auto mb-4"
            />
            <p className="text-center font-semibold">
              HP Laptop with 500GB HDD
            </p>
            <p className="text-center text-gray-600">$850</p>
          </div>
          <div className="bg-white border rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300">
            <img
              src="https://th.bing.com/th/id/OIP.Ix_6uKEOAmsXnhDbhqIadQHaHa?rs=1&pid=ImgDetMain"
              alt="Acer Laptop"
              className="w-24 h-24 mx-auto mb-4"
            />
            <p className="text-center font-semibold">
              ACER Laptop with 500GB HDD
            </p>
            <p className="text-center text-gray-600">$650</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPage;
