import { Routes, Route } from "react-router-dom";

import FarmFreshDairyWebsite from "./Pages/FarmFreshDairyWebsite";
import Subscribe from "./Pages/Subscribe";
import AdminDashboard from "./Pages/AdminDashboard";
import TrackOrder from "./Pages/TrackOrder";
import DeliveryBoy from "./Pages/DeliveryBoy";
import CustomerDashboard from "./Pages/CustomerDashboard";
import Auth from "./Pages/Auth";

import ProtectedRoute from "./Components/ProtectedRoute";
import Navbar from "./Components/Navbar";

export default function App() {

  return (

    <div>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<FarmFreshDairyWebsite />}
        />

        <Route
          path="/subscribe"
          element={<Subscribe />}
        />

        <Route
          path="/auth"
          element={<Auth />}
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
          path="/track-order"
          element={
            <ProtectedRoute>

              <TrackOrder />

            </ProtectedRoute>
          }
        />

        <Route
          path="/delivery"
          element={
            <ProtectedRoute>

              <DeliveryBoy />

            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>

              <AdminDashboard />

            </ProtectedRoute>
          }
        />

      </Routes>

    </div>

  );

}