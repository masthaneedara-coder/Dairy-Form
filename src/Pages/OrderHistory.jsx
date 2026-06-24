import { useState, useEffect } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  useEffect(() => {
    const phone = localStorage.getItem("customerPhone");

    if (!phone) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        const res = await fetch(
          `${SCRIPT_URL}?action=orders&phone=${encodeURIComponent(phone)}`
        );

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const totalOrders = orders.length;

  const deliveredCount = orders.filter(
    (o) =>
      (o.status || "").toLowerCase() === "delivered"
  ).length;

  const pendingCount = orders.filter((o) => {
    const status = (o.status || "").toLowerCase();
    return status === "pending" || status === "";
  }).length;

  const assignedCount = orders.filter(
    (o) =>
      (o.status || "").toLowerCase() === "assigned"
  ).length;

  const outForDeliveryCount = orders.filter(
    (o) =>
      (o.status || "").toLowerCase() ===
      "out for delivery"
  ).length;

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const normalized = (status || "").toLowerCase();

    if (normalized === "delivered") {
      return "bg-green-500";
    }

    if (normalized === "out for delivery") {
      return "bg-blue-500";
    }

    if (normalized === "assigned") {
      return "bg-purple-500";
    }

    return "bg-orange-500";
  };

  const getStatusText = (status) => {
    if (!status || status === "") return "Pending";
    return status;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* PAGE TITLE */}
        <h1 className="text-5xl font-black text-center text-green-700 mb-10">
          📦 My Orders
        </h1>

        {/* CUSTOMER CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-700">
                {localStorage.getItem("customerName") || "Customer"}
              </h2>

              <p className="text-gray-500">
                {localStorage.getItem("customerPhone") || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-green-600 text-white rounded-3xl p-6 shadow-lg">
            <p className="text-lg">Total Orders</p>
            <h2 className="text-4xl font-black mt-2">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-orange-500 text-white rounded-3xl p-6 shadow-lg">
            <p className="text-lg">Pending</p>
            <h2 className="text-4xl font-black mt-2">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-purple-600 text-white rounded-3xl p-6 shadow-lg">
            <p className="text-lg">Assigned</p>
            <h2 className="text-4xl font-black mt-2">
              {assignedCount}
            </h2>
          </div>

          <div className="bg-blue-600 text-white rounded-3xl p-6 shadow-lg">
            <p className="text-lg">Out for Delivery</p>
            <h2 className="text-4xl font-black mt-2">
              {outForDeliveryCount + deliveredCount}
            </h2>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-600">
              Loading Orders...
            </h2>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-600">
              No Orders Found
            </h2>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {orders.map((order, index) => (
              <div
                key={order.orderId || index}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-green-700">
                      🥛 {order.product || "Milk"}
                    </h2>

                    <p className="text-gray-500 mt-1 break-all">
                      {order.orderId}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-white font-bold whitespace-nowrap ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Quantity
                    </p>

                    <h3 className="font-bold text-lg">
                      {order.qty}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">
                      Amount
                    </p>

                    <h3 className="font-bold text-lg text-green-700">
                      ₹{order.amount}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Order Date
                  </p>

                  <p className="font-semibold">
                    {formatDate(order.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}