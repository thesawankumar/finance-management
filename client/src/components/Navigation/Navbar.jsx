import { useState } from "react";
import { FaDollarSign, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import profile from "../../images/profile.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    document.cookie = "token=; path=/;";
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/;";
    logout();
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full">
            <FaDollarSign size={20} />
          </div>
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            FinanceCo
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                Logout
              </button>
              {user && (
                <Link to="/profile">
                  <img
                    src={profile}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </Link>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <a href="/login">
                <button
                  type="button"
                  className="hidden md:inline-block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Login
                </button>
              </a>
              <a href="/signup">
                <button
                  type="button"
                  className="hidden md:inline-block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Signup
                </button>
              </a>
            </div>
          )}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isOpen ? "block" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to={isLoggedIn ? "/dashboard" : "/"}
                className="block py-2 px-3 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                {isLoggedIn ? "Dashboard" : "Home"}
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/income"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Income
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/expenses"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Expense
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/budgeting"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Budgeting
              </Link>
            </li>
            <li className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Reports
                {dropdownOpen ? (
                  <FaChevronUp className="ml-2" />
                ) : (
                  <FaChevronDown className="ml-2" />
                )}
              </button>
              {dropdownOpen && (
                <ul className="absolute mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg">
                  <li>
                    <Link
                      to="/dashboard/report/generate"
                      className="block py-2 px-4 hover:bg-gray-600"
                    >
                      Generate Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/report/export"
                      className="block py-2 px-4 hover:bg-gray-600"
                    >
                      Export Report
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
