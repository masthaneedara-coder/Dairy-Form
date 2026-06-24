import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [renewingId, setRenewingId] = useState(null);

  // ---------------- FETCH ORDERS ----------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await fetch(`${SCRIPT_URL}?action=allOrders`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  // ---------------- FETCH SUBSCRIPTIONS ----------------
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoadingSubs(true);
        const res = await fetch(`${SCRIPT_URL}?action=subscriptions`);
        const data = await res.json();
        setSubscriptions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        setSubscriptions([]);
      } finally {
        setLoadingSubs(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // ---------------- ORDER STATUS UPDATE ----------------
  const updateStatus = async (orderId, status) => {
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "updateStatus",
          orderId,
          status,
        }),
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  // ---------------- DATE HELPERS ----------------
  const getRemainingDays = (expireDate) => {
    if (!expireDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expireDate);
    expiry.setHours(0, 0, 0, 0);

    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const subscriptionsWithStatus = useMemo(() => {
    return subscriptions.map((sub) => {
      const remainingDays = getRemainingDays(sub.expireDate);

      let status = "Active";
      if (remainingDays < 0) {
        status = "Expired";
      } else if (remainingDays <= 5) {
        status = "Expiring Soon";
      }

      return {
        ...sub,
        remainingDays,
        planStatus: status,
        isExpired: remainingDays < 0,
      };
    });
  }, [subscriptions]);

  // ---------------- RENEW SUBSCRIPTION ----------------
  const renewSubscription = async (sub) => {
    try {
      setRenewingId(sub.subscriptionId);

      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 30);

      const expireDate = newDate.toISOString().split("T")[0];

      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "renewSubscription",
          subscriptionId: sub.subscriptionId,
          expireDate,
          status: "Active",
        }),
      });

      setSubscriptions((prev) =>
        prev.map((item) =>
          item.subscriptionId === sub.subscriptionId
            ? {
                ...item,
                expireDate,
                status: "Active",
              }
            : item
        )
      );

      alert("Subscription renewed successfully");
    } catch (error) {
      console.error("Error renewing subscription:", error);
      alert("Failed to renew subscription");
    } finally {
      setRenewingId(null);
    }
  };

  // ---------------- FILTER ORDERS ----------------
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = String(order.customerName || "").toLowerCase();
      const phone = String(order.phone || "").toLowerCase();
      const query = search.toLowerCase();

      return customer.includes(query) || phone.includes(query);
    });
  }, [orders, search]);

  // ---------------- DASHBOARD COUNTS ----------------
  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.amount || 0),
    0
  );

  const deliveredCount = orders.filter(
    (o) => String(o.status || "").trim().toLowerCase() === "delivered"
  ).length;

  const pendingCount = orders.filter(
    (o) => String(o.status || "").trim().toLowerCase() !== "delivered"
  ).length;

  const activePlans = subscriptionsWithStatus.filter(
    (s) => s.planStatus === "Active"
  ).length;

  const expiredPlans = subscriptionsWithStatus.filter(
    (s) => s.planStatus === "Expired"
  ).length;

  const expiringSoon = subscriptionsWithStatus.filter(
    (s) => s.planStatus === "Expiring Soon"
  ).length;

  // ---------------- UI HELPERS ----------------
  const getStatusBadge = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "expired") {
      return "bg-red-100 text-red-700";
    }
    if (value === "expiring soon") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-green-700">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage orders, subscriptions, products, customers and delivery
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-5 md:p-6 text-white shadow-xl">
          <p className="text-sm opacity-90">Total Orders</p>
          <h2 className="text-3xl md:text-4xl font-black mt-2">
            {orders.length}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-5 md:p-6 text-white shadow-xl">
          <p className="text-sm opacity-90">Revenue</p>
          <h2 className="text-3xl md:text-4xl font-black mt-2">
            ₹{revenue}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-emerald-500 rounded-3xl p-5 md:p-6 text-white shadow-xl">
          <p className="text-sm opacity-90">Delivered</p>
          <h2 className="text-3xl md:text-4xl font-black mt-2">
            {deliveredCount}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl p-5 md:p-6 text-white shadow-xl">
          <p className="text-sm opacity-90">Pending</p>
          <h2 className="text-3xl md:text-4xl font-black mt-2">
            {pendingCount}
          </h2>
        </div>
      </div>

      {/* SUBSCRIPTION CARDS */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-green-100">
          <h3 className="text-lg font-bold text-gray-700">Active Plans</h3>
          <p className="text-5xl font-black mt-3 text-green-600">
            {activePlans}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-red-100">
          <h3 className="text-lg font-bold text-gray-700">Expired Plans</h3>
          <p className="text-5xl font-black mt-3 text-red-500">
            {expiredPlans}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-yellow-100">
          <h3 className="text-lg font-bold text-gray-700">Expiring Soon</h3>
          <p className="text-5xl font-black mt-3 text-yellow-500">
            {expiringSoon}
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => navigate("/admin-customers")}
          className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 transition font-semibold"
        >
          👥 Customers
        </button>

        <button
          onClick={() => navigate("/admin/subscriptions")}
          className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 transition font-semibold"
        >
          🥛 Subscriptions
        </button>

        <button
          onClick={() => navigate("/admin-products")}
          className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 transition font-semibold"
        >
          📦 Products
        </button>

        <button
          onClick={() => navigate("/delivery-management")}
          className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 transition font-semibold"
        >
          🚚 Delivery
        </button>

        <Link
          to="/admin-delivery-report"
          className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 transition text-center font-semibold flex items-center justify-center"
        >
          📋 Daily Report
        </Link>
      </div>

      {/* SUBSCRIPTION MANAGEMENT */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-green-700">
              Subscription Management
            </h2>
            <p className="text-gray-500 mt-1">
              View active, expiring and expired customer plans
            </p>
          </div>
        </div>

        {loadingSubs ? (
          <div className="text-center py-10 text-gray-500">
            Loading subscriptions...
          </div>
        ) : subscriptionsWithStatus.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No subscriptions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-green-50 text-gray-700">
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Start Date</th>
                  <th className="p-3 text-left">Expiry Date</th>
                  <th className="p-3 text-left">Days Left</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {subscriptionsWithStatus.map((sub, index) => (
                  <tr
                    key={sub.subscriptionId || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-semibold">
                      {sub.customerName || "-"}
                    </td>
                    <td className="p-4">{sub.phone || "-"}</td>
                    <td className="p-4">
                      {sub.product ||
                        sub.planName ||
                        sub.plan ||
                        sub.subscriptionType ||
                        "-"}
                    </td>
                    <td className="p-4">{sub.startDate || "-"}</td>
                    <td className="p-4">{sub.expireDate || "-"}</td>
                    <td className="p-4">
                      {sub.remainingDays < 0 ? 0 : sub.remainingDays}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusBadge(
                          sub.planStatus
                        )}`}
                      >
                        {sub.planStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => renewSubscription(sub)}
                        disabled={renewingId === sub.subscriptionId}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-60"
                      >
                        {renewingId === sub.subscriptionId
                          ? "Renewing..."
                          : "Renew"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER MANAGEMENT */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-blue-700">
              Order Management
            </h2>
            <p className="text-gray-500 mt-1">
              Search customer orders and update delivery status
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer or phone..."
            className="border border-gray-200 rounded-xl px-4 py-3 w-full md:w-80 outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        {loadingOrders ? (
          <div className="text-center py-10 text-gray-500">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-blue-50 text-gray-700">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Qty</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.orderId || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">{order.date || "-"}</td>
                    <td className="p-4 font-semibold">
                      {order.customerName || "-"}
                    </td>
                    <td className="p-4">{order.phone || "-"}</td>
                    <td className="p-4">{order.product || "-"}</td>
                    <td className="p-4">{order.qty || "-"}</td>
                    <td className="p-4 font-bold text-green-600">
                      ₹{order.amount || 0}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) =>
                          updateStatus(order.orderId, e.target.value)
                        }
                        className="px-3 py-2 rounded-xl border outline-none"
                      >
                        <option>Pending</option>
                        <option>Preparing</option>
                        <option>Out For Delivery</option>
                        <option>Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}