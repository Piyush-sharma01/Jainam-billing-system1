import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GlobalLoadingBar from "./components/GlobalLoadingBar";
import { CartProvider } from "./services/cartContext";
import StorefrontLayout from "./components/StorefrontLayout";
import StoreHome from "./pages/StoreHome";
import StoreCatalogue from "./pages/StoreCatalogue";
import StoreAbout from "./pages/StoreAbout";
import StoreContact from "./pages/StoreContact";
import StoreProduct from "./pages/StoreProduct";

// Public client storefront only — no login anywhere in this app. Admin /
// marketing login lives in the separate billing-admin app at its own URL.
export default function App() {
  return (
    <Router>
      <GlobalLoadingBar />
      <CartProvider>
        <Routes>
          <Route
            path="/store"
            element={
              <StorefrontLayout>
                <StoreHome />
              </StorefrontLayout>
            }
          />
          <Route
            path="/store/catalogue"
            element={
              <StorefrontLayout>
                <StoreCatalogue />
              </StorefrontLayout>
            }
          />
          <Route
            path="/store/about"
            element={
              <StorefrontLayout>
                <StoreAbout />
              </StorefrontLayout>
            }
          />
          <Route
            path="/store/contact"
            element={
              <StorefrontLayout>
                <StoreContact />
              </StorefrontLayout>
            }
          />
          <Route
            path="/store/product/:id"
            element={
              <StorefrontLayout>
                <StoreProduct />
              </StorefrontLayout>
            }
          />

          <Route path="/" element={<Navigate to="/store" />} />
          <Route path="*" element={<Navigate to="/store" />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}