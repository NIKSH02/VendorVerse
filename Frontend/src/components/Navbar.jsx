import { FaHome, FaUserPlus, FaInfoCircle, FaUserCircle } from "react-icons/fa";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // The AuthContext will handle clearing tokens and state
      window.location.reload(); // Optional: refresh to update UI
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  let navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-lg sticky top-0 z-20 transition-all duration-300 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        {/* ... (rest of your existing navbar code) ... */}
        <div className="flex items-center">
          <span className="text-orange-500 mr-2 text-2xl">🍛</span>
          <a
            className="text-2xl font-bold text-gray-900 tracking-tight"
            href="/"
          >
            StreetSupply
          </a>
        </div>
        <div className="flex items-center md:hidden">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div
          className={`flex-col md:flex-row md:flex items-center gap-6 md:gap-8 absolute md:static top-16 left-0 right-0 w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none transition-all duration-300 z-10 px-4 md:px-0 ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg"
          >
            <FaHome /> <span data-translate="true">Home</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg"
          >
            <FaInfoCircle /> <span data-translate="true">About</span>
          </Link>

          {/* Profile Link */}
          <Link
            to="/Profile"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg"
          >
            <FaUserCircle className="text-2xl" />{" "}
            <span data-translate="true">Profile</span>
          </Link>

          <button
            onClick={() => navigate("/locationchat")}
            className="ml-0 md:ml-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto mt-2 md:mt-0"
          >
            <span data-translate="true">+ New Request</span>
          </button>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium transition-colors px-4 py-3 md:px-4 md:py-2 rounded-lg ml-2 shadow-md hover:shadow-lg"
            >
              <span data-translate="true">Logout</span>
            </button>
          ) : (
            <Link
              to="/authpage"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg ml-2"
            >
              <FaUserPlus /> <span data-translate="true">Signup</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
