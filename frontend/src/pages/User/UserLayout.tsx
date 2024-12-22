import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./UserSidebar";
import UserProfile from "./UserProfile";
import AccountSettings from "./AccountSettings";
import UserSupport from "./UserSupport";
// import Header from "./UserNav";
import OrderHistory from "./OrderHistory";
import Header from "../../components/common/Header";
const UserLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
    {/* Header */}
    {<Header />}
  
    {/* Main Content Area */}
    <div className="flex flex-1 pt-16">
      {/* Sidebar */}
      <Sidebar />
  
      {/* Main Content */}
      <div className="flex-1 bg-white p-4">
        <Routes>
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/accountsettings" element={<AccountSettings />} />
          <Route path="/orders" element={<OrderHistory/>} />
          <Route path="/wishlist" element={<div>Wishlist Page</div>} />
          <Route path="/support" element={<UserSupport />} />
        </Routes>
      </div>
    </div>
  </div>
  );
};

export default UserLayout;
