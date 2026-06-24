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

  // =========================
  // HELPERS
  // =========================
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

  // =========================
  // LOAD DATA
  // =========================
  const loadSubscriptions = async () => {
    try {
      const res = await fetch(
        `${SCRIPT_URL}?action=subscriptions&phone=${customerPhone}`
      );
      const data = await res.json();
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
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
      setDeliveryOrders(
        Array.isArray(deliveryData) ? deliveryData : []
      );

      const billsRes = await fetch(
        `${SCRIPT_URL}?action=customerBills&phone=${customerPhone}`
      );
      const billsData = await billsRes.json();
      setBills(Array.isArray(billsData) ? billsData : []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  useEffect(() => {
    loadSubscriptions();
    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
      loadSubscriptions();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // UPDATE SUBSCRIPTION
  // =========================
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

  // =========================
  // SUMMARY CARDS
  // =========================
 

  const activePlans = subscriptionsWithStatus.filter(
    (s) => s.computedStatus === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 rounded-3xl shadow-2xl p-8 mb-8">
        <div className="absolute top-0 right-0 opacity-10 text-[200px]">
          🥛
        </div>

        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-400 shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 p-10 relative z-10">
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-2xl">
                  🌿
                </div>

                <span className="text-green-100 tracking-[4px] font-semibold">
                  FARM FRESH DAIRY
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Welcome 👋
              </h1>

              <h2 className="text-4xl lg:text-5xl font-bold text-yellow-100 mt-3">
                {customerName}
              </h2>

              <div className="mt-8 inline-flex items-center gap-3 bg-black/20 backdrop-blur-xl px-6 py-4 rounded-full w-fit">
                <span className="text-2xl">📞</span>

                <span className="text-2xl font-bold text-white">
                  {customerPhone}
                </span>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center relative">
              <div className="absolute w-[400px] h-[400px] border-[30px] border-white/10 rounded-full"></div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-24 bg-white rounded-t-[100%]"></div>
        </div>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-green-600 text-white rounded-3xl p-6 shadow-lg">
                <p className="text-lg">Total Subscriptions</p>
                <h2 className="text-4xl font-black mt-2">
                  {subscriptions.length}
                </h2>
              </div>

              <div className="bg-purple-600 text-white rounded-3xl p-6 shadow-lg">
                <p className="text-lg">Active Plans</p>
                <h2 className="text-4xl font-black mt-2">
                  {subscriptions.filter((s) => s.status === "Active").length}
                </h2>
              </div>

              <div className="bg-orange-500 text-white rounded-3xl p-6 shadow-lg">
                <p className="text-lg">Today's Orders</p>
                <h2 className="text-4xl font-black mt-2">
                  {orders.length}
                </h2>
              </div>
            </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => navigate("/products")}
          className="bg-green-600 text-white p-5 rounded-2xl font-bold"
        >
          🛒 Order Products
        </button>

        <button
          onClick={() => navigate("/subscription")}
          className="bg-blue-600 text-white p-5 rounded-2xl font-bold"
        >
          🥛 Subscribe Milk
        </button>

        <button
          onClick={() => navigate("/order-history")}
          className="bg-orange-500 text-white p-5 rounded-2xl font-bold"
        >
          📦 My Orders
        </button>

        <button
          onClick={() => navigate("/track-order")}
          className="bg-purple-600 text-white p-5 rounded-2xl font-bold"
        >
          🚚 Track Delivery
        </button>
      </div>

      {/* SUBSCRIPTIONS */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-green-700">
            🥛 Active Subscriptions
          </h2>

          <button
            onClick={() => navigate("/subscription")}
            className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
          >
            + Add Subscription
          </button>
        </div>

        {subscriptions.length === 0 ? (
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
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {subscriptionsWithStatus.map((sub) => (
              <div
                key={sub.subscriptionId}
                className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-3xl font-black">
                      🥛 {sub.product}
                    </h3>

                    <p className="text-green-100 mt-1">
                      Fresh Farm Delivery
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full font-bold ${
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
                    <div className="bg-yellow-100 text-yellow-700 p-3 rounded-xl font-bold mb-4">
                      ⚠️ Subscription expires in{" "}
                      {sub.remainingDays} days
                    </div>
                  )}

                <div className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span>Remaining Days</span>

                    <span>
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

                <div className="flex justify-between items-center mb-5">
                  <div>
                    <p className="text-green-100 text-sm">
                      Monthly Bill
                    </p>

                    <h3 className="text-3xl font-black">
                      ₹{sub.price}
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-green-100 text-sm">
                      Expiry
                    </p>

                    <p className="font-bold">
                      {formatDate(sub.expireDate)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/track-order")}
                    className="bg-white text-green-700 py-3 rounded-2xl font-bold"
                  >
                    🚚 Track
                  </button>

                  {sub.computedStatus === "Expired" ? (
                    <button
                      onClick={() => navigate("/subscription")}
                      className="bg-orange-500 text-white py-3 rounded-2xl font-bold"
                    >
                      Renew Plan
                    </button>
                  ) : sub.computedStatus === "Paused" ? (
                    <button
                      onClick={() =>
                        updateSubscription(
                          sub.subscriptionId,
                          "Active"
                        )
                      }
                      className="py-3 rounded-2xl font-bold bg-green-800 text-white"
                    >
                      Resume
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        updateSubscription(
                          sub.subscriptionId,
                          "Paused"
                        )
                      }
                      className="py-3 rounded-2xl font-bold bg-red-500 text-white"
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
      <div className="bg-white rounded-3xl shadow-xl p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-gray-800">
            🛒 Today's Orders
          </h2>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">
            {orders.length} Orders
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="min-w-[280px] bg-white border border-gray-100 rounded-3xl shadow-md hover:shadow-xl transition-all p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">
                    {order.product?.includes("Curd")
                      ? "🥣"
                      : "🥛"}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {order.product}
                    </h3>

                    <p className="text-xs text-green-600">
                      Farm Fresh Dairy
                    </p>
                  </div>
                </div>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">
                    Quantity
                  </p>
                  <h4 className="text-2xl font-bold">
                    {order.qty}
                  </h4>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">
                    Amount
                  </p>
                  <h4 className="text-2xl font-bold text-green-600">
                    ₹{order.amount}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => navigate("/track-order")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
              >
                🚚 Track Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}