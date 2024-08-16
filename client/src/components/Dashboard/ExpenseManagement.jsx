import { useState, useEffect } from "react";

const categories = [
  "Rent",
  "Utilities",
  "Groceries",
  "Entertainment",
  "Others",
];

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [form, setForm] = useState({
    id: null,
    category: categories[0],
    amount: "",
    date: "",
    description: "",
  });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [selectedMonth, selectedYear, expenses]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/v1/expense/all", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setExpenses(data);
      setFilteredExpenses(data); // Initialize filtered expenses with all data
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const filterExpenses = () => {
    let filtered = expenses;

    if (selectedMonth) {
      filtered = filtered.filter(
        (expense) =>
          new Date(expense.date).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (expense) =>
          new Date(expense.date).getFullYear() === parseInt(selectedYear)
      );
    }

    setFilteredExpenses(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      category: form.category,
      amount: form.amount,
      date: form.date,
      currency: "USD",
      description: form.description,
    };

    try {
      const url = form.id ? `/api/v1/expense/${form.id}` : "/api/v1/expense";
      const method = form.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to save expense");
      }

      const data = await response.json();

      if (form.id) {
        setExpenses(
          expenses.map((expense) =>
            expense._id === form.id ? { ...data, _id: form.id } : expense
          )
        );
      } else {
        setExpenses([...expenses, data]);
      }

      setForm({
        id: null,
        category: categories[0],
        amount: "",
        date: "",
        description: "",
      });
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      id: expense._id,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      description: expense.description,
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/v1/expense/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {form.id ? "Edit Expense" : "Add New Expense"}
        </h2>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            value={form.category}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={form.amount}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="Enter amount"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={form.date}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="Enter description"
            rows="3"
          />
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5"
        >
          {form.id ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        <div>
          <label
            htmlFor="month"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter by Month
          </label>
          <select
            name="month"
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter by Year
          </label>
          <select
            name="year"
            id="year"
            value={selectedYear}
            onChange={handleYearChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          >
            <option value="">All Years</option>
            {[
              ...new Set(
                expenses.map((expense) => new Date(expense.date).getFullYear())
              ),
            ].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Expense List</h2>
        {filteredExpenses.length > 0 ? (
          <ul>
            {filteredExpenses.map((expense) => (
              <li
                key={expense._id}
                className="flex items-center justify-between py-2 px-4 border-b border-gray-200"
              >
                <div>
                  <h3 className="text-lg font-medium">{expense.description}</h3>
                  <p className="text-sm text-gray-600">
                    {expense.category} |{" "}
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-lg font-medium">${expense.amount}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses for this period.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseManagement;
