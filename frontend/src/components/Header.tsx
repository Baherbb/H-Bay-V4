import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaSearch, FaUser } from 'react-icons/fa';
import HeaderTop from './HeaderTop';
import AnimatedLogo from './AnimatedLogo';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header>
      <HeaderTop />
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-4">
            <Link to="/" className="h-24">
              <AnimatedLogo />
            </Link>

            <form onSubmit={handleSearch} className="flex w-full md:w-1/2 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Type here"
                className="w-full px-4 py-2 rounded-l-md focus:outline-none border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-r-md">
                <FaSearch />
              </button>
            </form>

            <div className="flex space-x-4 items-center">
              <Link to="/wishlist" className="text-black-600 relative">
                <FaHeart size={24} />
                <span className="absolute -top-2 -right-2 bg-blue-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
              </Link>
              <Link to="/cart" className="text-black-600 relative">
                <FaShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-blue-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
              </Link>
              <div className="relative group">
                <button className="text-black-600">
                  <FaUser size={24} />
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-black rounded-md shadow-lg py-2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">                  <Link to="/login" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                    <div className="bg-white text-black rounded-full py-1 px-4 text-center">
                      LOG IN
                    </div>
                  </Link>
                  <Link to="/signup" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                    <div className="border border-white rounded-full py-1 px-4 text-center">
                      SIGN UP
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;