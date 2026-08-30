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
import Orders from "./pages/Orders";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Catalogue from "./pages/Catalogue";
import MarketingTeam from "./pages/MarketingTeam";
import GlobalLoadingBar from "./components/GlobalLoadingBar";
import { setCurrentUser, clearCurrentUser, getCurrentUser } from "./services/currentUser";
import { CartProvider } from "./services/cartContext";
import StorefrontLayout from "./components/StorefrontLayout";
import StoreHome from "./pages/StoreHome";
import StoreCatalogue from "./pages/StoreCatalogue";
import StoreAbout from "./pages/StoreAbout";
import StoreContact from "./pages/StoreContact";

export default function App() {
  // Auth state is restored from the persisted current user (localStorage)
  // on load, so a page refresh — or typing a route directly — keeps the
  // user logged in instead of bouncing them back to /login.
  const persistedUser = getCurrentUser();
  const [isLoggedIn, setIsLoggedIn] = useState(!!persistedUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(persistedUser);

  const homePathFor = (role) => (role === "client" ? "/store" : "/dashboard");

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentUser(userData); // lets api.js attach X-Username/X-User-Role headers
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    clearCurrentUser();
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      // Logged in but wrong role for this page — send them to their own home
      return <Navigate to={homePathFor(user?.role)} />;
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

  // Storefront pages (client role only) get the public-facing layout
  // (header nav + footer + cart drawer) instead of the admin sidebar.
  const ProtectedStorefrontRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    if (user?.role !== "client") {
      return <Navigate to={homePathFor(user?.role)} />;
    }
    return (
      <StorefrontLayout user={user} onLogout={handleLogout}>
        {children}
      </StorefrontLayout>
    );
  };

  return (
    <Router>
      <GlobalLoadingBar />
      <CartProvider>
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to={homePathFor(user?.role)} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'marketing']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogue"
            element={
              <ProtectedRoute allowedRoles={['admin', 'marketing']}>
                <Catalogue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogue/:brandName"
            element={
              <ProtectedRoute allowedRoles={['admin', 'marketing']}>
                <Catalogue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={['admin', 'marketing']}>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute allowedRoles={['admin', 'marketing']}>
                <Clients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['admin', 'marketing']}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute allowedRoles={['admin', 'marketing']}>
                <Billing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice-history"
            element={
              <ProtectedRoute allowedRoles={['admin', 'marketing']}>
                <InvoiceHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketing-team"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MarketingTeam />
              </ProtectedRoute>
            }
          />

          {/* Client storefront */}
          <Route
            path="/store"
            element={
              <ProtectedStorefrontRoute>
                <StoreHome />
              </ProtectedStorefrontRoute>
            }
          />
          <Route
            path="/store/catalogue"
            element={
              <ProtectedStorefrontRoute>
                <StoreCatalogue />
              </ProtectedStorefrontRoute>
            }
          />
          <Route
            path="/store/about"
            element={
              <ProtectedStorefrontRoute>
                <StoreAbout />
              </ProtectedStorefrontRoute>
            }
          />
          <Route
            path="/store/contact"
            element={
              <ProtectedStorefrontRoute>
                <StoreContact />
              </ProtectedStorefrontRoute>
            }
          />

          <Route
            path="/"
            element={<Navigate to={!isLoggedIn ? "/login" : homePathFor(user?.role)} />}
          />
          <Route
            path="*"
            element={<Navigate to={!isLoggedIn ? "/login" : homePathFor(user?.role)} />}
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}
