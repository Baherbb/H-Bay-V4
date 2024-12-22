import React, { useState } from "react";

const Order: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center px-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 border-t-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-500 mb-6 text-center">
           Confirm Your Order Detailes
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Fields */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
 
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition duration-300"
            >
              Submit Order Info
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Order;