import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDeliveryName,
  isDeliveryLoggedIn,
  logoutDelivery,
} from "../config/auth";

import {
  fetchTodayDeliveries,
  updateOrderStatus,
} from "../config/api";

export default function DeliveryDashboard() {
  const navigate = useNavigate();

useEffect(() => {
  if (!isDeliveryLoggedIn()) {
    navigate("/delivery-login");
  }
   loadDeliveries();
}, [navigate]);

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logoutDelivery();
    navigate("/");
  };
  useEffect(() => {

    const load = async () => {

        if (!isDeliveryLoggedIn()) {
            navigate("/delivery-login");
            return;
        }

        setLoading(true);

        const data = await fetchTodayDeliveries();
        

        setDeliveries(data);

        setLoading(false);

    };

    load();

}, []);
const loadDeliveries = async () => {
  try {
    setLoading(true);

    const deliveryBoy = getDeliveryName();

    const data = await fetchTodayDeliveries(deliveryBoy);

    setDeliveries(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
    setDeliveries([]);
  } finally {
    setLoading(false);
  }
};
// addNotification({
//   title: "Out for Delivery",
//   message: "Your milk is on the way.",
//   type: "delivery",
//   priority: "high",
//   actionUrl: "/track-order",
// });
// addNotification({
//   title: "Delivered Successfully",
//   message: "Thank you for choosing Farm Fresh Dairy.",
//   type: "delivery",
//   priority: "medium",
//   actionUrl: "/order-history",
// });
// addNotification({
//   title: "Payment Successful",
//   message: `₹${amount} payment received successfully.`,
//   type: "payment",
//   priority: "high",
//   actionUrl: "/order-history",
// });

const markDelivered = async (delivery) => {
  console.log("Delivery Object:", delivery);
  console.log("orderId:", delivery.orderId);
  console.log("refId:", delivery.refId);

  try {
    const res = await updateOrderStatus(
      delivery.orderId || delivery.refId,
      "Delivered"
    );

    console.log(res);

    if (res.success) {
      await loadDeliveries();
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.error(err);
    alert("Unable to update delivery.");
  }
};
const filteredDeliveries = deliveries.filter((d) => {
  const q = search.toLowerCase().trim();

  return (
    String(d.customerName || "")
      .toLowerCase()
      .includes(q) ||

    String(d.phone || "")
      .includes(q) ||

    String(d.area || "")
      .toLowerCase()
      .includes(q)
  );
});

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="rounded-[32px] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 p-6 sm:p-8 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-white/80 text-sm sm:text-base">Delivery Panel</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-1">
                🚚 Welcome {getDeliveryName()}
              </h1>
              <p className="mt-2 text-white/90">
                Manage today’s milk deliveries and customer drop points
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-3xl p-5 shadow-lg border border-orange-100">
            <p className="text-gray-500 text-sm">Today Deliveries</p>
            <p className="text-3xl font-black text-orange-600 mt-2">
              {deliveries.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-lg border border-green-100">
            <p className="text-gray-500 text-sm">Delivered</p>
            <p className="text-3xl font-black text-green-700 mt-2">
              {deliveries.filter((d) => d.status === "Delivered").length}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-lg border border-blue-100">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-3xl font-black text-blue-700 mt-2">
              {deliveries.filter((d) => d.status !== "Delivered").length}
            </p>
          </div>
        </div>
        
        
        <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full border rounded-xl p-3"
         />
            

        {/* DELIVERY LIST */}
        <div className="mt-6 bg-white rounded-3xl shadow-lg border border-orange-100 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-orange-600 mb-5">
            Today Delivery List
          </h2>
          

          <div className="space-y-4"> 
                       
            {filteredDeliveries.map((delivery, index) => (
              <div
                key={delivery.orderId ||  delivery.refId || 
                   `${delivery.customerName}-${delivery.phone}-${index}`}
                className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-gray-800">
                    {delivery.customerName}
                  </h3>
                  <p className="text-gray-600">📞 {delivery.phone}</p>
                  <p className="text-gray-600">📍 {delivery.address}</p>
                  <p className="text-gray-600">🥛 {delivery.items}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <span
                    className={`px-4 py-2 rounded-full font-bold text-sm ${
                      delivery.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {delivery.status}
                  </span>

                  <button
                    onClick={() =>
                      updateStatusLocal(delivery, "Out for Delivery")
                    }
                  >
                    Out for Delivery
                  </button>

                  <button
                    onClick={() =>
                      updateStatusLocal(delivery, "Delivered")
                    }
                  >
                    Delivered
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a
                    href={`tel:${delivery.phone}`}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                  >
                    📞 Call
                  </a>

                  <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    delivery.address
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  🗺 Navigate
                </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROUTE / NOTES */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
            <div className="text-4xl">🗺️</div>
            <h2 className="text-xl font-black text-blue-700 mt-3">
              Delivery Areas
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Dammaiguda, ECIL, Kapra, Rampally, Parimal Nagar
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100">
            <div className="text-4xl">⏰</div>
            <h2 className="text-xl font-black text-green-700 mt-3">
              Morning Delivery Slot
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Daily milk delivery from 5:30 AM to 8:30 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}