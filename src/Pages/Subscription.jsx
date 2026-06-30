import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  isCustomerLoggedIn,
  setRedirectAfterLogin,
} from "../config/auth";
import { savePendingSubscription } from "../config/subscription";

export default function Subscription() {
  const navigate = useNavigate();

  const [product, setProduct] = useState("Cow Milk");
  const [qty, setQty] = useState("500ml");
  const [deliveryType, setDeliveryType] = useState("Daily");

  const startDate = useMemo(() => new Date(), []);
  const expireDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  }, []);

  const getRemainingDays = (date) => {
    if (!date) return 0;
    const today = new Date();
    const expiry = new Date(date);
    const diff = expiry - today;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

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

  const getMonthlyPrice = () => {
    const pricePerLiter = getPrice();
    const quantityFactor = qty === "500ml" ? 0.5 : 1;
    const days = deliveryType === "Daily" ? 30 : 15;
    return pricePerLiter * quantityFactor * days;
  };

  const pricePerSelectedQty = qty === "500ml" ? getPrice() / 2 : getPrice();

  const handleSubscribe = () => {
    const payload = {
      product,
      qty,
      deliveryType,
      monthlyAmount: getMonthlyPrice(),
      startDate: startDate.toISOString().split("T")[0],
      expireDate: expireDate.toISOString().split("T")[0],
      subscription: true,
    };

    if (!isCustomerLoggedIn()) {
      savePendingSubscription(payload);
      setRedirectAfterLogin("/subscription-checkout");
      navigate("/auth");
      return;
    }

    navigate("/subscription-checkout", { state: payload });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden bg-white rounded-[32px] shadow-xl border border-green-100 p-4 sm:p-6 md:p-8 lg:p-10">
          <span className="leaf leaf-1">🍃</span>
          <span className="leaf leaf-2">🌿</span>
          <span className="leaf leaf-3">🍃</span>
          <span className="leaf leaf-4">🌱</span>
          <span className="leaf leaf-5">🍃</span>

          <div className="relative z-10">
            {/* TITLE */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-green-100 bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 shadow-sm">
                <span>📅</span>
                <span>Monthly Dairy Subscription</span>
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-green-700">
                🥛 Milk Subscription
              </h1>

              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Choose your milk plan and continue to subscription checkout
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* LEFT SELECTIONS */}
              <div className="lg:col-span-2 space-y-6">
                {/* PRODUCTS */}
                <div className="bg-green-50 rounded-3xl p-4 sm:p-5 border border-green-100">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 text-green-800">
                    Choose Product
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setProduct("Cow Milk")}
                      className={`p-4 sm:p-5 rounded-2xl font-bold transition text-sm sm:text-base ${
                        product === "Cow Milk"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-white hover:bg-green-100 border border-green-100"
                      }`}
                    >
                      🐄 Cow Milk
                    </button>

                    <button
                      onClick={() => setProduct("Buffalo Milk")}
                      className={`p-4 sm:p-5 rounded-2xl font-bold transition text-sm sm:text-base ${
                        product === "Buffalo Milk"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-white hover:bg-green-100 border border-green-100"
                      }`}
                    >
                      🐃 Buffalo Milk
                    </button>

                    <button
                      onClick={() => setProduct("Fresh Curd")}
                      className={`p-4 sm:p-5 rounded-2xl font-bold transition text-sm sm:text-base ${
                        product === "Fresh Curd"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-white hover:bg-green-100 border border-green-100"
                      }`}
                    >
                      🥣 Fresh Curd
                    </button>
                  </div>
                </div>

                {/* QUANTITY */}
                <div className="bg-blue-50 rounded-3xl p-4 sm:p-5 border border-blue-100">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-800">
                    Quantity
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setQty("500ml")}
                      className={`p-4 sm:p-5 rounded-2xl font-bold transition ${
                        qty === "500ml"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white hover:bg-blue-100 border border-blue-100"
                      }`}
                    >
                      500 ml
                    </button>

                    <button
                      onClick={() => setQty("1L")}
                      className={`p-4 sm:p-5 rounded-2xl font-bold transition ${
                        qty === "1L"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white hover:bg-blue-100 border border-blue-100"
                      }`}
                    >
                      1 Liter
                    </button>
                  </div>
                </div>

                {/* DELIVERY */}
                <div className="bg-orange-50 rounded-3xl p-4 sm:p-5 border border-orange-100">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 text-orange-800">
                    Delivery Type
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setDeliveryType("Daily")}
                      className={`p-4 sm:p-5 rounded-2xl font-bold transition ${
                        deliveryType === "Daily"
                          ? "bg-orange-500 text-white shadow-lg"
                          : "bg-white hover:bg-orange-100 border border-orange-100"
                      }`}
                    >
                      Daily Delivery
                    </button>

                    <button
                      onClick={() => setDeliveryType("Alternate Day")}
                      className={`p-4 sm:p-5 rounded-2xl font-bold transition ${
                        deliveryType === "Alternate Day"
                          ? "bg-orange-500 text-white shadow-lg"
                          : "bg-white hover:bg-orange-100 border border-orange-100"
                      }`}
                    >
                      Alternate Day
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT SUMMARY */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-green-100 shadow-lg h-fit sticky top-24">
                <h2 className="text-2xl font-black text-green-700 mb-5">
                  Subscription Summary
                </h2>

                <div className="space-y-4 text-sm sm:text-base">
                  <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
                    <p className="text-gray-500">Product</p>
                    <p className="font-bold mt-1">{product}</p>
                  </div>

                  <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-bold mt-1">{qty}</p>
                  </div>

                  <div className="rounded-2xl bg-orange-50 p-4 border border-orange-100">
                    <p className="text-gray-500">Delivery Type</p>
                    <p className="font-bold mt-1">{deliveryType}</p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                    <p className="text-gray-500">Price / Selected Qty</p>
                    <p className="font-bold mt-1">₹{pricePerSelectedQty}</p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-bold mt-1">
                      {startDate.toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                    <p className="text-gray-500">Expire Date</p>
                    <p className="font-bold mt-1">
                      {expireDate.toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-yellow-50 p-4 border border-yellow-200">
                    <p className="text-gray-500">Remaining</p>
                    <p className="font-bold mt-1 text-orange-600">
                      {getRemainingDays(expireDate)} Days
                    </p>
                  </div>
                </div>

                <div className="border-t pt-5 mt-6">
                  <p className="text-3xl sm:text-4xl font-black text-green-700">
                    ₹{getMonthlyPrice()}
                    <span className="text-base sm:text-lg font-medium ml-2 text-gray-600">
                      / Month
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-6">
                  <button
                    onClick={() => navigate("/products")}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold"
                  >
                    ← Back To Products
                  </button>

                  <button
                    onClick={handleSubscribe}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}