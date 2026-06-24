import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Subscription() {
   const navigate = useNavigate();
   const startDate = new Date();
const expireDate = new Date();
expireDate.setDate(
  expireDate.getDate() + 30
);
const getRemainingDays = (expireDate) => {

  if (!expireDate) return 0;

  const today = new Date();

  const expiry =
    new Date(expireDate);

  const diff =
    expiry - today;

  return Math.max(
    0,
    Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    )
  );

};
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const [product, setProduct] =
    useState("Cow Milk");

  const [qty, setQty] =
  useState("500ml");

  const [deliveryType, setDeliveryType] =
    useState("Daily");

  const [loading, setLoading] =
    useState(false);
  // const [subscriptions,  setSubscriptions] =  useState([]);
  

  const getPrice = () => {

    switch (product) {

      case "Cow Milk":
        return 70;

      case "Buffalo Milk":
        return 90;

      case "Fresh Curd":
        return 50;

      default:
        return 60;

    }

  };
//  useEffect(() => {

//   const phone =
//     localStorage.getItem(
//       "customerPhone"
//     );

//   fetch(
//     `${SCRIPT_URL}?action=orders&phone=${phone}`
//   )
//     .then((res) => res.json())
//     .then((data) => setOrders(data));

// }, []);
 const getMonthlyPrice = () => {

  const pricePerLiter =
    getPrice();

  const quantityFactor =
    qty === "500ml"
      ? 0.5
      : 1;

  const days =
    deliveryType ===
    "Daily"
      ? 30
      : 15;

  return (
    pricePerLiter *
    quantityFactor *
    days
  );

};

  const subscribe = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(
          SCRIPT_URL,
          {
            method: "POST",
            body: JSON.stringify({

              action:
                "addSubscription",

              customerName:
                localStorage.getItem(
                  "customerName"
                ),

              phone:
                localStorage.getItem(
                  "customerPhone"
                ),

              product,
              qty,

             price: getMonthlyPrice(),

              deliveryType     
              


            })
            
          }
        );

      const result =
        await response.json();

      if (result.success) {

        alert(
          "Subscription Created Successfully"
        );

      } else {

        alert(
          "Subscription Failed"
        );

      }

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl p-10">

          <h1 className="text-5xl font-black text-center text-green-700 mb-10">

            🥛 Milk Subscription

          </h1>

          {/* PRODUCTS */}

          <h2 className="text-xl font-bold mb-4">

            Choose Product

          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-8">

            <button
              onClick={() =>
                setProduct(
                  "Cow Milk"
                )
              }
              className={`p-5 rounded-2xl font-bold transition ${
                product ===
                "Cow Milk"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              🐄 Cow Milk
            </button>

            <button
              onClick={() =>
                setProduct(
                  "Buffalo Milk"
                )
              }
              className={`p-5 rounded-2xl font-bold transition ${
                product ===
                "Buffalo Milk"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              🐃 Buffalo Milk
            </button>

            <button
              onClick={() =>
                setProduct(
                  "Fresh Curd"
                )
              }
              className={`p-5 rounded-2xl font-bold transition ${
                product ===
                "Fresh Curd"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              🥣 Fresh Curd
            </button>

          </div>

          {/* QUANTITY */}

          <h2 className="text-xl font-bold mb-4">

  Quantity

            </h2>

            <div className="grid grid-cols-2 gap-4 mb-10">

              <button
                onClick={() =>
                  setQty("500ml")
                }
                className={`p-5 rounded-2xl font-bold ${
                  qty === "500ml"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                500 ml
              </button>

              <button
                onClick={() =>
                  setQty("1L")
                }
                className={`p-5 rounded-2xl font-bold ${
                  qty === "1L"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                1 Liter
              </button>

            </div>

          {/* DELIVERY */}

          <h2 className="text-xl font-bold mb-4">

            Delivery Type

          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-10">

            <button
              onClick={() =>
                setDeliveryType(
                  "Daily"
                )
              }
              className={`p-5 rounded-2xl font-bold ${
                deliveryType ===
                "Daily"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              Daily Delivery
            </button>

            <button
              onClick={() =>
                setDeliveryType(
                  "Alternate Day"
                )
              }
              className={`p-5 rounded-2xl font-bold ${
                deliveryType ===
                "Alternate Day"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              Alternate Day
            </button>

          </div>

          {/* SUMMARY */}

          <div className="bg-green-50 rounded-3xl p-8 mb-10">

            <h2 className="text-3xl font-black text-green-700 mb-5">

              Subscription Summary

            </h2>

            <div className="space-y-3 text-lg">

              <p>
                Product:
                <strong>
                  {" "}
                  {product}
                </strong>
              </p>

              <p>
                Quantity:
                <strong>
                  {" "}
                  {qty}
                </strong>
              </p>

              <p>
                Delivery:
                <strong>
                  {" "}
                  {deliveryType}
                </strong>
              </p>

              <p>
                Price Per Liter:
                <strong>
                  Price:
                    ₹{
                      qty === "500ml"
                        ? getPrice() / 2
                        : getPrice()
                    }
                </strong>
              </p>
              <p>
                Start Date:
                {new Date(
                  startDate
                ).toLocaleDateString()}
              </p>

              <p>
                Expire Date:
                {new Date(
                  expireDate
                ).toLocaleDateString()}
              </p>

              <p className="text-orange-600 font-bold">
                Remaining:
                {getRemainingDays(
                  expireDate
                )} Days
              </p>

              <div className="border-t pt-5 mt-5">

                <p className="text-4xl font-black text-green-700">

                 ₹{getMonthlyPrice()}

                  <span className="text-lg font-medium ml-2">

                    / Month

                  </span>

                </p>

              </div>

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={() =>
              navigate("/subscription-checkout", {
                state: {
                  product,
                  qty,
                  deliveryType,
                  monthlyAmount: getMonthlyPrice(),
                  startDate: startDate.toISOString().split("T")[0],
                  expireDate: expireDate.toISOString().split("T")[0],
                  subscription: true,
                },
              })
            }
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold"
          >
            Subscribe Now
          </button>

        </div>

      </div>

    </div>

  );

}