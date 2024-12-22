import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, Users, LogOut, Menu, Package, ChevronDown, ChevronUp } from "lucide-react";   
import AnimatedLogo from "../common/AnimatedLogo";
import { useAuth } from "../../contexts/AuthContext";
import { Permission } from "../../types/permissions";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const location = useLocation();
  const { hasPermission, logout } = useAuth();

  const links = [
    { 
      label: "Dashboard", 
      path: "/adminAuth/dashboard", 
      icon: <BarChart className="h-5 w-5 mr-2" />,
      permission: Permission.VIEW_DASHBOARD
    },
    { 
      label: "Admin", 
      path: "/adminAuth/makeadmin", 
      icon: <Users className="h-5 w-5 mr-2" />,
      permission: Permission.CREATE_ADMIN
    },
    { 
      label: "Employees", 
      path: "/adminAuth/employees", 
      icon: <Users className="h-5 w-5 mr-2" />,
      permission: Permission.VIEW_USERS
    },
  ];

  const productLinks = [
    { 
      label: "Products", 
      path: "/adminAuth/products",
      permission: Permission.VIEW_PRODUCTS
    },
    { 
      label: "Category", 
      path: "/adminAuth/category",
      permission: Permission.MANAGE_INVENTORY
    },
    { 
      label: "Brands", 
      path: "/adminAuth/products/brands",
      permission: Permission.MANAGE_INVENTORY
    },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  const filteredLinks = links.filter(link => 
    hasPermission([link.permission])
  );

  const filteredProductLinks = productLinks.filter(link => 
    hasPermission([link.permission])
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-orange-800 text-white p-2 rounded-md"
      >
        <Menu className="h-6 w-6" />
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-black text-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 w-64`}
      >
        <div className="p-4 flex items-center h-[10vh] justify-center border-b border-gray-700">
          <AnimatedLogo />
        </div>

        <nav className="mt-4">
          <ul className="space-y-2">
            {filteredLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center px-4 py-2 rounded-lg transition ${
                    isActive(link.path) ? "bg-orange-500 text-white" : "hover:bg-gray-700"
                  }`}
                  onClick={() => setIsOpen(false)} 
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}

            {filteredProductLinks.length > 0 && (
              <li className="relative">
                <button
                  onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}  
                  className={`flex items-center px-4 py-2 rounded-lg w-full transition hover:bg-gray-700`}
                >
                  <Package className="h-5 w-5 mr-2" />
                  Inventory
                  {isProductMenuOpen ? (
                    <ChevronUp className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  )}
                </button>

                {isProductMenuOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    {filteredProductLinks.map((productLink) => (
                      <Link
                        key={productLink.path}
                        to={productLink.path}
                        className={`flex items-center px-4 py-2 rounded-lg transition ${
                          isActive(productLink.path) ? "bg-orange-500 text-white" : "hover:bg-gray-700"
                        }`}
                        onClick={() => setIsOpen(false)}  
                      >
                        {productLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex items-center px-4 py-2 rounded-lg transition hover:bg-gray-700 w-full"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
export default Sidebar;