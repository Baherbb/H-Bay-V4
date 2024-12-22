import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, Heart, User, Bell } from "lucide-react";
import AnimatedLogo from "../../components/common/AnimatedLogo";
import Cart from "../../components/common/Cart";
import Wishlist from "../../components/common/WishList";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishListOpen, setIsWishListOpen] = useState(false);
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const isActiveLink = (href: string) => location.pathname === href;

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(!isCartOpen);
    setIsWishListOpen(false);
    setIsOpen(false);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const handleWishListClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishListOpen(!isWishListOpen);
    setIsCartOpen(false);
    setIsOpen(false);
  };

  const closeWishList = () => {
    setIsWishListOpen(false);
  };

  return (
    <>
      <div className="h-32"></div>

      <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32">
            {/* Logo */}
            <Link to="/home" className="flex-shrink-0 transition-transform duration-200 hover:scale-105">
              <AnimatedLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200 ${
                    isActiveLink(item.href)
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors duration-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={handleWishListClick} className="relative group">
                <Heart
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isWishListOpen ? "text-orange-500" : "text-gray-700 group-hover:text-orange-500"
                  }`}
                />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>

              <button onClick={handleCartClick} className="relative group">
                <ShoppingCart
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isCartOpen ? "text-orange-500" : "text-gray-700 group-hover:text-orange-500"
                  }`}
                />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
              

              {/* Notification Icon */}
              <button className="relative group">
                <Bell className="h-6 w-6 text-gray-700 hover:text-orange-500 transition-colors duration-200" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile Icon */}
              <Link
                to="/userlayout"
                className="relative group"
              >
                <User className="h-6 w-6 text-gray-700 hover:text-orange-500 transition-colors duration-200" />
                <span className="text-sm text-gray-600 group-hover:text-orange-500">Profile</span>
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
            isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
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
                      ? "bg-orange-500 text-white"
                      : "text-gray-800 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
