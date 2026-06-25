import { Routes, Route } from "react-router-dom";

import FarmFreshDairyWebsite from "./Pages/FarmFreshDairyWebsite";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Auth from "./Pages/Auth";
import Subscription from "./Pages/Subscription";
import SubscriptionCheckout from "./Pages/SubscriptionCheckout";
import CustomerDashboard from "./Pages/CustomerDashboard";
import OrderHistory from "./Pages/OrderHistory";
import TrackOrder from "./Pages/TrackOrder";

import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Routes>
        <Route path="/" element={<FarmFreshDairyWebsite />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscription-checkout"
          element={
            <ProtectedRoute>
              <SubscriptionCheckout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-history"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-order"
          element={
            <ProtectedRoute>
              <TrackOrder />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}