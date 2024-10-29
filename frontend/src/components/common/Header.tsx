import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, Heart, User } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import Cart from './Cart';
import WishList from './WishList';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/home' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishListOpen, setIsWishListOpen] = useState(false);
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  // Handle cart toggling
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(!isCartOpen);
    setIsWishListOpen(false);
    setIsOpen(false);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Handle wishlist toggling
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
            {/* Logo - Increased size */}
            <Link to="home" className="flex-shrink-0 transition-transform duration-200 hover:scale-105">
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
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
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
              <button
                onClick={handleWishListClick}
                className="relative group"
              >
                <Heart className={`h-6 w-6 transition-colors duration-200 ${
                  isWishListOpen ? 'text-orange-500' : 'text-gray-700 group-hover:text-orange-500'
                }`} />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
              
              <button
                onClick={handleCartClick}
                className="relative group"
              >
                <ShoppingCart className={`h-6 w-6 transition-colors duration-200 ${
                  isCartOpen ? 'text-orange-500' : 'text-gray-700 group-hover:text-orange-500'
                }`} />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-orange-500/30 transition-all duration-200 space-x-2"
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden transform transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden bg-white shadow-lg`}
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="pb-3">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

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

            {/* Mobile Wishlist and Cart */}
            <div className="flex justify-around py-4 border-t border-b border-gray-200">
              <button 
                onClick={handleWishListClick}
                className="flex flex-col items-center space-y-1 relative"
              >
                <Heart className={`h-6 w-6 ${isWishListOpen ? 'text-orange-500' : 'text-gray-700'}`} />
                <span className="text-sm text-gray-600">Wishlist</span>
                <span className="absolute -top-2 right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
              
              <button 
                onClick={handleCartClick}
                className="flex flex-col items-center space-y-1 relative"
              >
                <ShoppingCart className={`h-6 w-6 ${isCartOpen ? 'text-orange-500' : 'text-gray-700'}`} />
                <span className="text-sm text-gray-600">Cart</span>
                <span className="absolute -top-2 right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>

            {/* Mobile Auth Button */}
            <div className="pt-2">
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-6 py-3 text-center rounded-lg text-white bg-orange-500 hover:bg-orange-600 shadow-md transition-all duration-200 space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeCart} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md">
            <Cart onClose={closeCart} />
          </div>
        </div>
      )}

      {/* WishList Overlay */}
      {isWishListOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeWishList} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md">
            <WishList onClose={closeWishList} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;