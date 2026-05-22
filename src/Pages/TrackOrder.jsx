import { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

export default function TrackOrder() {

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(db, "orders"),
        (snapshot) => {

          const orderList = [];

          snapshot.forEach((doc) => {

            orderList.push({
              id: doc.id,
              ...doc.data(),
            });

          });

          setOrders(orderList);

        }
      );

    return () => unsubscribe();

  }, []);

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-black text-green-700 text-center">
        Live Order Tracking
      </h1>

      <p className="text-center text-gray-500 mt-4 text-xl">
        Track your milk delivery in real-time
      </p>

      <div className="max-w-5xl mx-auto mt-12 space-y-8">

        {orders.map((order) => (

          <div
            key={order.id}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >

            {/* TOP */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <h2 className="text-3xl font-black">
                  {order.product}
                </h2>

                <p className="text-gray-500 mt-2">
                  Customer:
                  {" "}
                  {order.customerName}
                </p>

                <p className="text-gray-500">
                  Qty:
                  {" "}
                  {order.quantity}L
                </p>

              </div>

              <div className="text-4xl font-black text-green-600">
                ₹{order.amount}
              </div>

            </div>

            {/* STATUS */}

            <div className="mt-8">

              <div className="flex flex-wrap gap-4">

                {[
                  "Order Placed",
                  "Preparing",
                  "Out For Delivery",
                  "Delivered",
                ].map((step, index) => {

                  const currentIndex = [

                    "Order Placed",
                    "Preparing",
                    "Out For Delivery",
                    "Delivered",

                  ].indexOf(order.status);

                  return (

                    <div
                      key={index}
                      className={`flex-1 min-w-[180px] rounded-2xl p-5 text-center border-2 ${
                        currentIndex >= index
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-gray-50 border-gray-200 text-gray-400"
                      }`}
                    >

                      <div className="text-4xl mb-3">

                        {step === "Order Placed"
                          ? "🧾"
                          : step === "Preparing"
                          ? "🥛"
                          : step === "Out For Delivery"
                          ? "🛵"
                          : "✅"}

                      </div>

                      <div className="font-black text-lg">
                        {step}
                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}