import { useEffect, useState } from "react";

export default function AdminSubscriptions() {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

  const loadSubscriptions = async () => {
    try {
      const res = await fetch(
        `${SCRIPT_URL}?action=subscriptions`
      );
      const data = await res.json();

      const updatedData = Array.isArray(data)
        ? data.map((sub) => ({
            ...sub,
            computedStatus: getSubscriptionStatus(sub),
          }))
        : [];

      setSubscriptions(updatedData);
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const updateStatus = async (subscriptionId, status) => {
    try {
      setActionLoading(subscriptionId);

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "updateSubscriptionStatus",
          subscriptionId,
          status,
        }),
      });

      alert(`Subscription ${status} request sent`);

      // wait for Apps Script to update Google Sheet
      setTimeout(() => {
        loadSubscriptions();
        setActionLoading("");
      }, 2000);
    } catch (error) {
      console.error("Failed to update status:", error);
      setActionLoading("");
      alert("Failed to update subscription status");
    }
  };

  const renewSubscription = async (subscriptionId) => {
    try {
      setActionLoading(subscriptionId);

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "renewSubscription",
          subscriptionId,
        }),
      });

      alert("Renew request sent");

      setTimeout(() => {
        loadSubscriptions();
        setActionLoading("");
      }, 2000);
    } catch (error) {
      console.error("Failed to renew subscription:", error);
      setActionLoading("");
      alert("Failed to renew subscription");
    }
  };

  const filtered = subscriptions.filter((sub) =>
    (sub.customerName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalRevenue = subscriptions.reduce(
    (sum, sub) => sum + Number(sub.price || 0),
    0
  );

  const activeCount = subscriptions.filter(
    (s) => s.computedStatus === "Active"
  ).length;

  const pausedCount = subscriptions.filter(
    (s) => s.computedStatus === "Paused"
  ).length;

  const expiredCount = subscriptions.filter(
    (s) => s.computedStatus === "Expired"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-5xl font-black text-green-700 mb-8">
        Subscription Management
      </h1>

      {/* CARDS */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
          <p className="text-gray-600 font-semibold">Total Plans</p>
          <h2 className="text-4xl font-black text-green-600">
            {subscriptions.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
          <p className="text-gray-600 font-semibold">Active</p>
          <h2 className="text-4xl font-black text-blue-600">
            {activeCount}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
          <p className="text-gray-600 font-semibold">Paused</p>
          <h2 className="text-4xl font-black text-orange-600">
            {pausedCount}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
          <p className="text-gray-600 font-semibold">Expired</p>
          <h2 className="text-4xl font-black text-red-600">
            {expiredCount}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
          <p className="text-gray-600 font-semibold">
            Monthly Revenue
          </p>
          <h2 className="text-4xl font-black text-purple-600">
            ₹{totalRevenue}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search Customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-xl p-4 mb-6"
      />

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-xl p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-green-50 text-left">
              <th className="p-4">Customer</th>
              <th className="p-4">Product</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Monthly Bill</th>
              <th className="p-4">Start</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((sub) => {
              const status = sub.computedStatus;
              const isLoading =
                actionLoading === sub.subscriptionId;

              return (
                <tr
                  key={sub.subscriptionId}
                  className="border-b"
                >
                  <td className="p-4 font-medium">
                    {sub.customerName}
                  </td>

                  <td className="p-4">{sub.product}</td>

                  <td className="p-4">{sub.qty}</td>

                  <td className="p-4 font-bold text-green-600">
                    ₹{sub.price}
                  </td>

                  <td className="p-4">
                    {formatDate(sub.startDate)}
                  </td>

                  <td className="p-4">
                    {formatDate(sub.expireDate)}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white font-semibold ${
                        status === "Active"
                          ? "bg-green-500"
                          : status === "Paused"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="p-4">
                    {status === "Active" && (
                      <button
                        disabled={isLoading}
                        onClick={() =>
                          updateStatus(
                            sub.subscriptionId,
                            "Paused"
                          )
                        }
                        className="px-4 py-2 rounded-xl text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                      >
                        {isLoading ? "Updating..." : "Pause"}
                      </button>
                    )}

                    {status === "Paused" && (
                      <button
                        disabled={isLoading}
                        onClick={() =>
                          updateStatus(
                            sub.subscriptionId,
                            "Active"
                          )
                        }
                        className="px-4 py-2 rounded-xl text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        {isLoading ? "Updating..." : "Resume"}
                      </button>
                    )}

                    {status === "Expired" && (
                      <button
                        disabled={isLoading}
                        onClick={() =>
                          renewSubscription(
                            sub.subscriptionId
                          )
                        }
                        className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? "Updating..." : "Renew"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="p-6 text-center text-gray-500"
                >
                  No subscriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}