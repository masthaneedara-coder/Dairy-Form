import { useEffect, useState } from "react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

export default function AdminBilling() {

  const [bills, setBills] =
    useState([]);

  const loadBills = () => {

    fetch(
      `${SCRIPT_URL}?action=getAllBills`
    )
      .then((res) => res.json())
      .then((data) =>
        setBills(data)
      );

  };

  useEffect(() => {

    loadBills();

  }, []);
  const generateBills =
  async () => {

    await fetch(
      SCRIPT_URL,
      {
        method: "POST",
        body: JSON.stringify({

          action:
            "generateBills"

        })
      }
    );

    alert(
      "Bills Generated"
    );

    loadBills();

  };

  const markPaid = async (
    billId
  ) => {

    await fetch(
      SCRIPT_URL,
      {
        method: "POST",
        body: JSON.stringify({

          action:
            "markBillPaid",

          billId

        }),
      }
    );

    loadBills();

  };

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-5xl font-black text-green-700 text-center mb-10">

        Monthly Billing

      </h1>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <button
            onClick={
                generateBills
            }
            className="bg-green-600 text-white px-6 py-3 rounded-xl mb-6"
            >

            Generate Monthly Bills

            </button>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-4">
                Bill ID
              </th>

              <th className="text-left p-4">
                Customer
              </th>

              <th className="text-left p-4">
                Phone
              </th>

              <th className="text-left p-4">
                Month
              </th>

              <th className="text-left p-4">
                Amount
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {bills.map((bill) => (

              <tr
                key={bill.billId}
                className="border-b"
              >

                <td className="p-4">
                  {bill.billId}
                </td>

                <td className="p-4">
                  {bill.customerName}
                </td>

                <td className="p-4">
                  {bill.phone}
                </td>

                <td className="p-4">
                  {bill.month}
                </td>

                <td className="p-4">
                  ₹{bill.totalAmount}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full ${
                      bill.status ===
                      "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {bill.status}

                  </span>

                </td>

                <td className="p-4">

                  {bill.status !==
                    "Paid" && (

                    <button
                      onClick={() =>
                        markPaid(
                          bill.billId
                        )
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-xl"
                    >

                      Mark Paid

                    </button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}