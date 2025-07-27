import { FaHome, FaUserPlus, FaInfoCircle, FaUserCircle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';



function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login state from localStorage (adjust key as per your auth logic)
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.reload();
  };





  return (
    <nav className="bg-white border-b border-gray-200 shadow-lg sticky top-0 z-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        {/* ... (rest of your existing navbar code) ... */}
        <div className="flex items-center">
          <span className="text-orange-500 mr-2 text-2xl">🍛</span>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">StreetSupply</span>
        </div>
        <div className="flex items-center md:hidden">

          <button 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => setMenuOpen(!menuOpen)} 
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div className={`flex-col md:flex-row md:flex items-center gap-6 md:gap-8 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none transition-all duration-300 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg">
            <FaHome /> <span data-translate="true">Home</span>
          </Link>
          <Link to="/about" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg">
            <FaInfoCircle /> <span data-translate="true">About</span>
          </Link>

          {/* Profile Link */}
          <Link to="/Profile" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg">
            <FaUserCircle className="text-2xl" /> <span data-translate="true">Profile</span>
          </Link>

          <button className="ml-0 md:ml-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto mt-2 md:mt-0">
            <span data-translate="true">+ New Request</span>
          </button>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg ml-2"
            >
              <span data-translate="true">Logout</span>
            </button>
          ) : (
            <Link to="/authpage" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg ml-2">
              <FaUserPlus /> <span data-translate="true">Signup</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;