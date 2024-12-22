import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import Navbar from "../../components/Admin/Navbar";
import Employees from "./Employees";
import Products from "./Products";
import Dashboard from "./Dashboard";
import Admin from "./MakeAdmin";
import Category from "./Category";
import PermissionRoute from "../../components/PermessionRoute";
import { Permission } from "../../types/permissions";

const WelcomePage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white shadow-lg rounded-xl p-10 max-w-3xl text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Welcome to Your Admin Page
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Manage your dashboard, employees, and products effortlessly. Use the
        sidebar to navigate and access all the features.
      </p>
    </div>
  </div>
);

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Navbar />
        
        <main className="p-6">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            
            <Route 
              path="/dashboard" 
              element={
                <PermissionRoute requiredPermissions={[Permission.VIEW_DASHBOARD]}>
                  <Dashboard />
                </PermissionRoute>
              } 
            />
            
            <Route 
              path="/employees" 
              element={
                <PermissionRoute requiredPermissions={[Permission.VIEW_USERS]}>
                  <Employees />
                </PermissionRoute>
              } 
            />
            
            <Route 
              path="/products" 
              element={
                <PermissionRoute requiredPermissions={[Permission.VIEW_PRODUCTS]}>
                  <Products />
                </PermissionRoute>
              } 
            />
            
            <Route 
              path="/makeadmin" 
              element={
                <PermissionRoute requiredPermissions={[Permission.CREATE_ADMIN]}>
                  <Admin />
                </PermissionRoute>
              } 
            />
            
            <Route 
              path="/category" 
              element={
                <PermissionRoute requiredPermissions={[Permission.MANAGE_INVENTORY]}>
                  <Category />
                </PermissionRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;