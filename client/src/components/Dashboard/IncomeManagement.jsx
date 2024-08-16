import { useState, useEffect } from "react";

const categories = ["Salary", "Freelance", "Investments", "Gifts", "Others"];

const IncomeManagement = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    source: "",
    amount: "",
    category: categories[0],
    date: "",
    description: "",
  });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetch("/api/v1/income/all", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch incomes");
        }

        const data = await response.json();
        setIncomes(data);
        setFilteredIncomes(data); // Initially, show all incomes
      } catch (error) {
        console.error("Error fetching incomes:", error);
      }
    };

    fetchIncomes();
  }, []);

  useEffect(() => {
    filterIncomes();
  }, [selectedMonth, selectedYear, incomes]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const filterIncomes = () => {
    let filtered = incomes;

    if (selectedMonth) {
      filtered = filtered.filter(
        (income) =>
          new Date(income.date).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (income) =>
          new Date(income.date).getFullYear() === parseInt(selectedYear)
      );
    }

    setFilteredIncomes(filtered);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
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
      const url = form.id ? `/api/v1/income/${form.id}` : "/api/v1/income";
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
        throw new Error("Failed to save income");
      }

      const data = await response.json();

      if (form.id) {
        setIncomes(
          incomes.map((income) =>
            income._id === form.id ? { ...data, _id: form.id } : income
          )
        );
      } else {
        setIncomes([...incomes, data]);
      }

      setForm({
        id: null,
        source: "",
        amount: "",
        category: categories[0],
        date: "",
        description: "",
      });
    } catch (error) {
      console.error("Error saving income:", error);
    }
  };

  const handleEdit = (income) => {
    setForm({
      id: income._id,
      source: income.source,
      amount: income.amount,
      category: income.category,
      date: income.date,
      description: income.description,
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/v1/income/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete income");
      }

      setIncomes(incomes.filter((income) => income._id !== id));
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Income Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {form.id ? "Edit Income" : "Add New Income"}
        </h2>
        <div className="mb-4">
          <label
            htmlFor="source"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Income Source
          </label>
          <input
            type="text"
            name="source"
            id="source"
            value={form.source}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="Enter income source"
            required
          />
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
          {form.id ? "Update Income" : "Add Income"}
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
                incomes.map((income) => new Date(income.date).getFullYear())
              ),
            ].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Income List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Income List</h2>
        {filteredIncomes.length > 0 ? (
          <ul>
            {filteredIncomes.map((income) => (
              <li
                key={income._id}
                className="flex items-center justify-between py-2 px-4 border-b border-gray-200"
              >
                <div>
                  <h3 className="text-lg font-medium">{income.description}</h3>
                  <p className="text-sm text-gray-600">
                    {income.category} |{" "}
                    {new Date(income.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-lg font-medium">${income.amount}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(income)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(income._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No incomes for this period.</p>
        )}
      </div>
    </div>
  );
};

export default IncomeManagement;
