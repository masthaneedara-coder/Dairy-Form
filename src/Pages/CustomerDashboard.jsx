import { useEffect, useState } from "react";

import { db } from "../firebase";


import {
  collection,
  getDocs,
} from "firebase/firestore";


export default function CustomerDashboard() {
    

    const subscriptionProducts = [

  {
    name: "Cow Milk",
    price: 60,
  },

  {
    name: "Buffalo Milk",
    price: 80,
  },

  {
    name: "Fresh Curd",
    price: 120,
  },

  {
    name: "Paneer",
    price: 350,
  },

];
const [orderHistory] = useState([
  {
    id: 1,
    product: "Buffalo Milk",
    qty: 2,
    amount: 160,
    status: "Delivered",
    date: "12 May 2026",
  },

  {
    id: 2,
    product: "Cow Milk",
    qty: 1,
    amount: 60,
    status: "Delivered",
    date: "11 May 2026",
  },

  {
    id: 3,
    product: "Fresh Curd",
    qty: 1,
    amount: 120,
    status: "Processing",
    date: "10 May 2026",
  },
]);
const subscriptions = [

  {
    product: "Cow Milk",
    quantity: "2 Liters",
    status: "Active",
  },

  {
    product: "Buffalo Milk",
    quantity: "1 Liter",
    status: "Paused",
  },

];
const upcomingDays = [

  {
    day: "Monday",
    status: "Milk Delivery",
  },

  {
    day: "Tuesday",
    status: "Milk Delivery",
  },

  {
    day: "Wednesday",
    status: "Paused",
  },

  {
    day: "Thursday",
    status: "Milk Delivery",
  },

];
const [notifications, setNotifications] =
  useState([
    {
      id: 1,
      title: "Milk Delivered",
      message:
        "Your Buffalo Milk was delivered successfully.",
      type: "success",
    },

    {
      id: 2,
      title: "Wallet Low",
      message:
        "Recharge wallet to continue delivery.",
      type: "warning",
    },

    {
      id: 3,
      title: "Subscription Active",
      message:
        "Your Family Plan is active.",
      type: "info",
    },
  ]);
  const deliverySteps = [
  "Preparing",
  "Out For Delivery",
  "Reached Nearby",
  "Delivered",
];
  const [deliveryStatus, setDeliveryStatus] =
    useState("Preparing");
const monthlyBill = 2450;
const [walletBalance,
  setWalletBalance] =
  useState(500);

  const [orders, setOrders] =
    useState([]);

  const customerPhone =
    localStorage.getItem(
      "customerPhone"
    );
    

  useEffect(() => {

    const fetchOrders =
      async () => {

      try {

        const querySnapshot =
          await getDocs(
            collection(db, "orders")
          );

        const customerOrders = [];

        querySnapshot.forEach((doc) => {

          const data =
            doc.data();

          if (
            data.mobile ===
            customerPhone
          ) {

            customerOrders.push({
              id: doc.id,
              ...data,
            });

          }

        });

        setOrders(
          customerOrders
        );

      } catch (error) {

        console.log(error);

      }

    };

    fetchOrders();

  }, []);

  const totalSpent =
    orders.reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );
    const handleLogout = () => {

  localStorage.removeItem(
    "customerLogin"
  );

  localStorage.removeItem(
    "customerName"
  );

  localStorage.removeItem(
    "customerPhone"
  );

  window.location.href =
    "/auth";

};

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-black text-green-700 text-center">
        Customer Dashboard
      </h1>
    <div className="flex items-start justify-between mb-10 ">

  <div >    

    <p className="text-gray-500 mt-3 text-xl" >

      Welcome,
      {" "}
      {localStorage.getItem(
        "customerName"
      )}

    </p>

  </div>

  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold"
  >

    Logout

  </button>

</div>

{/* ACTION BUTTONS */}

