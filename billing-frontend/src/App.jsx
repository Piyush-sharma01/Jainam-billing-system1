import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import Billing from "./pages/Billing";
import InvoiceHistory from "./pages/InvoiceHistory";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Catalogue from "./pages/Catalogue";
import GlobalLoadingBar from "./components/GlobalLoadingBar";

export default function App() {
  // Auth state is intentionally NOT restored from localStorage on load —
  // this means every fresh page load or reload always starts at /login,
  // even if someone was logged in before or types /dashboard directly.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      // Logged in but wrong role for this page — send them to their own home
      return <Navigate to={user?.role === 'client' ? '/catalogue' : '/dashboard'} />;
    }
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          role={user?.role}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            user={user}
            onLogout={handleLogout}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <GlobalLoadingBar />
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={user?.role === 'client' ? '/catalogue' : '/dashboard'} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalogue"
          element={
            <ProtectedRoute allowedRoles={['admin', 'client']}>
              <Catalogue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalogue/:brandName"
          element={
            <ProtectedRoute allowedRoles={['admin', 'client']}>
              <Catalogue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice-history"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <InvoiceHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate
              to={
                !isLoggedIn
                  ? "/login"
                  : user?.role === "client"
                    ? "/catalogue"
                    : "/dashboard"
              }
            />
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={
                !isLoggedIn
                  ? "/login"
                  : user?.role === "client"
                    ? "/catalogue"
                    : "/dashboard"
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}
