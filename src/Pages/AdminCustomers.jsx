import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../Components/AdminLayout";
import { fetchAllCustomers } from "../config/api";

export default function AdminCustomers() {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwLKt8d5VcS_uGmzk7t16EdgE7Qpx4crtitjxC6QWyJLde3RWtJuwRvIWWX3bXIM9UM/exec";

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const [ordersRes, subscriptionsRes] = await Promise.all([
        fetch(`${SCRIPT_URL}?action=allOrders`),
        fetch(`${SCRIPT_URL}?action=allSubscriptions`),
      ]);

      const ordersData = await ordersRes.json();
      const subscriptionsData = await subscriptionsRes.json();

      const orders = Array.isArray(ordersData)
        ? ordersData
        : Array.isArray(ordersData?.orders)
        ? ordersData.orders
        : [];

      const subscriptions = Array.isArray(subscriptionsData)
        ? subscriptionsData
        : Array.isArray(subscriptionsData?.subscriptions)
        ? subscriptionsData.subscriptions
        : [];

      const customerMap = new Map();

      const getOrCreateCustomer = (phone, fallback = {}) => {
        const key = String(phone || "").trim();
        if (!key) return null;

        if (!customerMap.has(key)) {
          customerMap.set(key, {
            id: key,
            name: fallback.customerName || fallback.name || "Customer",
            phone: key,
            area: fallback.area || "-",
            address: fallback.address || "-",
            totalOrders: 0,
            totalSpent: 0,
            totalSubscriptions: 0,
            activeSubscriptions: 0,
            latestOrderDate: "",
            latestSubscriptionDate: "",
            orders: [],
            subscriptions: [],
          });
        }

        return customerMap.get(key);
      };

      // Build from orders
      orders.forEach((order) => {
        const phone = order.phone || order.mobile || "";
        const customer = getOrCreateCustomer(phone, order);
        if (!customer) return;

        customer.name =
          customer.name === "Customer"
            ? order.customerName || order.name || customer.name
            : customer.name;

        if (customer.area === "-" && order.area) customer.area = order.area;
        if (customer.address === "-" && order.address)
          customer.address = order.address;

        customer.totalOrders += 1;
        customer.totalSpent += Number(
          order.amount || order.totalAmount || order.total || 0
        );

        customer.orders.push(order);

        if (order.date) {
          if (
            !customer.latestOrderDate ||
            new Date(order.date).getTime() > new Date(customer.latestOrderDate).getTime()
          ) {
            customer.latestOrderDate = order.date;
          }
        }
      });

      // Build from subscriptions
      subscriptions.forEach((sub) => {
        const phone = sub.phone || sub.mobile || "";
        const customer = getOrCreateCustomer(phone, sub);
        if (!customer) return;

        customer.name =
          customer.name === "Customer"
            ? sub.customerName || sub.name || customer.name
            : customer.name;

        if (customer.area === "-" && sub.area) customer.area = sub.area;
        if (customer.address === "-" && sub.address)
          customer.address = sub.address;

        customer.totalSubscriptions += 1;

        const status = String(sub.status || "Active").toLowerCase();
        if (status === "active") {
          customer.activeSubscriptions += 1;
        }

        customer.subscriptions.push(sub);

        const subDate = sub.date || sub.startDate || "";
        if (subDate) {
          if (
            !customer.latestSubscriptionDate ||
            new Date(subDate).getTime() >
              new Date(customer.latestSubscriptionDate).getTime()
          ) {
            customer.latestSubscriptionDate = subDate;
          }
        }
      });

      const finalCustomers = Array.from(customerMap.values()).sort((a, b) => {
        const aTime = new Date(a.latestOrderDate || a.latestSubscriptionDate || 0).getTime();
        const bTime = new Date(b.latestOrderDate || b.latestSubscriptionDate || 0).getTime();
        return bTime - aTime;
      });

      setCustomers(finalCustomers);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const name = String(customer.name || "").toLowerCase();
      const phone = String(customer.phone || "").toLowerCase();
      const area = String(customer.area || "").toLowerCase();

      const matchesSearch =
        !q || name.includes(q) || phone.includes(q) || area.includes(q);

      const matchesType =
        filterType === "All" ||
        (filterType === "Subscribed" && customer.totalSubscriptions > 0) ||
        (filterType === "Only Orders" &&
          customer.totalOrders > 0 &&
          customer.totalSubscriptions === 0) ||
        (filterType === "Active Subscription" &&
          customer.activeSubscriptions > 0);

      return matchesSearch && matchesType;
    });
  }, [customers, search, filterType]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const orderedCustomers = customers.filter((c) => c.totalOrders > 0).length;
    const subscribedCustomers = customers.filter(
      (c) => c.totalSubscriptions > 0
    ).length;
    const activeSubscribers = customers.filter(
      (c) => c.activeSubscriptions > 0
    ).length;
    const totalRevenue = customers.reduce(
      (sum, c) => sum + Number(c.totalSpent || 0),
      0
    );

    return {
      totalCustomers,
      orderedCustomers,
      subscribedCustomers,
      activeSubscribers,
      totalRevenue,
    };
  }, [customers]);

  const formatMoney = (value) => {
    const num = Number(value || 0);
    if (Number.isNaN(num)) return "₹0";
    return `₹${num.toLocaleString("en-IN")}`;
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

  return (
    <AdminLayout title="Customers">
      <div className="space-y-5 sm:space-y-6">
        {/* HERO */}
        <div className="rounded-[26px] sm:rounded-[30px] bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 p-4 sm:p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-white/80 text-xs sm:text-sm">
                Admin Customer Control
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mt-1">
                👥 Customers Management
              </h1>
              <p className="text-white/90 mt-2 text-sm sm:text-base">
                View customer orders, subscriptions, spending and active members.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-3">
              <button
                onClick={loadCustomers}
                className="px-4 py-3 rounded-2xl bg-white text-emerald-700 font-bold shadow text-sm sm:text-base"
              >
                Refresh Customers
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
          <StatCard title="Customers" value={stats.totalCustomers} color="green" icon="👥" />
          <StatCard title="Ordered" value={stats.orderedCustomers} color="blue" icon="📦" />
          <StatCard title="Subscribed" value={stats.subscribedCustomers} color="purple" icon="🥛" />
          <StatCard title="Active" value={stats.activeSubscribers} color="emerald" icon="✅" />
          <StatCard title="Revenue" value={formatMoney(stats.totalRevenue)} color="orange" icon="💰" />
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_auto] gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Search Customer
              </label>
              <input
                type="text"
                placeholder="Search by name / phone / area"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm sm:text-base outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Customer Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm sm:text-base outline-none focus:border-green-500"
              >
                <option value="All">All</option>
                <option value="Subscribed">Subscribed</option>
                <option value="Only Orders">Only Orders</option>
                <option value="Active Subscription">Active Subscription</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadCustomers}
                className="w-full lg:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-bold shadow"
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
              Loading customers...
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-black text-slate-700">
              No customers found
            </h2>
            <p className="text-slate-500 mt-2">
              Try changing search or customer type filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCustomers.map((customer, index) => (
              <div
                key={customer.id || index}
                className="bg-white rounded-3xl shadow-md border border-slate-100 p-4 sm:p-5 hover:shadow-xl transition"
              >
                <div className="flex flex-col gap-4">
                  {/* TOP */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-2xl sm:text-3xl font-bold shrink-0">
                        👤
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-800 break-words">
                          {customer.name || "Customer"}
                        </h2>
                        <p className="text-slate-500 mt-1 break-all">
                          {customer.phone || "-"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {customer.activeSubscriptions > 0 && (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-bold border border-emerald-200">
                              Active Subscriber
                            </span>
                          )}
                          {customer.totalSubscriptions > 0 && (
                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs sm:text-sm font-bold border border-purple-200">
                              Subscription Customer
                            </span>
                          )}
                          {customer.totalOrders > 0 && (
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold border border-blue-200">
                              Ordered Customer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-4 shadow w-full sm:w-auto">
                      <p className="text-xs sm:text-sm text-white/80">
                        Total Spent
                      </p>
                      <h3 className="text-2xl font-black mt-1">
                        {formatMoney(customer.totalSpent)}
                      </h3>
                    </div>
                  </div>

                  {/* CUSTOMER SUMMARY */}
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                    <InfoBox label="Area" value={customer.area || "-"} />
                    <InfoBox label="Orders" value={customer.totalOrders || 0} />
                    <InfoBox
                      label="Subscriptions"
                      value={customer.totalSubscriptions || 0}
                    />
                    <InfoBox
                      label="Active Plans"
                      value={customer.activeSubscriptions || 0}
                    />
                  </div>

                  {/* ADDRESS */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500 font-medium">Address</p>
                    <p className="text-slate-800 font-semibold mt-1 break-words">
                      {customer.address || "-"}
                    </p>
                  </div>

                  {/* TIMELINE INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500 font-medium">
                        Latest Order
                      </p>
                      <p className="text-slate-800 font-bold mt-1">
                        {formatDate(customer.latestOrderDate)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500 font-medium">
                        Latest Subscription
                      </p>
                      <p className="text-slate-800 font-bold mt-1">
                        {formatDate(customer.latestSubscriptionDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, color = "green", icon = "👥" }) {
  const styles = {
    green: "border-green-100 text-green-700 bg-white",
    blue: "border-blue-100 text-blue-700 bg-white",
    purple: "border-purple-100 text-purple-700 bg-white",
    emerald: "border-emerald-100 text-emerald-700 bg-white",
    orange: "border-orange-100 text-orange-700 bg-white",
  };

  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 shadow-lg border ${styles[color] || styles.green}`}
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