import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();

  const [isCustomerLoggedIn, setIsCustomerLoggedIn] =
    useState(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] =
    useState(false);

  const [isDeliveryLoggedIn, setIsDeliveryLoggedIn] =
    useState(false);

  const [customerName, setCustomerName] =
    useState("");

  const [adminName, setAdminName] =
    useState("");

  const [deliveryBoyName, setDeliveryBoyName] =
    useState("");

  const [userRole, setUserRole] =
    useState("");

  useEffect(() => {
    const customerLogin =
      localStorage.getItem("customerLogin") === "true";

    const adminLogin =
      localStorage.getItem("adminLogin") === "true";

    const deliveryLogin =
      localStorage.getItem("deliveryLogin") === "true";

    const role =
      localStorage.getItem("userRole") || "";

    setIsCustomerLoggedIn(customerLogin);
    setIsAdminLoggedIn(adminLogin);
    setIsDeliveryLoggedIn(deliveryLogin);
    setUserRole(role);

    setCustomerName(
      localStorage.getItem("customerName") || "Customer"
    );

    setAdminName(
      localStorage.getItem("adminName") || "Admin"
    );

    setDeliveryBoyName(
      localStorage.getItem("deliveryBoyName") || "Delivery Boy"
    );
  }, [location.pathname]); // IMPORTANT

  const handleLogout = () => {
    localStorage.removeItem("customerLogin");
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerPhone");

    localStorage.removeItem("adminLogin");
    localStorage.removeItem("adminName");

    localStorage.removeItem("deliveryLogin");
    localStorage.removeItem("deliveryBoyName");

    localStorage.removeItem("userRole");

    setIsCustomerLoggedIn(false);
    setIsAdminLoggedIn(false);
    setIsDeliveryLoggedIn(false);
    setCustomerName("");
    setAdminName("");
    setDeliveryBoyName("");
    setUserRole("");

    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <img
              src={logo}
              alt="Farm Fresh Dairy"
              className="w-14 h-14 rounded-full shadow-lg border-2 border-green-100"
            />

            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
                FarmFreshDairy
              </h1>

              <p className="text-sm text-gray-500">
                Pure Milk Delivered Daily
              </p>
            </div>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* No login */}
            {!isCustomerLoggedIn &&
              !isAdminLoggedIn &&
              !isDeliveryLoggedIn && (
                <>
                  <Link
                    to="/"
                    className="px-5 py-2 rounded-xl font-semibold text-gray-700 hover:bg-green-50"
                  >
                    Home
                  </Link>

                  <Link
                    to="/auth"
                    className="px-6 py-3 rounded-2xl bg-green-600 text-white font-bold shadow-lg hover:bg-green-700"
                  >
                    Customer Login
                  </Link>

                  <Link
                    to="/admin-login"
                    className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold shadow-lg hover:bg-purple-700"
                  >
                    Admin Login
                  </Link>

                  <Link
                    to="/delivery-login"
                    className="px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold shadow-lg hover:bg-orange-700"
                  >
                    Delivery Login
                  </Link>
                </>
              )}

            {/* Customer login */}
            {isCustomerLoggedIn &&
              userRole === "customer" && (
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">
                    👋 {customerName}
                  </div>

                  <Link
                    to="/dashboard"
                    className="px-5 py-3 rounded-2xl bg-green-50 text-green-700 font-bold hover:bg-green-100"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/track-order"
                    className="px-5 py-3 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100"
                  >
                    Track Orders
                  </Link>

                  <Link
                    to="/order-history"
                    className="px-5 py-3 rounded-2xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100"
                  >
                    Order History
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 rounded-2xl bg-red-500 text-white font-bold shadow-lg hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}

            {/* Admin login */}
            {isAdminLoggedIn &&
              userRole === "admin" && (
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-bold">
                    👨‍💼 {adminName}
                  </div>

                  <Link
                    to="/admin"
                    className="px-5 py-3 rounded-2xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100"
                  >
                    Admin Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 rounded-2xl bg-red-500 text-white font-bold shadow-lg hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}

            {/* Delivery login */}
            {isDeliveryLoggedIn &&
              userRole === "delivery" && (
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold">
                    🚚 {deliveryBoyName}
                  </div>

                  <Link
                    to="/delivery-boy"
                    className="px-5 py-3 rounded-2xl bg-orange-50 text-orange-700 font-bold hover:bg-orange-100"
                  >
                    Delivery Panel
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 rounded-2xl bg-red-500 text-white font-bold shadow-lg hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg">
          <div className="whitespace-nowrap py-3 text-white font-bold animate-marquee">
            🥛 Fresh Buffalo Milk Delivered Daily • 🚚 Free Morning Delivery • 🌿 100% Farm Fresh • 🧈 Fresh Curd Available • 📞 Subscribe Today •
          </div>
        </div>
      </div>
    </header>
  );
}