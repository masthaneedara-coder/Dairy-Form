import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const customerLogin = localStorage.getItem("customerLogin") === "true";
    setIsCustomerLoggedIn(customerLogin);
    setCustomerName(localStorage.getItem("customerName") || "Customer");

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cart = Array.isArray(savedCart) ? savedCart : [];
    const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    setCartCount(totalQty);

    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("customerLogin");
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerPhone");
    localStorage.removeItem("customerAddress");
    localStorage.removeItem("customerArea");
    localStorage.removeItem("redirectAfterLogin");

    setIsCustomerLoggedIn(false);
    setCustomerName("");
    navigate("/");
  };

  const goToSubscription = () => {
    if (!isCustomerLoggedIn) {
      localStorage.setItem("redirectAfterLogin", "/subscription");
      navigate("/auth");
      return;
    }
    navigate("/subscription");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 shadow-lg border-b border-green-400/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_35%)]"></div>

        <div className="relative overflow-hidden px-8 sm:px-14">
          <div className="animate-marquee-premium whitespace-nowrap py-3 sm:py-3.5 text-white font-extrabold tracking-wide text-sm sm:text-base md:text-lg">
            ✨ Fresh Farm Milk Delivered Every Morning • 🥛 Pure Cow Milk • 🐃 Fresh Buffalo Milk • 🥣 Fresh Curd Available • 🚚 Free Home Delivery • 📞 Subscribe Today • 🌿 100% Natural & Healthy •
          </div>
        </div>
      </div>

      {/* NAV */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="min-h-[76px] sm:h-20 flex items-center justify-between gap-3 py-3 sm:py-0">
            {/* LEFT */}
            <Link to="/" className="flex items-center gap-3 min-w-0 group">
              <div className="relative flex-shrink-0">
                <img
                  src={logo}
                  alt="Farm Fresh Dairy"
                  className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 border-green-100 shadow-md group-hover:scale-105 transition duration-300"
                />
                <span className="absolute inset-0 rounded-full bg-green-400/10 animate-ping"></span>
              </div>

              <div className="min-w-0">
                <h1 className="text-base sm:text-2xl font-black text-green-700 truncate leading-tight">
                  FarmFreshDairy
                </h1>
                <p className="text-[10px] sm:text-sm text-gray-500 truncate">
                  Pure Milk Delivered Daily
                </p>
              </div>
            </Link>

            {/* RIGHT */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {!isCustomerLoggedIn && (
                <button
                  onClick={() => navigate("/auth")}
                  className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-4 py-2.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  🔐 Login
                </button>
              )}

              {isCustomerLoggedIn && (
                <div className="hidden lg:flex bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
                  👋 {customerName}
                </div>
              )}

              <button
                onClick={() => navigate("/cart")}
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border border-green-100 bg-white shadow-md hover:shadow-lg flex items-center justify-center text-lg sm:text-xl hover:scale-105 transition duration-300"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border border-green-100 bg-white shadow-md hover:shadow-lg flex items-center justify-center text-xl sm:text-2xl text-green-700 hover:scale-105 transition duration-300"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {!isCustomerLoggedIn && (
            <div className="sm:hidden pb-3">
              <button
                onClick={() => navigate("/auth")}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-3 rounded-2xl font-bold shadow-md transition duration-300"
              >
                🔐 Login / Signup
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DROPDOWN */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-xl shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              to="/"
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                location.pathname === "/"
                  ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white"
                  : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100"
              }`}
            >
              🏠 Home
            </Link>

            <Link
              to="/products"
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                location.pathname === "/products"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                  : "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 hover:from-blue-100 hover:to-cyan-100"
              }`}
            >
              🛍️ Products
            </Link>

            <button
              onClick={goToSubscription}
              className={`group flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                location.pathname === "/subscription"
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                  : "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100"
              }`}
            >
              🥛 Subscription
              <span className="ml-auto text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-white text-purple-700 font-extrabold shadow-sm animate-pulse">
                POPULAR
              </span>
            </button>

            {!isCustomerLoggedIn ? (
              <button
                onClick={() => navigate("/auth")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
              >
                🔐 Login / Signup
              </button>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-3 rounded-2xl bg-green-50 text-green-700 font-bold hover:bg-green-100 transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/track-order"
                  className="px-4 py-3 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition"
                >
                  Track Orders
                </Link>

                <Link
                  to="/order-history"
                  className="px-4 py-3 rounded-2xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition"
                >
                  Order History
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}