<div className="flex flex-wrap gap-5 mt-10">

  <button
  onClick={() => {

            window.location.href =
            "/#products";

        }}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold"
        >

        🥛 Order Milk

    </button>

  <button
        onClick={() => {

            window.location.href =
            "/#subscriptions";

        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold"
        >

        📦 Subscription Plans

   </button>

  <button
    onClick={() => {
      window.location.href =
        "/track-order";
    }}
    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold"
  >

    🚚 Track Orders

  </button>

</div>
<section id="subscriptions" className="py-20 bg-gray-50">

  <div className="max-w-6xl mx-auto px-6">

    <h2 className="text-5xl font-black text-center text-green-700">
      My Subscriptions
    </h2>
    <div className="mt-10 flex flex-wrap gap-4 justify-center">

            {subscriptionProducts.map((product) => (

                <button
                key={product.name}
                onClick={() => addSubscription(product)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
                >
                + Add {product.name}
                </button>

            ))}

            </div>
    <div className="grid md:grid-cols-3 gap-6 mb-12">

  <div className="bg-white rounded-3xl p-8 shadow-lg">

  <h3 className="text-2xl font-black text-gray-700">
    Wallet Balance
  </h3>

  <p className="text-5xl font-black text-green-600 mt-4">
    ₹{walletBalance}
  </p>

  {/* RECHARGE BUTTONS */}

  <div className="mt-8 flex flex-wrap gap-3">

    <button
      onClick={() => rechargeWallet(500)}
      className="bg-green-600 text-white px-5 py-3 rounded-2xl font-bold"
    >
      + ₹500
    </button>

    <button
      onClick={() => rechargeWallet(1000)}
      className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold"
    >
      + ₹1000
    </button>

    <button
      onClick={() => rechargeWallet(2000)}
      className="bg-purple-600 text-white px-5 py-3 rounded-2xl font-bold"
    >
      + ₹2000
    </button>

  </div>

</div>

  <div className="bg-white rounded-3xl p-8 shadow-lg">
    <h3 className="text-2xl font-black text-gray-700">
      Monthly Bill
    </h3>

    <p className="text-5xl font-black text-blue-600 mt-4">
      ₹{monthlyBill}
    </p>
  </div>

  <div className="bg-white rounded-3xl p-8 shadow-lg">
    <h3 className="text-2xl font-black text-gray-700">
      Active Plans
    </h3>

    <p className="text-5xl font-black text-orange-500 mt-4">
      {subscriptions.length}
    </p>
  </div>

</div>
{/* DELIVERY CALENDAR */}

<div className="bg-white rounded-3xl p-8 shadow-lg mb-10">

  <div className="flex items-center justify-between flex-wrap gap-4">

    <div>

      <h3 className="text-3xl font-black text-gray-800">
        Delivery Calendar
      </h3>

      <p className="text-gray-500 mt-2">
        Upcoming milk delivery schedule
      </p>

    </div>

    <div className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
      Active Deliveries
    </div>

  </div>

  {/* DAYS */}

  <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mt-10">

    {upcomingDays.map((item, index) => (

      <div
        key={index}
        className="rounded-3xl border border-green-100 p-5 text-center bg-green-50"
      >

        <div className="text-gray-500 font-semibold">
          {item.day}
        </div>

        <div className="text-4xl font-black text-green-700 mt-3">
          {item.date}
        </div>

        <div className="mt-4 text-sm font-bold text-green-600">
          Delivery
        </div>

      </div>

    ))}

  </div>

</div>
{/* NOTIFICATIONS */}

<div className="bg-white rounded-3xl p-8 shadow-lg mb-10">

  <div className="flex items-center justify-between flex-wrap gap-4">

    <div>

      <h3 className="text-3xl font-black text-gray-800">
        Notifications
      </h3>

      <p className="text-gray-500 mt-2">
        Recent updates and alerts
      </p>

    </div>

    <div className="bg-orange-100 text-orange-700 px-5 py-3 rounded-full font-bold">
      {notifications.length} Alerts
    </div>

  </div>

  {/* LIST */}

  <div className="mt-10 space-y-5">

    {notifications.map((note) => (

      <div
        key={note.id}
        className={`rounded-3xl p-6 flex items-start gap-5 border ${
          note.type === "success"
            ? "bg-green-50 border-green-100"
            : note.type === "warning"
            ? "bg-yellow-50 border-yellow-100"
            : "bg-blue-50 border-blue-100"
        }`}
      >

        {/* ICON */}

        <div className="text-4xl">

          {note.type === "success"
            ? "✅"
            : note.type === "warning"
            ? "⚠️"
            : "🔔"}

        </div>

        {/* CONTENT */}

        <div>

          <h4 className="text-2xl font-black text-gray-800">
            {note.title}
          </h4>

          <p className="text-gray-600 mt-2 text-lg">
            {note.message}
          </p>

        </div>

      </div>

    ))}

  </div>

</div>
{/* DELIVERY TRACKING */}

<div className="bg-white rounded-3xl p-8 shadow-lg mb-10">

  <div className="flex items-center justify-between flex-wrap gap-4">

    <div>

      <h3 className="text-3xl font-black text-gray-800">
        Delivery Tracking
      </h3>

      <p className="text-gray-500 mt-2">
        Live milk delivery updates
      </p>

    </div>

    <div className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
      {deliveryStatus}
    </div>

  </div>

  {/* DELIVERY BOY */}

  <div className="mt-8 bg-green-50 rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

    <div>

      <h4 className="text-2xl font-black text-gray-800">
        Ravi Kumar
      </h4>

      <p className="text-gray-600 mt-2">
        Delivery Partner
      </p>

      <p className="text-gray-600 mt-1">
        Bike: TS09AB1234
      </p>

    </div>

    <div className="text-green-600 font-black text-2xl">
      ETA: 6:30 AM
    </div>

  </div>

  {/* TRACKING STEPS */}

  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">

    {deliverySteps.map((step, index) => (

      <div
        key={index}
        className={`rounded-3xl p-5 text-center border-2 ${
          deliverySteps.indexOf(
            deliveryStatus
          ) >= index
            ? "bg-green-100 border-green-500 text-green-700"
            : "bg-gray-50 border-gray-200 text-gray-400"
        }`}
      >

        <div className="text-4xl mb-3">

          {step === "Preparing"
            ? "🥛"
            : step ===
              "Out For Delivery"
            ? "🛵"
            : step ===
              "Reached Nearby"
            ? "📍"
            : "✅"}

        </div>

        <div className="font-black text-lg">
          {step}
        </div>

      </div>

    ))}

  </div>

</div>
{/* ORDER HISTORY */}

<div className="bg-white rounded-3xl p-8 shadow-lg mb-10">

  <div className="flex items-center justify-between flex-wrap gap-4">

    <div>

      <h3 className="text-3xl font-black text-gray-800">
        Order History
      </h3>

      <p className="text-gray-500 mt-2">
        Recent milk delivery orders
      </p>

    </div>

    <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-full font-bold">
      {orderHistory.length} Orders
    </div>

  </div>

  {/* HISTORY LIST */}

  <div className="mt-10 space-y-5">

    {orderHistory.map((order) => (

      <div
        key={order.id}
        className="border border-gray-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
      >

        {/* LEFT */}

        <div>

          <h4 className="text-2xl font-black text-gray-800">
            {order.product}
          </h4>

          <p className="text-gray-500 mt-2">
            Quantity: {order.qty}L
          </p>

          <p className="text-gray-500 mt-1">
            {order.date}
          </p>

        </div>

        {/* CENTER */}

        <div className="text-3xl font-black text-green-600">
          ₹{order.amount}
        </div>

        {/* STATUS */}

        <div
          className={`px-5 py-3 rounded-full font-bold text-center ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status}
        </div>

      </div>

    ))}

  </div>

</div>

    <div className="mt-12 space-y-6">

      {subscriptions.map((sub) => (

        <div
          key={sub.id}
          className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >

          {/* DETAILS */}

          <div className="mt-5 space-y-3">

              <div className="flex items-center justify-between border-b pb-3">

                <span className="text-gray-500 font-semibold">
                  Price Per Liter
                </span>

                <span className="font-black text-green-600 text-xl">
                  ₹{sub.price}
                </span>

              </div>

              <div className="flex items-center justify-between border-b pb-3">

                <span className="text-gray-500 font-semibold">
                  Daily Quantity
                </span>

                <span className="font-black text-xl">
                  {sub.qty}L
                </span>

              </div>

              <div className="flex items-center justify-between border-b pb-3">

                <span className="text-gray-500 font-semibold">
                  Monthly Estimate
                </span>

                <span className="font-black text-blue-600 text-xl">
                  ₹{sub.qty * sub.price * 30}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500 font-semibold">
                  Delivery Slot
                </span>

                <span className="font-black text-orange-500 text-xl">
                  {sub.slot}
                </span>

              </div>

            </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-4">

            {/* CHANGE QTY */}

            <button
                onClick={() => {
                    setSubscriptions(
                    subscriptions.map((item) =>
                        item.id === sub.id
                        ? {
                            ...item,
                            skipTomorrow:
                                !item.skipTomorrow,
                            }
                        : item
                    )
                    );
                }}
                className={`px-6 py-3 rounded-2xl font-bold text-white ${
                    sub.skipTomorrow
                    ? "bg-red-500"
                    : "bg-green-600"
                }`}
                >
                {sub.skipTomorrow
                    ? "Delivery Skipped"
                    : "Skip Tomorrow"}
                </button>

            {/* PAUSE / RESUME */}

            <button
              onClick={() => {
                setSubscriptions(
                  subscriptions.map((item) =>
                    item.id === sub.id
                      ? {
                          ...item,
                          status:
                            item.status === "Active"
                              ? "Paused"
                              : "Active",
                        }
                      : item
                  )
                );
              }}
              className="bg-yellow-500 text-white px-6 py-3 rounded-2xl font-bold"
            >
              {sub.status === "Active"
                ? "Pause"
                : "Resume"}
            </button>
            <button
                onClick={() => {

                    const confirmDelete = window.confirm(
                    `Remove ${sub.product} subscription?`
                    );

                    if (!confirmDelete) return;

                    setSubscriptions(
                    subscriptions.filter(
                        (item) => item.id !== sub.id
                    )
                    );

                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold"
                >
                Cancel Plan
                </button>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>
      {/* TOP CARDS */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white rounded-3xl p-8 shadow-lg">

          <h2 className="text-2xl font-black">
            My Orders
          </h2>

          <p className="text-5xl font-black text-green-600 mt-5">
            {orders.length}
          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">

          <h2 className="text-2xl font-black">
            Total Spent
          </h2>

          <p className="text-5xl font-black text-blue-600 mt-5">
            ₹{totalSpent}
          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">

          <h2 className="text-2xl font-black">
            Active Subscriptions
          </h2>

          <p className="text-5xl font-black text-orange-500 mt-5">
            {orders.length}
          </p>

        </div>

      </div>

      {/* ORDERS */}

      <div className="bg-white rounded-3xl p-8 shadow-lg mt-10">

        <h2 className="text-3xl font-black text-gray-800">
          My Orders
        </h2>

        <div className="mt-8 space-y-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="border rounded-3xl p-6"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                  <h3 className="text-2xl font-black">
                    {order.product}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Qty:
                    {" "}
                    {order.quantity}L
                  </p>

                </div>

                <div className="text-3xl font-black text-green-600">
                  ₹{order.amount}
                </div>

                <div className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">

                  {order.status}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}