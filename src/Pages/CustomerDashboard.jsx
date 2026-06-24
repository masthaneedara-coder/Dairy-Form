import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const customerName =
    localStorage.getItem("customerName") || "Customer";

  const customerPhone =
    localStorage.getItem("customerPhone") || "";

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return "-";

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRemainingDays = (expireDate) => {
    if (!expireDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expireDate);
    if (isNaN(expiry)) return 0;

    expiry.setHours(0, 0, 0, 0);

    const diff = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    return diff > 0 ? diff : 0;
  };

  const getSubscriptionStatus = (sub) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sub.status === "Paused") {
      return "Paused";
    }

    const expiry = new Date(sub.expireDate);

    if (!isNaN(expiry)) {
      expiry.setHours(0, 0, 0, 0);

      if (expiry < today) {
        return "Expired";
      }
    }

    return "Active";
  };

  const subscriptionsWithStatus = subscriptions.map((sub) => {
    const remainingDays = getRemainingDays(sub.expireDate);
    const computedStatus = getSubscriptionStatus(sub);

    return {
      ...sub,
      remainingDays,
      computedStatus,
      isExpired: computedStatus === "Expired",
    };
  });

  const loadSubscriptions = async () => {
    try {
      const res = await fetch(
        `${SCRIPT_URL}?action=subscriptions&phone=${customerPhone}`
      );
      const data = await res.json();
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
      setSubscriptions([]);
    }
  };

  const loadOrders = async () => {
    try {
      const ordersRes = await fetch(
        `${SCRIPT_URL}?action=orders&phone=${customerPhone}`
      );
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      const deliveryRes = await fetch(
        `${SCRIPT_URL}?action=deliveryStatus&phone=${customerPhone}`
      );
      const deliveryData = await deliveryRes.json();
      setDeliveryOrders(Array.isArray(deliveryData) ? deliveryData : []);

      const billsRes = await fetch(
        `${SCRIPT_URL}?action=customerBills&phone=${customerPhone}`
      );
      const billsData = await billsRes.json();
      setBills(Array.isArray(billsData) ? billsData : []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
      setDeliveryOrders([]);
      setBills([]);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadSubscriptions(), loadOrders()]);
      setLoading(false);
    };

    loadAll();

    const interval = setInterval(() => {
      loadOrders();
      loadSubscriptions();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const updateSubscription = async (subscriptionId, status) => {
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "updateSubscriptionStatus",
          subscriptionId,
          status,
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert(
          status === "Active"
            ? "Subscription resumed successfully"
            : "Subscription paused successfully"
        );

        await loadSubscriptions();
      } else {
        alert(result.message || "Failed to update subscription");
      }
    } catch (err) {
      console.error("Update subscription error:", err);
      alert("Failed to update subscription");
    }
  };

  const activePlans = subscriptionsWithStatus.filter(
    (s) => s.computedStatus === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <div className="absolute top-0 right-0 opacity-10 text-[120px] sm:text-[180px]">
          🥛
        </div>

        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-400 shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 sm:left-20 w-40 sm:w-72 h-40 sm:h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 sm:right-20 w-40 sm:w-72 h-40 sm:h-72 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 p-5 sm:p-8 md:p-10 relative z-10">
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
                  🌿
                </div>

                <span className="text-green-100 tracking-[2px] sm:tracking-[4px] text-xs sm:text-sm font-semibold">
                  FARM FRESH DAIRY
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight">
                Welcome 👋
              </h1>

              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-yellow-100 mt-2 sm:mt-3 break-words">
                {customerName}
              </h2>

              <div className="mt-5 sm:mt-8 inline-flex items-center gap-3 bg-black/20 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-full w-fit max-w-full">
                <span className="text-xl sm:text-2xl">📞</span>

                <span className="text-base sm:text-xl md:text-2xl font-bold text-white break-all">
                  {customerPhone}
                </span>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center relative">
              <div className="absolute w-[320px] h-[320px] border-[24px] border-white/10 rounded-full"></div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-16 sm:h-24 bg-white rounded-t-[100%]"></div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div className="bg-green-600 text-white rounded-3xl p-5 shadow-lg">
          <p className="text-sm sm:text-lg">Total Subscriptions</p>
          <h2 className="text-3xl sm:text-4xl font-black mt-2">
            {subscriptions.length}
          </h2>
        </div>

        <div className="bg-purple-600 text-white rounded-3xl p-5 shadow-lg">
          <p className="text-sm sm:text-lg">Active Plans</p>
          <h2 className="text-3xl sm:text-4xl font-black mt-2">
            {activePlans}
          </h2>
        </div>

        <div className="bg-orange-500 text-white rounded-3xl p-5 shadow-lg sm:col-span-2 lg:col-span-1">
          <p className="text-sm sm:text-lg">Today's Orders</p>
          <h2 className="text-3xl sm:text-4xl font-black mt-2">
            {orders.length}
          </h2>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => navigate("/products")}
          className="bg-green-600 text-white p-4 sm:p-5 rounded-2xl font-bold text-sm sm:text-base"
        >
          🛒 Order Products
        </button>

        <button
          onClick={() => navigate("/subscription")}
          className="bg-blue-600 text-white p-4 sm:p-5 rounded-2xl font-bold text-sm sm:text-base"
        >
          🥛 Subscribe Milk
        </button>

        <button
          onClick={() => navigate("/order-history")}
          className="bg-orange-500 text-white p-4 sm:p-5 rounded-2xl font-bold text-sm sm:text-base"
        >
          📦 My Orders
        </button>

        <button
          onClick={() => navigate("/track-order")}
          className="bg-purple-600 text-white p-4 sm:p-5 rounded-2xl font-bold text-sm sm:text-base"
        >
          🚚 Track Delivery
        </button>
      </div>

      {/* SUBSCRIPTIONS */}
      <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-green-700">
            🥛 Active Subscriptions
          </h2>

          <button
            onClick={() => navigate("/subscription")}
            className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold w-full sm:w-auto"
          >
            + Add Subscription
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading dashboard...
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-6xl">🥛</div>
            <h3 className="text-2xl font-bold mt-4">
              No Active Subscription
            </h3>

            <button
              onClick={() => navigate("/subscription")}
              className="mt-5 bg-green-600 text-white px-6 py-3 rounded-xl"
            >
              Subscribe Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {subscriptionsWithStatus.map((sub) => (
              <div
                key={sub.subscriptionId}
                className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl"
              >
                <div className="flex justify-between items-start gap-3 mb-5">
                  <div className="min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-black break-words">
                      🥛 {sub.product}
                    </h3>

                    <p className="text-green-100 mt-1 text-sm sm:text-base">
                      Fresh Farm Delivery
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap ${
                      sub.computedStatus === "Active"
                        ? "bg-green-500 text-white"
                        : sub.computedStatus === "Paused"
                        ? "bg-orange-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {sub.computedStatus}
                  </span>
                </div>

                {sub.computedStatus === "Active" &&
                  sub.remainingDays <= 5 &&
                  sub.remainingDays > 0 && (
                    <div className="bg-yellow-100 text-yellow-700 p-3 rounded-xl font-bold mb-4 text-sm">
                      ⚠️ Subscription expires in {sub.remainingDays} days
                    </div>
                  )}

                <div className="mb-5">
                  <div className="flex justify-between mb-2 text-sm sm:text-base gap-3">
                    <span>Remaining Days</span>

                    <span className="font-semibold text-right">
                      {sub.computedStatus === "Expired"
                        ? "Expired"
                        : sub.computedStatus === "Paused"
                        ? "Paused"
                        : `${sub.remainingDays} Days`}
                    </span>
                  </div>

                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className="bg-white h-3 rounded-full"
                      style={{
                        width: `${Math.min(
                          (sub.remainingDays / 30) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-end gap-4 mb-5">
                  <div>
                    <p className="text-green-100 text-sm">Monthly Bill</p>
                    <h3 className="text-2xl sm:text-3xl font-black">
                      ₹{sub.price}
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-green-100 text-sm">Expiry</p>
                    <p className="font-bold text-sm sm:text-base">
                      {formatDate(sub.expireDate)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => navigate("/track-order")}
                    className="bg-white text-green-700 py-3 rounded-2xl font-bold text-sm sm:text-base"
                  >
                    🚚 Track
                  </button>

                  {sub.computedStatus === "Expired" ? (
                    <button
                      onClick={() => navigate("/subscription")}
                      className="bg-orange-500 text-white py-3 rounded-2xl font-bold text-sm sm:text-base"
                    >
                      Renew
                    </button>
                  ) : sub.computedStatus === "Paused" ? (
                    <button
                      onClick={() =>
                        updateSubscription(sub.subscriptionId, "Active")
                      }
                      className="py-3 rounded-2xl font-bold bg-green-800 text-white text-sm sm:text-base"
                    >
                      Resume
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        updateSubscription(sub.subscriptionId, "Paused")
                      }
                      className="py-3 rounded-2xl font-bold bg-red-500 text-white text-sm sm:text-base"
                    >
                      Pause
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TODAY ORDERS */}
      <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
            🛒 Today's Orders
          </h2>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold w-fit">
            {orders.length} Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No orders found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-3xl shadow-md hover:shadow-xl transition-all p-5"
              >
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                      {order.product?.includes("Curd") ? "🥣" : "🥛"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 break-words">
                        {order.product}
                      </h3>

                      <p className="text-xs text-green-600">
                        Farm Fresh Dairy
                      </p>
                    </div>
                  </div>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Quantity</p>
                    <h4 className="text-xl sm:text-2xl font-bold">
                      {order.qty}
                    </h4>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Amount</p>
                    <h4 className="text-xl sm:text-2xl font-bold text-green-600">
                      ₹{order.amount}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/track-order")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm sm:text-base"
                >
                  🚚 Track Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}