
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import GlobalLoadingBar from "./components/GlobalLoadingBar";
import SEO from "./components/SEO";

import { CartProvider } from "./services/cartContext";
import StorefrontLayout from "./components/StorefrontLayout";

import StoreHome from "./pages/StoreHome";
import StoreCatalogue from "./pages/StoreCatalogue";
import StoreAbout from "./pages/StoreAbout";
import StoreContact from "./pages/StoreContact";
import StoreProduct from "./pages/StoreProduct";
import StoreNewArrivals from "./pages/StoreNewArrivals";

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
                <>
                  <SEO
                    title="Jainam Automotive | Automotive Products"
                    description="Explore automotive products and browse the latest catalogue at Jainam Automotive."
                    path="/store"
                  />
                  <StoreHome />
                </>
              </StorefrontLayout>
            }
          />

          <Route
            path="/store/catalogue"
            element={
              <StorefrontLayout>
                <>
                  <SEO
                    title="Automotive Products Catalogue | Jainam Automotive"
                    description="Browse the automotive product catalogue at Jainam Automotive and explore available products."
                    path="/store/catalogue"
                  />
                  <StoreCatalogue />
                </>
              </StorefrontLayout>
            }
          />

          <Route
            path="/store/new"
            element={
              <StorefrontLayout>
                <>
                  <SEO
                    title="New Arrivals | Jainam Automotive"
                    description="Discover the latest automotive product arrivals at Jainam Automotive."
                    path="/store/new"
                  />
                  <StoreNewArrivals />
                </>
              </StorefrontLayout>
            }
          />

          <Route
            path="/store/about"
            element={
              <StorefrontLayout>
                <>
                  <SEO
                    title="About Jainam Automotive | Our Business"
                    description="Learn more about Jainam Automotive, our business and our automotive product offerings."
                    path="/store/about"
                  />
                  <StoreAbout />
                </>
              </StorefrontLayout>
            }
          />

          <Route
            path="/store/contact"
            element={
              <StorefrontLayout>
                <>
                  <SEO
                    title="Contact Jainam Automotive | Get in Touch"
                    description="Contact Jainam Automotive for product enquiries and business information."
                    path="/store/contact"
                  />
                  <StoreContact />
                </>
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

          <Route
            path="/"
            element={<Navigate to="/store" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/store" replace />}
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}
