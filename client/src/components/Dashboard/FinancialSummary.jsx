import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FinancialSummary = () => {
  const [data, setData] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await fetch("/api/v1/income/total", {
          method: "GET",
          credentials: "include",
        });
        if (!incomeResponse.ok) throw new Error("Failed to fetch income data");
        const totalIncome = (await incomeResponse.json()) || 0;

        const expenseResponse = await fetch("/api/v1/expense/all", {
          method: "GET",
          credentials: "include",
        });
        if (!expenseResponse.ok)
          throw new Error("Failed to fetch expense data");
        const expenses = await expenseResponse.json();
        const totalExpenses = expenses.reduce(
          (acc, curr) => acc + curr.amount,
          0
        );

        const totalSavings = totalIncome - totalExpenses;

        setData({
          income: totalIncome,
          expenses: totalExpenses,
          savings: totalSavings,
        });
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchData();
  }, []);

  // Data for Bar Chart
  const barData = {
    labels: ["Income", "Expenses", "Savings"], // Added "Expenses"
    datasets: [
      {
        label: "Financial Overview",
        data: [data.income, data.expenses, data.savings], // Added data.expenses
        backgroundColor: ["#4BC0C0", "#FF6384", "#36A2EB"],
        borderColor: ["#4BC0C0", "#FF6384", "#36A2EB"],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Financial Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Summary</h1>

      {/* Summary Information */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Income</h3>
            <p className="text-2xl font-bold">${data.income}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Expenses</h3>
            <p className="text-2xl font-bold">${data.expenses}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Savings</h3>
            <p className="text-2xl font-bold">${data.savings}</p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Income vs Expenses vs Savings
        </h2>
        <div className="h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
