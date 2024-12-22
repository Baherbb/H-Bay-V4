import React, { useState } from "react";
import { FaUser, FaCog, FaHistory, FaHeart, FaPhoneAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("User Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    { label: "User Profile", path: "/userlayout/userprofile", icon: <FaUser /> },
    { label: "Account Settings", path: "/userlayout/accountsettings", icon: <FaCog /> },
    { label: "Order History", path: "/userlayout/orders", icon: <FaHistory /> },
    { label: "Wishlist", path: "/userlayout/wishlist", icon: <FaHeart /> },
    { label: "Support", path: "/userlayout/support", icon: <FaPhoneAlt /> },
  ];

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/");
  };

  return (
    <>
      {/* Sidebar Toggle for Small Screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800   text-white p-3 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
            className={`fixed lg:top-0 top-[6rem] left-0 bottom-0 w-64 bg-gray-800 -mt-48 text-white z-40 transition-transform transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 lg:relative lg:h-auto`}
          >
        <div className="flex flex-col h-full">
          {/* Branding */}
          <div className="p-6 bg-gray-900 mt-32">
            <h2 className="text-2xl font-bold text-center">My Account</h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setActiveTab(link.label);
                  navigate(link.path);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-300 ${
                  activeTab === link.label ? "bg-orange-500" : "hover:bg-gray-700"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4">
            <button
              className="flex items-center w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-3" /> Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for Small Screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
