import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ResetPassword from "./components/Auth/ResetPassword";
import Navbar from "./components/Navigation/Navbar";
import FinancialSummary from "./components/Dashboard/FinancialSummary";
import ExpenseManagement from "./components/Dashboard/ExpenseManagement";
import IncomeManagement from "./components/Dashboard/IncomeManagement";
import Budgeting from "./components/Dashboard/Budgeting";
import GenerateReport from "./components/Reports/GenerateReport";
import ExportReport from "./components/Reports/ExportReport";
import Dashboard from "./components/Dashboard/Dashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="finance" element={<FinancialSummary />} />
            <Route path="expenses" element={<ExpenseManagement />} />
            <Route path="income" element={<IncomeManagement />} />
            <Route path="budgeting" element={<Budgeting />} />
            <Route path="report/generate" element={<GenerateReport />} />
            <Route path="report/export" element={<ExportReport />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
