import { Routes, Route } from "react-router-dom";

import FarmFreshDairyWebsite from "./Pages/FarmFreshDairyWebsite";
import Subscription from "./Pages/Subscription";
import TrackOrder from "./Pages/TrackOrder";
import DeliveryManagement from "./Pages/DeliveryManagement";
import CustomerDashboard from "./Pages/CustomerDashboard";
import Auth from "./Pages/Auth";
import DeliveryBoy from "./Pages/DeliveryBoy";
import DeliveryLogin from "./Pages/DeliveryLogin";
import SubscriptionCheckout from "./Pages/SubscriptionCheckout";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderHistory from "./Pages/OrderHistory";

import ProtectedRoute from "./Components/ProtectedRoute";
import Navbar from "./Components/Navbar";
import MobileBottomNav from "./Components/MobileBottomNav";

// Admin
import AdminProducts from "./Pages/AdminProducts";
import AdminCustomers from "./Pages/AdminCustomers";
import AdminBilling from "./Pages/AdminBilling";
import AdminSubscriptions from "./Pages/AdminSubscriptions";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import AdminDeliveryReport from "./Pages/AdminDeliveryReport";

// Delivery protected route
import DeliveryProtectedRoute from "./Components/DeliveryProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* bottom padding for mobile bottom nav */}
      <div className="pb-20 lg:pb-0">
        <Routes>
          {/* Public */}
          <Route path="/" element={<FarmFreshDairyWebsite />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/delivery-login" element={<DeliveryLogin />} />

          {/* Customer public shopping */}
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route
            path="/subscription-checkout"
            element={<SubscriptionCheckout />}
          />

          {/* Customer protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
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

          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* Admin protected */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin-products"
            element={
              <AdminProtectedRoute>
                <AdminProducts />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin-customers"
            element={
              <AdminProtectedRoute>
                <AdminCustomers />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin-billing"
            element={
              <AdminProtectedRoute>
                <AdminBilling />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/subscriptions"
            element={
              <AdminProtectedRoute>
                <AdminSubscriptions />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/delivery-management"
            element={
              <AdminProtectedRoute>
                <DeliveryManagement />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin-delivery-report"
            element={
              <AdminProtectedRoute>
                <AdminDeliveryReport />
              </AdminProtectedRoute>
            }
          />

          {/* Delivery protected */}
          <Route
            path="/delivery-boy"
            element={
              <DeliveryProtectedRoute>
                <DeliveryBoy />
              </DeliveryProtectedRoute>
            }
          />
        </Routes>
      </div>

      <MobileBottomNav />
    </div>
  );
}