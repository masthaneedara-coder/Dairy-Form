import { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function DeliveryBoy() {

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {

    const fetchOrders =
      async () => {

      const querySnapshot =
        await getDocs(
          collection(db, "orders")
        );

      const orderList = [];

      querySnapshot.forEach((doc) => {

        orderList.push({
          id: doc.id,
          ...doc.data(),
        });

      });

      setOrders(orderList);

    };

    fetchOrders();

  }, []);

  const markDelivered =
    async (id) => {

    try {

      await updateDoc(
        doc(db, "orders", id),
        {
          status: "Delivered",
        }
      );

      setOrders(
        orders.map((order) =>
          order.id === id
            ? {
                ...order,
                status: "Delivered",
              }
            : order
        )
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-green-50 p-10">

      <h1 className="text-5xl font-black text-green-700 text-center">
        Delivery Partner Panel
      </h1>

      <div className="max-w-6xl mx-auto mt-12 space-y-8">

        {orders.map((order) => (

          <div
            key={order.id}
            className="bg-white rounded-3xl shadow-lg p-8"
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              {/* CUSTOMER */}

              <div>

                <h2 className="text-3xl font-black">
                  {order.customerName}
                </h2>

                <p className="text-gray-500 mt-2">
                  {order.mobile}
                </p>

                <p className="text-gray-500">
                  {order.address}
                </p>

              </div>

              {/* ORDER */}

              <div>

                <p className="text-xl font-bold">
                  {order.product}
                </p>

                <p className="text-gray-500 mt-2">
                  Qty:
                  {" "}
                  {order.quantity}L
                </p>

                <p className="text-green-600 font-black text-2xl mt-2">
                  ₹{order.amount}
                </p>

              </div>

              {/* STATUS */}

              <div className="flex flex-col gap-4">

                <div className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold text-center">

                  {order.status}

                </div>

                <button
                  onClick={() =>
                    markDelivered(order.id)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold"
                >
                  Mark Delivered
                </button>

                <a
                  href={`tel:${order.mobile}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-center"
                >
                  Call Customer
                </a>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}