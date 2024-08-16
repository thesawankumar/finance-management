import { useState } from "react";

const ExportReport = () => {
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExport = async () => {
    setLoading(true);
    setError("");

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/v1/report/export?format=${format}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Export Report</h1>

      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="format"
        >
          Select Export Format
        </label>
        <select
          id="format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="pdf">PDF</option>
          <option value="csv">CSV</option>
        </select>
      </div>

      <button
        onClick={handleExport}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        {loading ? "Exporting..." : "Export Report"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ExportReport;
