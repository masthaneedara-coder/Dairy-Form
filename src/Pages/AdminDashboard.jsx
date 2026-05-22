import { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchOrders =
      async () => {

      try {

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

      } catch (error) {

        console.log(error);

      }

      setLoading(false);

    };

    fetchOrders();

  }, []);

  const totalRevenue =
    orders.reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );

    const chartData = [

  {
    name: "Cow Milk",
    sales: orders.filter(
      (o) =>
        o.product ===
        "Cow Milk"
    ).length,
  },

  {
    name: "Buffalo Milk",
    sales: orders.filter(
      (o) =>
        o.product ===
        "Buffalo Milk"
    ).length,
  },

  {
    name: "Fresh Curd",
    sales: orders.filter(
      (o) =>
        o.product ===
        "Fresh Curd"
    ).length,
  },

];
    const updateOrderStatus =
  async (id, status) => {

  try {

    await updateDoc(
      doc(db, "orders", id),
      {
        status: status,
      }
    );

    setOrders(
      orders.map((order) =>
        order.id === id
          ? {
              ...order,
              status: status,
            }
          : order
      )
    );

  } catch (error) {

    console.log(error);

  }

};

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-black text-green-700">
        Admin Dashboard
      </h1>

      {/* TOP CARDS */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white rounded-3xl p-8 shadow-lg">

          <h2 className="text-2xl font-black">
            Total Orders
          </h2>

          <p className="text-5xl font-black text-green-600 mt-5">
            {orders.length}
          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">

          <h2 className="text-2xl font-black">
            Revenue
          </h2>

          <p className="text-5xl font-black text-blue-600 mt-5">
            ₹{totalRevenue}
          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">

          <h2 className="text-2xl font-black">
            Customers
          </h2>

          <p className="text-5xl font-black text-orange-500 mt-5">
            {orders.length}
          </p>

        </div>

      </div>
      {/* ANALYTICS */}

<div className="bg-white rounded-3xl p-8 shadow-lg mt-10">

  <h2 className="text-3xl font-black text-gray-800 mb-8">
    Product Sales Analytics
  </h2>

  <div className="h-[400px]">

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <BarChart data={chartData}>

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="sales"
          fill="#16a34a"
          radius={[10, 10, 0, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>

      {/* ORDERS TABLE */}

      <div className="bg-white rounded-3xl p-8 shadow-lg mt-10">

        <h2 className="text-3xl font-black text-gray-800">
          Recent Orders
        </h2>

        {loading ? (

          <p className="mt-6">
            Loading Orders...
          </p>

        ) : (

          <div className="overflow-x-auto mt-8">

            <table className="w-full">

              <thead>

                <tr className="border-b text-left">

                  <th className="py-4">
                    Customer
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Qty
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b"
                  >

                    <td className="py-5">

                      <div className="font-bold">
                        {order.customerName}
                      </div>

                      <div className="text-gray-500 text-sm">
                        {order.mobile}
                      </div>

                    </td>

                    <td>
                      {order.product}
                    </td>

                    <td>
                      {order.quantity}L
                    </td>

                    <td className="font-bold text-green-600">
                      ₹{order.amount}
                    </td>

                    <td>

                        <select
                            value={order.status}
                            onChange={(e) =>
                            updateOrderStatus(
                                order.id,
                                e.target.value
                            )
                            }
                            className="border rounded-xl px-4 py-2 font-bold"
                        >

                            <option>
                            Order Placed
                            </option>

                            <option>
                            Preparing
                            </option>

                            <option>
                            Out For Delivery
                            </option>

                            <option>
                            Delivered
                            </option>

                            <option>
                            Cancelled
                            </option>

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