import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchOrdersByPhone,
  fetchSubscriptionsByPhone,
  updateSubscriptionStatus,
} from "../config/api";
import {
  getCustomerName,
  getCustomerPhone,
  logoutCustomer,
} from "../config/auth";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const subscriptionScrollRef = useRef(null);

    const scrollSubscriptions = (direction = "right") => {
      if (!subscriptionScrollRef.current) return;

      const container = subscriptionScrollRef.current;
      const scrollAmount = window.innerWidth < 640 ? 320 : 420;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    };

  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState("");

  const customerName = getCustomerName() || "Customer";
  const customerPhone = getCustomerPhone() || "";

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const phone =
          getCustomerPhone() || localStorage.getItem("customerPhone") || "";

        if (!phone) {
          setOrders([]);
          setSubscriptions([]);
          return;
        }

        const [ordersData, subscriptionsData] = await Promise.all([
          fetchOrdersByPhone(phone),
          fetchSubscriptionsByPhone(phone),
        ]);

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setSubscriptions(Array.isArray(subscriptionsData) ? subscriptionsData : []);
      } catch (error) {
        console.error("Dashboard load failed:", error);
        setOrders([]);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [customerPhone]);

  const totalOrders = useMemo(() => orders.length, [orders]);

  const totalSpent = useMemo(
    () =>
      orders.reduce(
        (sum, order) => sum + Number(order.totalAmount || order.total || 0),
        0
      ),
    [orders]
  );

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (sub) => String(sub.status || "").toLowerCase() === "active"
      ),
    [subscriptions]
  );

  const pausedSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (sub) => String(sub.status || "").toLowerCase() === "paused"
      ),
    [subscriptions]
  );

  const subscriptionCount = useMemo(() => subscriptions.length, [subscriptions]);
  const activeSubscriptionCount = useMemo(
    () => activeSubscriptions.length,
    [activeSubscriptions]
  );

  const dashboardStatus =
    activeSubscriptionCount > 0 ? "Active" : subscriptionCount > 0 ? "Paused" : "No Subscription";

  const latestOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const handleLogout = () => {
    logoutCustomer();
    navigate("/");
  };

  const formatMoney = (value) => {
    const num = Number(value || 0);
    if (Number.isNaN(num)) return "₹0";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const formatDate = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubscriptionStatusChange = async (subscriptionId, status) => {
    try {
      setStatusUpdatingId(subscriptionId);

      const res = await updateSubscriptionStatus(subscriptionId, status);

      if (res?.success) {
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.subscriptionId === subscriptionId ? { ...sub, status } : sub
          )
        );
        alert(`Subscription ${status.toLowerCase()} successfully`);
      } else {
        alert(res?.message || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Subscription status update failed:", error);
      alert("Failed to update subscription");
    } finally {
      setStatusUpdatingId("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 px-8 py-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🥛</div>
          <h2 className="text-2xl font-black text-green-700">
            Loading Dashboard...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your orders and subscription details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 p-6 sm:p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-white/80 text-sm sm:text-base">Welcome back</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-1">
                👋 {customerName}
              </h1>
              <p className="mt-2 text-white/90">
                Phone: {customerPhone || "Not available"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/products")}
                className="px-5 py-3 rounded-2xl bg-white text-green-700 font-bold shadow"
              >
                Shop Products
              </button>

              <button
                onClick={() => navigate("/subscription")}
                className="px-5 py-3 rounded-2xl bg-white/15 border border-white/20 text-white font-bold"
              >
                Subscription
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-3 rounded-2xl bg-red-500 text-white font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          <StatCard title="Total Orders" value={totalOrders} color="green" />
          <StatCard title="Total Spent" value={formatMoney(totalSpent)} color="blue" />
          <StatCard title="Subscriptions" value={subscriptionCount} color="orange" />
          <StatCard title="Active Subs" value={activeSubscriptionCount} color="emerald" />
          <StatCard title="Status" value={dashboardStatus} color="pink" />
        </div>

        {/* SUBSCRIPTIONS LIST */}
          <div className="mt-8 bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-4 sm:px-6 py-5 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Subscription Information</h2>
                  <p className="text-sm text-green-50 mt-1">
                    Swipe left or right to see all subscriptions
                  </p>
                </div>

                {subscriptions.length > 1 && (
                  <div className="hidden md:flex items-center gap-3">
                    <button
                      onClick={() => scrollSubscriptions("left")}
                      className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white text-xl font-bold transition"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => scrollSubscriptions("right")}
                      className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white text-xl font-bold transition"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {subscriptions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-5xl mb-3">🥛</div>
                <h2 className="text-2xl font-black text-gray-800">
                  No Subscription Found
                </h2>
                <p className="text-gray-500 mt-2">
                  Start a milk subscription for hassle-free delivery.
                </p>
                <button
                  onClick={() => navigate("/subscription")}
                  className="mt-5 px-6 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  Subscribe Now
                </button>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                {/* SCROLLABLE ROW */}
                <div
                  ref={subscriptionScrollRef}
                  className="
                    flex gap-4 sm:gap-5 overflow-x-auto pb-3
                    snap-x snap-mandatory scroll-smooth
                    [-ms-overflow-style:none] [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {subscriptions.map((sub, index) => {
                    const status = String(sub.status || "Active").toLowerCase();
                    const isActive = status === "active";
                    const isPaused = status === "paused";
                    const isExpired = status === "expired";
                    const isStopped = status === "stopped";

                    return (
                      <div
                        key={sub.subscriptionId || index}
                        className="
                          snap-start shrink-0
                          w-[92%] sm:w-[430px] lg:w-[460px]
                          rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-50
                          shadow-md hover:shadow-xl transition-all duration-300
                          hover:-translate-y-1
                        "
                      >
                        {/* CARD HEADER */}
                        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                              Subscription
                            </p>
                            <h3 className="text-2xl font-black text-green-700 mt-1">
                              {sub.product || "Milk Subscription"}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 break-all">
                              ID: {sub.subscriptionId || "-"}
                            </p>
                          </div>

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                              isActive
                                ? "bg-green-100 text-green-700"
                                : isPaused
                                ? "bg-yellow-100 text-yellow-700"
                                : isExpired
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {sub.status || "Active"}
                          </span>
                        </div>

                        {/* CARD BODY */}
                        <div className="p-5 grid grid-cols-2 gap-3">
                          <MiniInfoCard
                            label="Quantity"
                            value={sub.qty || "N/A"}
                            color="blue"
                          />
                          <MiniInfoCard
                            label="Delivery"
                            value={sub.deliveryType || "N/A"}
                            color="yellow"
                          />
                          <MiniInfoCard
                            label="Monthly"
                            value={formatMoney(sub.monthlyAmount)}
                            color="purple"
                          />
                          <MiniInfoCard
                            label="Start Date"
                            value={formatDate(sub.startDate)}
                            color="pink"
                          />
                          <div className="col-span-2">
                            <MiniInfoCard
                              label="Expire Date"
                              value={formatDate(sub.expireDate)}
                              color="emerald"
                            />
                          </div>
                        </div>

                        {/* CARD FOOTER */}
                        <div className="px-5 pb-5">
                          <div className="rounded-2xl border border-green-100 bg-green-50/70 p-4">
                            <div className="flex flex-wrap gap-3">
                              {isActive && (
                                <button
                                  onClick={() =>
                                    handleSubscriptionStatusChange(
                                      sub.subscriptionId,
                                      "Paused"
                                    )
                                  }
                                  disabled={statusUpdatingId === sub.subscriptionId}
                                  className="flex-1 min-w-[120px] px-4 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow disabled:opacity-60"
                                >
                                  {statusUpdatingId === sub.subscriptionId
                                    ? "Updating..."
                                    : "Pause"}
                                </button>
                              )}

                              {isPaused && (
                                <button
                                  onClick={() =>
                                    handleSubscriptionStatusChange(
                                      sub.subscriptionId,
                                      "Active"
                                    )
                                  }
                                  disabled={statusUpdatingId === sub.subscriptionId}
                                  className="flex-1 min-w-[120px] px-4 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow disabled:opacity-60"
                                >
                                  {statusUpdatingId === sub.subscriptionId
                                    ? "Updating..."
                                    : "Activate"}
                                </button>
                              )}

                              {isExpired && (
                                <button
                                  onClick={() => navigate("/subscription")}
                                  className="flex-1 min-w-[120px] px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow"
                                >
                                  Renew
                                </button>
                              )}

                              {isStopped && (
                                <button
                                  onClick={() =>
                                    handleSubscriptionStatusChange(
                                      sub.subscriptionId,
                                      "Active"
                                    )
                                  }
                                  disabled={statusUpdatingId === sub.subscriptionId}
                                  className="flex-1 min-w-[120px] px-4 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow disabled:opacity-60"
                                >
                                  {statusUpdatingId === sub.subscriptionId
                                    ? "Updating..."
                                    : "Reactivate"}
                                </button>
                              )}

                              <button
                                onClick={() => navigate("/subscription")}
                                className="flex-1 min-w-[160px] px-4 py-3 rounded-2xl bg-white border border-green-200 text-green-700 font-bold hover:bg-green-50"
                              >
                                Manage
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* MOBILE HINT */}
                {subscriptions.length > 1 && (
                  <div className="mt-4 flex flex-col items-center justify-center text-center">
                    <div className="w-full max-w-sm h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-24 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-3">
                      Swipe left / right to view all subscriptions
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <QuickCard
            icon="📦"
            title="Order History"
            desc="View all product orders and status"
            color="green"
            onClick={() => navigate("/order-history")}
          />
          <QuickCard
            icon="📅"
            title="Subscription"
            desc="Start or renew your milk subscription"
            color="blue"
            onClick={() => navigate("/subscription")}
          />
          <QuickCard
            icon="🛒"
            title="Shop Products"
            desc="Order milk, curd and dairy products"
            color="orange"
            onClick={() => navigate("/products")}
          />
        </div>

        {/* RECENT ORDERS */}
        <div className="mt-6 bg-white rounded-3xl shadow-lg border border-green-100 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h2 className="text-2xl font-black text-green-700">Recent Orders</h2>

            <button
              onClick={() => navigate("/order-history")}
              className="px-4 py-2 rounded-xl bg-green-50 text-green-700 font-bold"
            >
              View All
            </button>
          </div>

          {latestOrders.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="text-xl font-bold text-gray-700">No orders yet</h3>
              <button
                onClick={() => navigate("/products")}
                className="mt-4 px-5 py-3 rounded-2xl bg-green-600 text-white font-bold"
              >
                Order Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {latestOrders.map((order, index) => (
                <div
                  key={order.orderId || index}
                  className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <h3 className="font-bold text-green-700">
                      Order #{order.orderId || index + 1}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.date || "-"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Status:{" "}
                      <span className="font-semibold text-blue-600">
                        {order.status || "Pending"}
                      </span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xl font-black text-green-700">
                      {formatMoney(order.totalAmount || order.total || 0)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.paymentMethod || "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color = "green" }) {
  const styles = {
    green: "border-green-100 text-green-700",
    blue: "border-blue-100 text-blue-700",
    orange: "border-orange-100 text-orange-600",
    emerald: "border-emerald-100 text-emerald-700",
    pink: "border-pink-100 text-pink-700",
  };

  return (
    <div className={`bg-white rounded-3xl p-5 shadow-lg border ${styles[color] || styles.green}`}>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-black mt-2">{value}</p>
    </div>
  );
}

function QuickCard({ icon, title, desc, color, onClick }) {
  const colorMap = {
    green: "border-green-100 text-green-700",
    blue: "border-blue-100 text-blue-700",
    orange: "border-orange-100 text-orange-600",
  };

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 shadow-lg border text-left hover:-translate-y-1 transition ${colorMap[color] || ""}`}
    >
      <div className="text-4xl">{icon}</div>
      <h2 className="text-xl font-black mt-3">{title}</h2>
      <p className="text-gray-500 mt-2 text-sm">{desc}</p>
    </button>
  );
}

function MiniInfoCard({ label, value, color }) {
  const styles = {
    green: "bg-green-50 border-green-100 text-green-800",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    yellow: "bg-yellow-50 border-yellow-100 text-yellow-700",
    purple: "bg-purple-50 border-purple-100 text-purple-700",
    pink: "bg-pink-50 border-pink-100 text-pink-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
  };

  return (
    <div className={`rounded-2xl border p-4 h-full ${styles[color] || styles.green}`}>
      <p className="text-xs sm:text-sm text-gray-500 font-medium">{label}</p>
      <h3 className="text-lg sm:text-xl font-black mt-1 break-words">{value}</h3>
    </div>
  );
}