import { Link } from "react-router-dom";
import {
  FaDollarSign,
  FaMoneyBillWave,
  FaChartLine,
  FaRegCalendarAlt,
  FaFileDownload,
  FaFileExport,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard/finance"
                className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
              >
                <FaDollarSign className="mr-3" /> Financial Summary
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/income"
                className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
              >
                <FaMoneyBillWave className="mr-3" /> Income Management
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/expenses"
                className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
              >
                <FaChartLine className="mr-3" /> Expense Management
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/budgeting"
                className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
              >
                <FaRegCalendarAlt className="mr-3" /> Budgeting
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/report/generate"
                className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
              >
                <FaFileDownload className="mr-3" /> Generate Report
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/report/export"
                className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
              >
                <FaFileExport className="mr-3" /> Export Report
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
