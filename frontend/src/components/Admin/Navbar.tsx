import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Settings, User, Search, Bell } from 'lucide-react';
// import AnimatedLogo from '../common/AnimatedLogo';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Settings', href: '/admin/settings' },
];

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const location = useLocation();

  const isActiveLink = (href: string) => location.pathname === href;

  return (
    <>
      <div className="h-16"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">


            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={(e) => e.preventDefault()} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors duration-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Notification Icon */}
              <button className="relative group">
                <Bell className="h-6 w-6 text-gray-700 hover:text-orange-500 transition-colors duration-200" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile */}
              <Link
                to="/admin/profile"
                className="flex flex-col items-center space-y-1 relative group"
              >
                <User className="h-6 w-6 text-gray-700 group-hover:text-orange-500 transition-colors duration-200" />
                <span className="text-sm text-gray-600">Profile</span>
              </Link>

              {/* Settings */}
              <Link
                to="/admin/settings"
                className="flex flex-col items-center space-y-1 relative group"
              >
                <Settings className="h-6 w-6 text-gray-700 group-hover:text-orange-500 transition-colors duration-200" />
                <span className="text-sm text-gray-600">Settings</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transform transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[20rem] opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden bg-white shadow-lg`}
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isActiveLink(item.href)
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-800 hover:bg-orange-50 hover:text-orange-500'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="flex justify-around py-4 border-t border-b border-gray-200">
              {/* Notifications */}
              <button
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center space-y-1"
              >
                <Bell className="h-6 w-6 text-gray-700" />
                <span className="text-sm text-gray-600">Notifications</span>
              </button>

              {/* Profile */}
              <Link
                to="/admin/profile"
                className="flex flex-col items-center space-y-1"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-6 w-6 text-gray-700" />
                <span className="text-sm text-gray-600">Profile</span>
              </Link>

              {/* Settings */}
              <Link
                to="/admin/settings"
                className="flex flex-col items-center space-y-1"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-6 w-6 text-gray-700" />
                <span className="text-sm text-gray-600">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
