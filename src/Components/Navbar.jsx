import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();

  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isDeliveryLoggedIn, setIsDeliveryLoggedIn] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [deliveryBoyName, setDeliveryBoyName] = useState("");
  const [userRole, setUserRole] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const customerLogin =
      localStorage.getItem("customerLogin") === "true";

    const adminLogin =
      localStorage.getItem("adminLogin") === "true";

    const deliveryLogin =
      localStorage.getItem("deliveryLogin") === "true";

    const role = localStorage.getItem("userRole") || "";

    setIsCustomerLoggedIn(customerLogin);
    setIsAdminLoggedIn(adminLogin);
    setIsDeliveryLoggedIn(deliveryLogin);
    setUserRole(role);

    setCustomerName(
      localStorage.getItem("customerName") || "Customer"
    );

    setAdminName(localStorage.getItem("adminName") || "Admin");

    setDeliveryBoyName(
      localStorage.getItem("deliveryBoyName") || "Delivery Boy"
    );

    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("customerLogin");
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerPhone");
    localStorage.removeItem("customerAddress");
    localStorage.removeItem("customerArea");

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
    setMobileMenuOpen(false);

    window.location.href = "/";
  };

  const navLinkBase =
    "px-4 py-2.5 rounded-xl font-semibold transition";
  const navBtnBase =
    "px-4 py-2.5 rounded-xl font-bold shadow-sm transition text-center";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between min-h-[72px] py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img
              src={logo}
              alt="Farm Fresh Dairy"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-lg border-2 border-green-100 object-cover flex-shrink-0"
            />

            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-3xl font-black bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent leading-tight truncate">
                FarmFreshDairy
              </h1>

              <p className="hidden sm:block text-xs md:text-sm text-gray-500 truncate">
                Pure Milk Delivered Daily
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-3 flex-wrap justify-end">
            {!isCustomerLoggedIn &&
              !isAdminLoggedIn &&
              !isDeliveryLoggedIn && (
                <>
                  <Link
                    to="/"
                    className={`${navLinkBase} text-gray-700 hover:bg-green-50`}
                  >
                    Home
                  </Link>

                  <Link
                    to="/products"
                    className={`${navLinkBase} text-gray-700 hover:bg-green-50`}
                  >
                    Products
                  </Link>

                  <Link
                    to="/auth"
                    className={`${navBtnBase} bg-green-600 text-white hover:bg-green-700`}
                  >
                    Customer Login
                  </Link>

                  <Link
                    to="/admin-login"
                    className={`${navBtnBase} bg-purple-600 text-white hover:bg-purple-700`}
                  >
                    Admin Login
                  </Link>

                  <Link
                    to="/delivery-login"
                    className={`${navBtnBase} bg-orange-600 text-white hover:bg-orange-700`}
                  >
                    Delivery Login
                  </Link>
                </>
              )}

            {isCustomerLoggedIn && userRole === "customer" && (
              <>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">
                  👋 {customerName}
                </div>

                <Link
                  to="/dashboard"
                  className={`${navBtnBase} bg-green-50 text-green-700 hover:bg-green-100`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/products"
                  className={`${navBtnBase} bg-yellow-50 text-yellow-700 hover:bg-yellow-100`}
                >
                  Products
                </Link>

                <Link
                  to="/subscription"
                  className={`${navBtnBase} bg-blue-50 text-blue-700 hover:bg-blue-100`}
                >
                  Subscribe
                </Link>

                <Link
                  to="/track-order"
                  className={`${navBtnBase} bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
                >
                  Track
                </Link>

                <Link
                  to="/order-history"
                  className={`${navBtnBase} bg-purple-50 text-purple-700 hover:bg-purple-100`}
                >
                  Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className={`${navBtnBase} bg-red-500 text-white hover:bg-red-600`}
                >
                  Logout
                </button>
              </>
            )}

            {isAdminLoggedIn && userRole === "admin" && (
              <>
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-bold">
                  👨‍💼 {adminName}
                </div>

                <Link
                  to="/admin"
                  className={`${navBtnBase} bg-purple-50 text-purple-700 hover:bg-purple-100`}
                >
                  Admin Dashboard
                </Link>

                <Link
                  to="/admin-products"
                  className={`${navBtnBase} bg-blue-50 text-blue-700 hover:bg-blue-100`}
                >
                  Products
                </Link>

                <Link
                  to="/admin-customers"
                  className={`${navBtnBase} bg-green-50 text-green-700 hover:bg-green-100`}
                >
                  Customers
                </Link>

                <Link
                  to="/admin-billing"
                  className={`${navBtnBase} bg-yellow-50 text-yellow-700 hover:bg-yellow-100`}
                >
                  Billing
                </Link>

                <Link
                  to="/admin/subscriptions"
                  className={`${navBtnBase} bg-pink-50 text-pink-700 hover:bg-pink-100`}
                >
                  Subscriptions
                </Link>

                <Link
                  to="/delivery-management"
                  className={`${navBtnBase} bg-orange-50 text-orange-700 hover:bg-orange-100`}
                >
                  Delivery
                </Link>

                <button
                  onClick={handleLogout}
                  className={`${navBtnBase} bg-red-500 text-white hover:bg-red-600`}
                >
                  Logout
                </button>
              </>
            )}

            {isDeliveryLoggedIn && userRole === "delivery" && (
              <>
                <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold">
                  🚚 {deliveryBoyName}
                </div>

                <Link
                  to="/delivery-boy"
                  className={`${navBtnBase} bg-orange-50 text-orange-700 hover:bg-orange-100`}
                >
                  Delivery Panel
                </Link>

                <button
                  onClick={handleLogout}
                  className={`${navBtnBase} bg-red-500 text-white hover:bg-red-600`}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-2xl border border-green-100 bg-white shadow-sm text-green-700"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="rounded-3xl border border-green-100 bg-white shadow-lg p-4 space-y-3">
              {!isCustomerLoggedIn &&
                !isAdminLoggedIn &&
                !isDeliveryLoggedIn && (
                  <div className="grid gap-3">
                    <Link
                      to="/"
                      className="w-full px-4 py-3 rounded-2xl font-semibold text-gray-700 bg-gray-50 text-center"
                    >
                      Home
                    </Link>

                    <Link
                      to="/products"
                      className="w-full px-4 py-3 rounded-2xl font-semibold text-gray-700 bg-gray-50 text-center"
                    >
                      Products
                    </Link>

                    <Link
                      to="/auth"
                      className="w-full px-4 py-3 rounded-2xl bg-green-600 text-white font-bold text-center"
                    >
                      Customer Login
                    </Link>

                    <Link
                      to="/admin-login"
                      className="w-full px-4 py-3 rounded-2xl bg-purple-600 text-white font-bold text-center"
                    >
                      Admin Login
                    </Link>

                    <Link
                      to="/delivery-login"
                      className="w-full px-4 py-3 rounded-2xl bg-orange-600 text-white font-bold text-center"
                    >
                      Delivery Login
                    </Link>
                  </div>
                )}

              {isCustomerLoggedIn && userRole === "customer" && (
                <div className="space-y-3">
                  <div className="bg-green-100 text-green-700 px-4 py-3 rounded-2xl font-bold text-center">
                    👋 {customerName}
                  </div>

                  <Link
                    to="/dashboard"
                    className="block w-full px-4 py-3 rounded-2xl bg-green-50 text-green-700 font-bold text-center"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/products"
                    className="block w-full px-4 py-3 rounded-2xl bg-yellow-50 text-yellow-700 font-bold text-center"
                  >
                    Products
                  </Link>

                  <Link
                    to="/subscription"
                    className="block w-full px-4 py-3 rounded-2xl bg-blue-50 text-blue-700 font-bold text-center"
                  >
                    Subscribe
                  </Link>

                  <Link
                    to="/track-order"
                    className="block w-full px-4 py-3 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-center"
                  >
                    Track Order
                  </Link>

                  <Link
                    to="/order-history"
                    className="block w-full px-4 py-3 rounded-2xl bg-purple-50 text-purple-700 font-bold text-center"
                  >
                    Order History
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-2xl bg-red-500 text-white font-bold"
                  >
                    Logout
                  </button>
                </div>
              )}

              {isAdminLoggedIn && userRole === "admin" && (
                <div className="space-y-3">
                  <div className="bg-purple-100 text-purple-700 px-4 py-3 rounded-2xl font-bold text-center">
                    👨‍💼 {adminName}
                  </div>

                  <Link
                    to="/admin"
                    className="block w-full px-4 py-3 rounded-2xl bg-purple-50 text-purple-700 font-bold text-center"
                  >
                    Admin Dashboard
                  </Link>

                  <Link
                    to="/admin-products"
                    className="block w-full px-4 py-3 rounded-2xl bg-blue-50 text-blue-700 font-bold text-center"
                  >
                    Products
                  </Link>

                  <Link
                    to="/admin-customers"
                    className="block w-full px-4 py-3 rounded-2xl bg-green-50 text-green-700 font-bold text-center"
                  >
                    Customers
                  </Link>

                  <Link
                    to="/admin-billing"
                    className="block w-full px-4 py-3 rounded-2xl bg-yellow-50 text-yellow-700 font-bold text-center"
                  >
                    Billing
                  </Link>

                  <Link
                    to="/admin/subscriptions"
                    className="block w-full px-4 py-3 rounded-2xl bg-pink-50 text-pink-700 font-bold text-center"
                  >
                    Subscriptions
                  </Link>

                  <Link
                    to="/delivery-management"
                    className="block w-full px-4 py-3 rounded-2xl bg-orange-50 text-orange-700 font-bold text-center"
                  >
                    Delivery
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-2xl bg-red-500 text-white font-bold"
                  >
                    Logout
                  </button>
                </div>
              )}

              {isDeliveryLoggedIn && userRole === "delivery" && (
                <div className="space-y-3">
                  <div className="bg-orange-100 text-orange-700 px-4 py-3 rounded-2xl font-bold text-center">
                    🚚 {deliveryBoyName}
                  </div>

                  <Link
                    to="/delivery-boy"
                    className="block w-full px-4 py-3 rounded-2xl bg-orange-50 text-orange-700 font-bold text-center"
                  >
                    Delivery Panel
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-2xl bg-red-500 text-white font-bold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Announcement */}
        <div className="pb-3 sm:pb-4">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg">
            <div className="whitespace-nowrap py-2.5 sm:py-3 text-white font-bold text-xs sm:text-sm md:text-base animate-marquee px-4">
              🥛 Fresh Buffalo Milk Delivered Daily • 🚚 Free Morning Delivery • 🌿 100% Farm Fresh • 🧈 Fresh Curd Available • 📞 Subscribe Today •
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}