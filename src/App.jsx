import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/pages/SignUp";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Profile from "./components/pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "./components/pages/ForgotPassword";
import "./components/styles/auth.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
<Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
