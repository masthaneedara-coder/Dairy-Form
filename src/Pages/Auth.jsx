import { useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

export default function Auth() {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const ADMIN_MOBILE = "9989663837";
  const ADMIN_PASSWORD = "admin123";

  const DELIVERY_MOBILE = "9000000000";
  const DELIVERY_PASSWORD = "delivery123";

  const clearFields = () => {
    setName("");
    setMobile("");
    setPassword("");
  };

  const movePendingItemToCart = () => {
    try {
      const pendingItem = JSON.parse(
        localStorage.getItem("pendingCartItem") || "null"
      );

      if (!pendingItem) return;

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const safeCart = Array.isArray(cart) ? cart : [];

      const existing = safeCart.find(
        (item) =>
          item.name === pendingItem.name &&
          item.size === pendingItem.size
      );

      if (existing) {
        existing.qty += Number(pendingItem.qty || 1);
        existing.total =
          Number(existing.price || 0) * Number(existing.qty || 0);
      } else {
        safeCart.push({
          ...pendingItem,
          qty: Number(pendingItem.qty || 1),
          total:
            Number(pendingItem.total || 0) ||
            Number(pendingItem.price || 0) * Number(pendingItem.qty || 1),
        });
      }

      localStorage.setItem("cart", JSON.stringify(safeCart));
      localStorage.removeItem("pendingCartItem");
    } catch (error) {
      console.log("Pending cart move error:", error);
    }
  };

  const handlePostCustomerLoginRedirect = () => {
    movePendingItemToCart();

    const redirectTo = localStorage.getItem("afterLoginRedirect");

    if (redirectTo) {
      localStorage.removeItem("afterLoginRedirect");
      navigate(redirectTo);
      return;
    }

    navigate("/dashboard");
  };

  const handleSignup = async () => {
    if (role !== "customer") return;

    if (!name || !mobile || !password) {
      alert("Please fill all fields");
      return;
    }

    if (mobile.length < 10) {
      alert("Please enter valid mobile number");
      return;
    }

    try {
      await addDoc(collection(db, "customers"), {
        name,
        mobile,
        password,
      });

      localStorage.setItem("customerLogin", "true");
      localStorage.setItem("userRole", "customer");
      localStorage.setItem("customerName", name);
      localStorage.setItem("customerPhone", mobile);

      alert("Signup Successful");
      clearFields();

      handlePostCustomerLoginRedirect();
    } catch (error) {
      console.log(error);
      alert("Signup failed");
    }
  };

  const handleCustomerLogin = async () => {
    if (!mobile || !password) {
      alert("Please enter mobile and password");
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, "customers"));

      let found = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

       if (data.mobile === mobile && data.password === password) {
            found = true;

            localStorage.setItem("customerLogin", "true");
            localStorage.setItem("userRole", "customer");
            localStorage.setItem("customerName", data.name);
            localStorage.setItem("customerPhone", data.mobile);

            const pendingItem = JSON.parse(
              localStorage.getItem("pendingCartItem") || "null"
            );

            const redirectAfterLogin =
              localStorage.getItem("redirectAfterLogin");

            // Product pending cart item
            if (pendingItem) {
              const cart = JSON.parse(localStorage.getItem("cart") || "[]");

              const existing = cart.find(
                (item) =>
                  item.name === pendingItem.name &&
                  item.size === pendingItem.size
              );

              if (existing) {
                existing.qty += pendingItem.qty;
                existing.total = existing.qty * existing.price;
              } else {
                cart.push(pendingItem);
              }

              localStorage.setItem("cart", JSON.stringify(cart));
              localStorage.removeItem("pendingCartItem");

              navigate("/cart");
              return;
            }

            // Subscription redirect
            if (redirectAfterLogin) {
              localStorage.removeItem("redirectAfterLogin");
              navigate(redirectAfterLogin);
              return;
            }

            // Default
            navigate("/dashboard");
          }
      });

      if (!found) {
        alert("Invalid customer credentials");
      }
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  const handleAdminLogin = () => {
    if (!mobile || !password) {
      alert("Please enter mobile and password");
      return;
    }

    if (mobile === ADMIN_MOBILE && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLogin", "true");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("adminName", "Admin");
      navigate("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  const handleDeliveryLogin = () => {
    if (!mobile || !password) {
      alert("Please enter mobile and password");
      return;
    }

    if (mobile === DELIVERY_MOBILE && password === DELIVERY_PASSWORD) {
      localStorage.setItem("deliveryLogin", "true");
      localStorage.setItem("userRole", "delivery");
      localStorage.setItem("deliveryBoyName", "Delivery Boy");
      navigate("/delivery-boy");
    } else {
      alert("Invalid delivery credentials");
    }
  };

  const handleSubmit = async () => {
    if (role === "customer") {
      if (isLogin) {
        await handleCustomerLogin();
      } else {
        await handleSignup();
      }
      return;
    }

    if (role === "admin") {
      handleAdminLogin();
      return;
    }

    if (role === "delivery") {
      handleDeliveryLogin();
      return;
    }
  };

  const getTitle = () => {
    if (role === "customer") {
      return isLogin ? "Customer Login" : "Customer Signup";
    }
    if (role === "admin") {
      return "Admin Login";
    }
    return "Delivery Login";
  };

  const getButtonText = () => {
    if (role === "customer") {
      return isLogin ? "Login" : "Signup";
    }
    if (role === "admin") {
      return "Login as Admin";
    }
    return "Login as Delivery Boy";
  };

  const getRoleColor = () => {
    if (role === "customer") {
      return "from-green-600 to-emerald-500";
    }
    if (role === "admin") {
      return "from-purple-600 to-fuchsia-500";
    }
    return "from-orange-500 to-amber-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-3 py-6 sm:px-6 overflow-hidden">
      <style>{`
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.25); }
          50% { box-shadow: 0 0 0 16px rgba(34,197,94,0); }
        }
        .animate-floatY { animation: floatY 4s ease-in-out infinite; }
        .animate-fadeUp { animation: fadeUp .8s ease forwards; }
        .animate-glow { animation: pulseGlow 2.5s infinite; }
      `}</style>

      <div className="relative w-full max-w-6xl">
        <div className="absolute -top-10 left-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-40 animate-floatY" />
        <div className="absolute top-1/3 -right-8 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-40 animate-floatY" />
        <div className="absolute -bottom-8 left-1/3 w-36 h-36 bg-lime-100 rounded-full blur-3xl opacity-40 animate-floatY" />

        <div className="relative grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="hidden lg:flex relative overflow-hidden rounded-[32px] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-10 text-white shadow-2xl">
            <div className="absolute top-10 right-10 text-5xl animate-floatY">🥛</div>
            <div className="absolute bottom-12 left-10 text-4xl animate-floatY">🌿</div>
            <div className="absolute bottom-10 right-16 text-4xl animate-floatY">🚚</div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                  <span>Farm Fresh Dairy</span>
                </div>

                <h1 className="mt-6 text-5xl font-black leading-tight">
                  Fresh Milk
                  <br />
                  Delivered Daily
                </h1>

                <p className="mt-5 text-white/90 text-lg leading-8 max-w-xl">
                  Customer orders, admin control, delivery tracking and subscriptions —
                  all in one dairy management system.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-10">
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
                  <div className="text-3xl mb-3">👤</div>
                  <h3 className="font-bold">Customer</h3>
                  <p className="text-sm text-white/80 mt-1">
                    Login, order, subscribe
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
                  <div className="text-3xl mb-3">🧾</div>
                  <h3 className="font-bold">Admin</h3>
                  <p className="text-sm text-white/80 mt-1">
                    Manage orders & stock
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
                  <div className="text-3xl mb-3">🚚</div>
                  <h3 className="font-bold">Delivery</h3>
                  <p className="text-sm text-white/80 mt-1">
                    Daily delivery updates
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-[28px] sm:rounded-[32px] shadow-2xl border border-green-100 overflow-hidden animate-fadeUp">
            <div className={`bg-gradient-to-r ${getRoleColor()} px-4 sm:px-8 py-6 text-white`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm sm:text-base font-medium text-white/90">
                    Welcome to
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-black">
                    {getTitle()}
                  </h2>
                </div>

                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl animate-glow">
                  {role === "customer" ? "👤" : role === "admin" ? "🧾" : "🚚"}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                <button
                  onClick={() => {
                    setRole("customer");
                    setIsLogin(true);
                    clearFields();
                  }}
                  className={`rounded-2xl px-3 py-3 sm:py-4 font-bold text-sm sm:text-base transition ${
                    role === "customer"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  👤 Customer
                </button>

                <button
                  onClick={() => {
                    setRole("admin");
                    setIsLogin(true);
                    clearFields();
                  }}
                  className={`rounded-2xl px-3 py-3 sm:py-4 font-bold text-sm sm:text-base transition ${
                    role === "admin"
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-purple-50 text-purple-700"
                  }`}
                >
                  🧾 Admin
                </button>

                <button
                  onClick={() => {
                    setRole("delivery");
                    setIsLogin(true);
                    clearFields();
                  }}
                  className={`rounded-2xl px-3 py-3 sm:py-4 font-bold text-sm sm:text-base transition ${
                    role === "delivery"
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-orange-50 text-orange-700"
                  }`}
                >
                  🚚 Delivery
                </button>
              </div>

              {role === "customer" && (
                <div className="flex bg-green-50 rounded-2xl p-1 mb-6">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 rounded-2xl font-bold transition ${
                      isLogin
                        ? "bg-white text-green-700 shadow"
                        : "text-gray-500"
                    }`}
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 rounded-2xl font-bold transition ${
                      !isLogin
                        ? "bg-white text-green-700 shadow"
                        : "text-gray-500"
                    }`}
                  >
                    Signup
                  </button>
                </div>
              )}

              <div className="space-y-4 sm:space-y-5">
                {role === "customer" && !isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-200 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 outline-none focus:ring-2 focus:ring-green-200 bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 outline-none focus:ring-2 focus:ring-green-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 outline-none focus:ring-2 focus:ring-green-200 bg-white"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className={`w-full bg-gradient-to-r ${getRoleColor()} hover:opacity-95 text-white py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl transition hover:-translate-y-0.5`}
                >
                  {getButtonText()}
                </button>

                {role === "customer" && (
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full text-center text-blue-600 font-bold pt-1"
                  >
                    {isLogin
                      ? "Create New Customer Account"
                      : "Already Have Account? Login"}
                  </button>
                )}

                {role === "admin" && (
                  <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4 text-sm text-purple-700">
                    <p className="font-bold mb-1">Admin Login</p>
                    <p>Use admin mobile number and password to open admin dashboard.</p>
                  </div>
                )}

                {role === "delivery" && (
                  <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 text-sm text-orange-700">
                    <p className="font-bold mb-1">Delivery Login</p>
                    <p>Use delivery mobile number and password to open delivery panel.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="bg-white rounded-3xl border border-green-100 p-4 shadow-md">
            <div className="text-2xl mb-2">👤</div>
            <h3 className="font-bold text-green-700">Customer</h3>
            <p className="text-sm text-gray-500 mt-1">
              Login, order, subscription
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-purple-100 p-4 shadow-md">
            <div className="text-2xl mb-2">🧾</div>
            <h3 className="font-bold text-purple-700">Admin</h3>
            <p className="text-sm text-gray-500 mt-1">
              Products, orders, billing
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-orange-100 p-4 shadow-md">
            <div className="text-2xl mb-2">🚚</div>
            <h3 className="font-bold text-orange-700">Delivery</h3>
            <p className="text-sm text-gray-500 mt-1">
              Delivery status updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}