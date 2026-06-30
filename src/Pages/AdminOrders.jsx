import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Components/AdminLayout";
import {
  fetchAllOrders,
  updateOrderStatus,
  fetchDeliveryBoys,
  assignDeliveryBoy,
} from "../config/api";

export default function AdminOrders() {
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deliveryBoys, setDeliveryBoys] = useState([]);
const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState({});
const loadDeliveryBoys = async () => {
  const data = await fetchDeliveryBoys();
  setDeliveryBoys(Array.isArray(data) ? data : []);
};

const handleAssign = async (order) => {
  try {
    const selected = selectedDeliveryBoy[order.orderId];

    if (!selected) {
      alert("Select a Delivery Boy");
      return;
    }

    const boy = deliveryBoys.find((d) => d.name === selected);

    if (!boy) {
      alert("Delivery Boy not found");
      return;
    }

    console.log("Assigning...", order.orderId, boy);

    const result = await assignDeliveryBoy(
      order.orderId,
      boy.name,
      boy.mobile
    );

    console.log("API Result:", result);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Delivery Boy Assigned Successfully");

    await loadOrders();
  } catch (err) {
    console.error("handleAssign Error:", err);
    alert(err.message);
  }
};
 const loadOrders = async () => {
  try {
    setLoading(true);

    const data = await fetchAllOrders();

    console.log("Orders:", data);

    if (Array.isArray(data)) {
      setOrders(data);
    } else if (Array.isArray(data.orders)) {
      setOrders(data.orders);
    } else {
      setOrders([]);
    }
  } catch (error) {
    console.error("Failed to load orders:", error);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  loadOrders();
  loadDeliveryBoys();
}, []);


  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();

    return orders.filter((order) => {
      const orderId = String(order.orderId || "").toLowerCase();
      const customerName = String(order.customerName || "").toLowerCase();
      const phone = String(order.phone || "").toLowerCase();
      const product = String(order.product || order.items || "").toLowerCase();
      const status = String(order.status || "Pending").toLowerCase();

      const matchesSearch =
        !q ||
        orderId.includes(q) ||
        customerName.includes(q) ||
        phone.includes(q) ||
        product.includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(
      (o) => String(o.status || "Pending").toLowerCase() === "pending"
    ).length;
    const assigned = orders.filter(
      (o) => String(o.status || "").toLowerCase() === "assigned"
    ).length;
    const outForDelivery = orders.filter(
      (o) => String(o.status || "").toLowerCase() === "out for delivery"
    ).length;
    const delivered = orders.filter(
      (o) => String(o.status || "").toLowerCase() === "delivered"
    ).length;

    return { total, pending, assigned, outForDelivery, delivered };
  }, [orders]);

 const updateStatusLocal = async (orderId, newStatus) => {
  try {
    const result = await updateOrderStatus(orderId, newStatus);

    if (!result.success) {
      alert(result.message);
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? { ...o, status: newStatus }
          : o
      )
    );
  } catch (err) {
    console.error(err);
    alert("Unable to update order.");
  }
};

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

  const formatMoney = (value) => {
    const num = Number(value || 0);
    if (Number.isNaN(num)) return "₹0";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const getStatusStyle = (status) => {
    const s = String(status || "").toLowerCase();

    if (s === "delivered") {
      return {
        badge: "bg-green-100 text-green-700 border border-green-200",
        dot: "bg-green-500",
      };
    }

    if (s === "out for delivery") {
      return {
        badge: "bg-blue-100 text-blue-700 border border-blue-200",
        dot: "bg-blue-500",
      };
    }

    if (s === "assigned") {
      return {
        badge: "bg-purple-100 text-purple-700 border border-purple-200",
        dot: "bg-purple-500",
      };
    }

    return {
      badge: "bg-orange-100 text-orange-700 border border-orange-200",
      dot: "bg-orange-500",
    };
  };

  const parseItems = (order) => {
    if (Array.isArray(order.items)) return order.items;
    if (typeof order.items === "string") {
      return order.items
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (order.product) {
      return [order.product];
    }
    return [];
  };
//   addNotification({
//   title: "Order Confirmed",
//   message: `Order ${order.orderId} has been confirmed.`,
//   type: "order",
//   priority: "high",
//   actionUrl: "/track-order",
// });
// addNotification({
//   title: "Delivery Partner Assigned",
//   message: `${deliveryBoyName} will deliver your order.`,
//   type: "delivery",
//   priority: "medium",
//   actionUrl: "/track-order",
// });

  return (
    <AdminLayout title="Orders Management">
      <div className="space-y-5 sm:space-y-6">
        {/* HERO */}
        <div className="rounded-[26px] sm:rounded-[30px] bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 p-4 sm:p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-white/80 text-xs sm:text-sm">Admin Order Control</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mt-1">
                📦 Orders Management
              </h1>
              <p className="text-white/90 mt-2 text-sm sm:text-base">
                View all orders, search customers and update delivery status.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-3">
              <button
                onClick={loadOrders}
                className="px-4 py-3 rounded-2xl bg-white text-blue-700 font-bold shadow text-sm sm:text-base"
              >
                Refresh Orders
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
          <StatCard title="Total" value={stats.total} color="blue" icon="📦" />
          <StatCard title="Pending" value={stats.pending} color="orange" icon="⏳" />
          <StatCard title="Assigned" value={stats.assigned} color="purple" icon="🛵" />
          <StatCard title="Out" value={stats.outForDelivery} color="sky" icon="🚚" />
          <StatCard title="Delivered" value={stats.delivered} color="green" icon="✅" />
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_auto] gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Search by order id / customer / phone / items"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadOrders}
                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold shadow"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="bg-slate-50 rounded-3xl p-10 text-center">
            <div className="text-5xl mb-3 animate-pulse">⏳</div>
            <p className="text-lg font-semibold text-slate-600">
              Loading orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-black text-slate-700">No orders found</h2>
            <p className="text-slate-500 mt-2">
              Try changing search or status filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order, index) => {
              const items = parseItems(order);
              const statusStyle = getStatusStyle(order.status || "Pending");

              return (
                <div
                  key={order.orderId || index}
                  className="bg-white rounded-3xl shadow-md border border-slate-100 p-4 sm:p-5 hover:shadow-xl transition"
                >
                  <div className="flex flex-col gap-4">
                    {/* TOP */}
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg sm:text-2xl font-black text-blue-700 break-all">
                            {order.orderId || `Order ${index + 1}`}
                          </h2>

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${statusStyle.badge}`}
                          >
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot}`}
                            ></span>
                            {order.status || "Pending"}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 mt-2">
                          Order Date: {formatDate(order.date)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-4 shadow">
                        <p className="text-xs sm:text-sm text-white/80">Order Amount</p>
                        <h3 className="text-2xl font-black mt-1">
                          {formatMoney(order.amount || order.totalAmount || order.total)}
                        </h3>
                      </div>
                    </div>

                    {/* CUSTOMER + ORDER INFO */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                      <InfoBox label="Customer" value={order.customerName || "-"} />
                      <InfoBox label="Phone" value={order.phone || "-"} />
                      <InfoBox label="Payment" value={order.paymentMethod || "-"} />
                      <InfoBox label="Area" value={order.area || "-"} />
                      <InfoBox label="Delivery Boy" value={order.deliveryBoy || "Not Assigned"}/>
                    </div>

                    {/* ADDRESS */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500 font-medium">Address</p>
                      <p className="text-slate-800 font-semibold mt-1 break-words">
                        {order.address || "-"}
                      </p>
                    </div>

                    {/* ITEMS */}
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <h3 className="text-lg sm:text-xl font-black text-slate-800">
                          Ordered Items
                        </h3>
                        <span className="text-sm text-slate-500">
                          {items.length} item{items.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {items.length === 0 ? (
                        <p className="text-slate-500">No item details available</p>
                      ) : (
                        <div className="grid gap-3">
                          {items.map((item, i) => (
                            <div
                              key={i}
                              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 flex items-start gap-3"
                            >
                              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black shrink-0">
                                {i + 1}
                              </div>
                              <p className="text-slate-800 font-semibold break-words">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* STATUS ACTIONS */}
                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-lg font-black text-slate-800">
                            Update Order Status
                          </h3>
                          <p className="text-sm text-slate-500">
                            Change the order progress for delivery tracking
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">

                          <label className="block font-semibold mb-2">
                            Delivery Boy
                          </label>

                          <select
                            value={selectedDeliveryBoy[order.orderId] || ""}
                            onChange={(e) =>
                              setSelectedDeliveryBoy((prev) => ({
                                ...prev,
                                [order.orderId]: e.target.value,
                              }))
                            }
                            className="w-full border rounded-xl p-3"
                          >
                            <option value="">Select Delivery Boy</option>

                            {deliveryBoys.map((boy) => (
                              <option key={boy.mobile} value={boy.name}>
                                {boy.name}
                              </option>
                            ))}
                          </select>

                        </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <button
                          onClick={() =>
                            updateStatusLocal(order.orderId, "Pending")
                          }
                          className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-semibold text-sm"
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => handleAssign(order)}
                          className=" bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold"
                        >
                          Assign Delivery Boy
                        </button>

                        <button
                          onClick={() =>
                            updateStatusLocal(order.orderId, "Out for Delivery")
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-semibold text-sm"
                        >
                          Out for Delivery
                        </button>

                        <button
                          onClick={() =>
                            updateStatusLocal(order.orderId, "Delivered")
                          }
                          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold text-sm"
                        >
                          Delivered
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
    
  );
}

function StatCard({ title, value, color = "blue", icon = "📦" }) {
  const styles = {
    blue: "border-blue-100 text-blue-700 bg-white",
    orange: "border-orange-100 text-orange-700 bg-white",
    purple: "border-purple-100 text-purple-700 bg-white",
    sky: "border-sky-100 text-sky-700 bg-white",
    green: "border-green-100 text-green-700 bg-white",
  };

  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 shadow-lg border ${styles[color] || styles.blue}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-slate-500 text-xs sm:text-sm">{title}</p>
          <h3 className="text-xl sm:text-3xl font-black mt-2 break-words">
            {value}
          </h3>
        </div>
        <div className="text-2xl sm:text-3xl shrink-0">{icon}</div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 min-w-0">
      <p className="text-xs sm:text-sm text-slate-500 font-medium">{label}</p>
      <h3 className="text-sm sm:text-lg font-black text-slate-800 mt-1 break-words">
        {value}
      </h3>
    </div>
  );
}