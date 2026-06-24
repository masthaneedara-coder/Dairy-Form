import { useEffect, useState } from "react";

export default function TrackOrder() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // USE THE SAME APPS SCRIPT URL WHERE YOUR CURRENT Code.gs IS DEPLOYED
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  useEffect(() => {
    const phone = localStorage.getItem("customerPhone");

    if (!phone) {
      setLoading(false);
      return;
    }

    const loadTrackingData = async () => {
      try {
        const [subsRes, ordersRes] = await Promise.all([
          fetch(
            `${SCRIPT_URL}?action=subscriptions&phone=${encodeURIComponent(
              phone
            )}`
          ),
          fetch(
            `${SCRIPT_URL}?action=orders&phone=${encodeURIComponent(
              phone
            )}`
          ),
        ]);

        const subsData = await subsRes.json();
        const ordersData = await ordersRes.json();

        setSubscriptions(Array.isArray(subsData) ? subsData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        console.error("Failed to load tracking data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrackingData();
  }, []);

  const getOrderStep = (status) => {
    const normalized = (status || "").trim().toLowerCase();

    if (normalized === "delivered") return 4;
    if (normalized === "out for delivery") return 3;
    if (normalized === "assigned") return 2;
    return 1; // Pending / empty / any other initial state
  };

  const getStatusStyle = (status) => {
    const normalized = (status || "").trim().toLowerCase();

    if (normalized === "delivered") {
      return "bg-green-100 text-green-700";
    }

    if (normalized === "out for delivery") {
      return "bg-blue-100 text-blue-700";
    }

    if (normalized === "assigned") {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
          <div className="text-6xl mb-4">🚚</div>
          <h2 className="text-3xl font-bold text-gray-700">
            Loading your deliveries...
          </h2>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0 && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
          <div className="text-6xl mb-4">🚚</div>
          <h2 className="text-3xl font-bold text-gray-600">
            No Active Deliveries
          </h2>
          <p className="text-gray-500 mt-2">
            Your subscription deliveries and orders will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-green-700">
            🚚 Live Order Tracking
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Track your milk delivery in real time
          </p>
        </div>

        {/* Subscription Deliveries */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-green-700">
              🥛 Active Subscription Deliveries
            </h2>

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
              {subscriptions.length}
            </span>
          </div>

          {subscriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No Active Subscriptions
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {subscriptions.map((sub, index) => {
                const subStatus =
                  sub.computedStatus || sub.status || "Active";

                return (
                  <div
                    key={sub.subscriptionId || index}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-3xl p-6 shadow-lg"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">
                          🥛 {sub.product || "Milk Subscription"}
                        </h3>

                        <p className="mt-2">
                          Quantity: {sub.qty || "-"}
                        </p>

                        <p>
                          Delivery: {sub.deliveryType || "Daily"}
                        </p>

                        <p>
                          Expiry:{" "}
                          {sub.expireDate
                            ? new Date(sub.expireDate).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </p>
                      </div>

                      <span className="bg-white text-green-700 px-4 py-2 rounded-full font-bold whitespace-nowrap">
                        {subStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today's Orders */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-blue-700">
              🛒 Today&apos;s Orders
            </h2>

            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
              {orders.length}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No Orders Found
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {orders.map((order, index) => {
                const status = order.status || "Pending";
                const step = getOrderStep(status);

                return (
                  <div
                    key={order.orderId || index}
                    className="bg-white border rounded-3xl shadow-lg overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5">
                      <h3 className="text-2xl font-bold">
                        🥛 {order.product || "Milk"}
                      </h3>
                      <p className="text-sm mt-1">
                        Order ID: {order.orderId}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <div className="space-y-2 mb-5">
                        <p>
                          <strong>Qty:</strong> {order.qty}
                        </p>

                        <p>
                          <strong>Amount:</strong> ₹{order.amount}
                        </p>

                        <p className="flex items-center gap-2 flex-wrap">
                          <strong>Status:</strong>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </p>
                      </div>

                      {/* Progress Labels */}
                      <div className="flex justify-between text-xs font-medium mb-2 text-gray-600">
                        <span>Placed</span>
                        <span>Assigned</span>
                        <span>Delivery</span>
                        <span>Done</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex items-center">
                        {/* Step 1 */}
                        <div
                          className={`w-6 h-6 rounded-full ${
                            step >= 1 ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>

                        <div
                          className={`flex-1 h-1 ${
                            step >= 2 ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>

                        {/* Step 2 */}
                        <div
                          className={`w-6 h-6 rounded-full ${
                            step >= 2 ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>

                        <div
                          className={`flex-1 h-1 ${
                            step >= 3 ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>

                        {/* Step 3 */}
                        <div
                          className={`w-6 h-6 rounded-full ${
                            step >= 3 ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>

                        <div
                          className={`flex-1 h-1 ${
                            step >= 4 ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>

                        {/* Step 4 */}
                        <div
                          className={`w-6 h-6 rounded-full ${
                            step >= 4 ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}