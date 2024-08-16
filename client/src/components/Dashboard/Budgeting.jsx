import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const Budgeting = () => {
  const [budget, setBudget] = useState({
    monthly: "",
    yearly: "",
  });
  const [expenses, setExpenses] = useState({
    monthly: 0,
    yearly: 0,
  });
  const [userId, setUserId] = useState(""); // Initially empty

  useEffect(() => {
    // Fetch user ID and budget data on component mount
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/me", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const data = await response.json();
        if (data.userId) {
          setUserId(data.userId); // Set userId from response
        } else {
          toast.error("User ID not found.");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        toast.error("Failed to fetch user ID.");
      }
    };

    if (!userId) {
      fetchUserId(); // Fetch user ID if it's not already set
    }
  }, [userId]);

  useEffect(() => {
    // Fetch budget and expenses data when userId is available
    const fetchBudgetAndExpenses = async () => {
      if (!userId) return; // Exit if userId is not set

      try {
        const budgetResponse = await fetch(
          `http://localhost:4000/api/v1/budget/${userId}`,
          {
            method: "GET",
            credentials: "include", // Ensure cookies are sent with the request
          }
        );

        if (!budgetResponse.ok) {
          throw new Error("Failed to fetch budget data.");
        }

        const budgetData = await budgetResponse.json();

        setBudget({
          monthly: budgetData.monthlyBudget || "",
          yearly: budgetData.yearlyBudget || "",
        });

        // Fetch expenses data if needed
        // const expensesResponse = await fetch(`/api/v1/expenses/${userId}`);
        // const expensesData = await expensesResponse.json();
        // setExpenses({
        //   monthly: expensesData.monthly || 0,
        //   yearly: expensesData.yearly || 0,
        // });
      } catch (error) {
        console.error("Error fetching budget data:", error);
        toast.error("Failed to fetch budget data.");
      }
    };

    fetchBudgetAndExpenses();
  }, [userId]);

  const handleBudgetChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleExpenseChange = (e) => {
    setExpenses({ ...expenses, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save monthly budget
      await fetch(`http://localhost:4000/api/v1/budget/monthly`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent with the request
        body: JSON.stringify({
          user: userId,
          monthlyBudget: parseFloat(budget.monthly),
          currency: "EUR", // Add a currency field if necessary
        }),
      });

      // Save yearly budget
      await fetch(`http://localhost:4000/api/v1/budget/yearly`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent with the request
        body: JSON.stringify({
          user: userId,
          yearlyBudget: parseFloat(budget.yearly),
          currency: "EUR", // Add a currency field if necessary
        }),
      });

      toast.success("Budget and expenses saved successfully");
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Failed to save budget.");
    }
  };

  const calculateRemaining = (limit, amount) => limit - amount;
  const monthlyAlert = calculateRemaining(budget.monthly, expenses.monthly) < 0;
  const yearlyAlert = calculateRemaining(budget.yearly, expenses.yearly) < 0;

  return (
    <>
      <Toaster />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Budgeting</h1>

        {/* Budget Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Set Your Budget</h2>

          <div className="mb-4">
            <label
              htmlFor="monthly"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Monthly Budget
            </label>
            <input
              type="number"
              name="monthly"
              id="monthly"
              value={budget.monthly}
              onChange={handleBudgetChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Enter monthly budget"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="yearly"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Yearly Budget
            </label>
            <input
              type="number"
              name="yearly"
              id="yearly"
              value={budget.yearly}
              onChange={handleBudgetChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Enter yearly budget"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5"
          >
            Save Budget
          </button>
        </form>

        {/* Expenses Form */}
        <form className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Track Your Expenses</h2>

          <div className="mb-4">
            <label
              htmlFor="monthly-expenses"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Monthly Expenses
            </label>
            <input
              type="number"
              name="monthly"
              id="monthly-expenses"
              value={expenses.monthly}
              onChange={handleExpenseChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Enter monthly expenses"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="yearly-expenses"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Yearly Expenses
            </label>
            <input
              type="number"
              name="yearly"
              id="yearly-expenses"
              value={expenses.yearly}
              onChange={handleExpenseChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Enter yearly expenses"
            />
          </div>
        </form>

        {/* Budget Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Budget Summary</h2>

          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Monthly Budget</h3>
              <p
                className={`text-lg ${
                  monthlyAlert ? "text-red-500" : "text-green-500"
                }`}
              >
                ${calculateRemaining(budget.monthly, expenses.monthly)}{" "}
                remaining
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Yearly Budget</h3>
              <p
                className={`text-lg ${
                  yearlyAlert ? "text-red-500" : "text-green-500"
                }`}
              >
                ${calculateRemaining(budget.yearly, expenses.yearly)} remaining
              </p>
            </div>
          </div>

          {monthlyAlert && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
              Warning: You are nearing your monthly budget limit!
            </div>
          )}
          {yearlyAlert && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md mt-2">
              Warning: You are nearing your yearly budget limit!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Budgeting;
