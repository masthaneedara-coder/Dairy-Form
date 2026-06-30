import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { USER_ROLES } from "./config/appConfig";

/* Customer Pages */
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

/* Customer Protected Route */
import ProtectedRoute from "./Components/ProtectedRoute";
import ForgotPassword from "./Pages/ForgotPassword";

/* Admin */
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminOrders from "./Pages/AdminOrders";
import AdminProducts from "./Pages/AdminProducts";
import AdminCustomers from "./Pages/AdminCustomers";
import AdminSubscriptions from "./Pages/AdminSubscriptions";
import AdminBilling from "./Pages/AdminBilling";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";


/* Delivery */
import DeliveryLogin from "./Pages/DeliveryLogin";
import DeliveryDashboard from "./Pages/DeliveryDashboard";
import DeliveryOrders from "./Pages/DeliveryOrders";
import DeliveryProtectedRoute from "./Components/DeliveryProtectedRoute";

/* Notification */
import Notifications from "./pages/Notifications";
import NotificationSettings from "./pages/NotificationSettings";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-[140px]">

      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================= */}
        <Route path="/" element={<FarmFreshDairyWebsite />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />

        {/* Checkout should be protected */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* Subscription */}
        <Route path="/subscription" element={<Subscription />} />

        <Route
          path="/subscription-checkout"
          element={
            <ProtectedRoute>
              <SubscriptionCheckout />
            </ProtectedRoute>
          }
        />

        {/* =========================
            CUSTOMER PROTECTED
        ========================= */}
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
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* =========================
            ADMIN ROUTES
        ========================= */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <AdminOrders />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <AdminProducts />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <AdminProtectedRoute>
              <AdminCustomers />
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
          path="/admin/billing"
          element={
            <AdminProtectedRoute>
              <AdminBilling />
            </AdminProtectedRoute>
          }
        />

        {/* =========================
            DELIVERY ROUTES
        ========================= */}
        <Route path="/delivery-login" element={<DeliveryLogin />} />

        <Route
          path="/delivery"
          element={
            <DeliveryProtectedRoute>
              <DeliveryDashboard />
            </DeliveryProtectedRoute>
          }
        />

        <Route
          path="/delivery/orders"
          element={
            <DeliveryProtectedRoute>
              <DeliveryOrders />
            </DeliveryProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={<Notifications />}
        />
        <Route
          path="/notification-settings"
          element={<NotificationSettings />}
        />
      </Routes>
      </div>
    </div>
  );
}