import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const getSavedCart = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      return Array.isArray(savedCart) ? savedCart : [];
    } catch {
      return [];
    }
  };

  const getSavedSubscription = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("subscriptionCart") || "null"
      );
      return saved || null;
    } catch {
      return null;
    }
  };

  const [cart, setCart] = useState(getSavedCart());
  const [subscription, setSubscription] = useState(getSavedSubscription());

  useEffect(() => {
    setCart(getSavedCart());
    setSubscription(getSavedSubscription());
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeSubscription = () => {
    localStorage.removeItem("subscriptionCart");
    setSubscription(null);
  };

  const productTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.qty || 0),
        0
      ),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [cart]
  );

  const subscriptionTotal = Number(subscription?.monthlyAmount || 0);
  const grandTotal = productTotal + subscriptionTotal;

  const isCartEmpty = cart.length === 0 && !subscription;

  const handleProceedCheckout = () => {
    if (isCartEmpty) return;

    const isLoggedIn = localStorage.getItem("customerLogin") === "true";

    if (!isLoggedIn) {
      localStorage.setItem("afterLoginRedirect", "/checkout");
      navigate("/auth");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp .7s ease forwards; }
      `}</style>

      <div className="max-w-7xl mx-auto animate-fadeUp">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-green-700">
            🛒 Shopping Cart
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Review your selected dairy products and subscriptions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-5">
            {isCartEmpty && (
              <div className="bg-white p-8 sm:p-10 rounded-3xl text-center shadow-lg">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-600">
                  Your Cart Is Empty
                </h2>

                <div className="grid sm:grid-cols-2 gap-3 mt-5">
                  <button
                    onClick={() => navigate("/products")}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Continue Shopping
                  </button>

                  <button
                    onClick={() => navigate("/subscription")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Add Subscription
                  </button>
                </div>
              </div>
            )}

            {/* PRODUCT ITEMS */}
            {cart.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  Product Items
                </h2>

                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-3xl shadow-md p-4 sm:p-5 border border-green-100"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover flex-shrink-0"
                          />

                          <div className="min-w-0">
                            <h2 className="font-bold text-lg sm:text-xl break-words">
                              {item.name}
                            </h2>

                            <p className="text-gray-500 mt-1">
                              Size: {item.size || "1L"}
                            </p>

                            <p className="text-green-600 font-bold text-lg mt-1">
                              ₹{item.price}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Total: ₹
                              {Number(item.price || 0) * Number(item.qty || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                const newCart = [...cart];
                                if (newCart[index].qty > 1) {
                                  newCart[index].qty -= 1;
                                  newCart[index].total =
                                    Number(newCart[index].price || 0) *
                                    Number(newCart[index].qty || 0);
                                  updateCart(newCart);
                                }
                              }}
                              className="bg-red-500 text-white w-10 h-10 rounded-full text-xl font-bold"
                            >
                              -
                            </button>

                            <span className="font-bold text-lg min-w-[28px] text-center">
                              {item.qty}
                            </span>

                            <button
                              onClick={() => {
                                const newCart = [...cart];
                                newCart[index].qty += 1;
                                newCart[index].total =
                                  Number(newCart[index].price || 0) *
                                  Number(newCart[index].qty || 0);
                                updateCart(newCart);
                              }}
                              className="bg-green-500 text-white w-10 h-10 rounded-full text-xl font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const newCart = cart.filter((_, i) => i !== index);
                              updateCart(newCart);
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold w-full sm:w-auto"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBSCRIPTION ITEM */}
            {subscription && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  Subscription
                </h2>

                <div className="bg-white rounded-3xl shadow-md p-5 sm:p-6 border border-blue-100">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="inline-flex bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-3">
                        Monthly Subscription
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                        {subscription.product}
                      </h3>

                      <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm sm:text-base">
                        <div className="bg-gray-50 rounded-2xl p-3">
                          <p className="text-gray-500">Quantity</p>
                          <p className="font-bold">{subscription.qty}</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-3">
                          <p className="text-gray-500">Delivery</p>
                          <p className="font-bold">{subscription.deliveryType}</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-3">
                          <p className="text-gray-500">Start Date</p>
                          <p className="font-bold">{subscription.startDate}</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-3">
                          <p className="text-gray-500">Expire Date</p>
                          <p className="font-bold">{subscription.expireDate}</p>
                        </div>
                      </div>

                      <p className="text-2xl font-black text-blue-700 mt-5">
                        ₹{subscription.monthlyAmount}
                        <span className="text-sm text-gray-500 ml-2">
                          / Month
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={removeSubscription}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold h-fit"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            {!isCartEmpty && (
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/products")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() => navigate("/subscription")}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-2xl font-semibold"
                >
                  Add / Change Subscription
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-6 h-fit sticky top-24 border border-green-100">
            <h2 className="text-2xl font-bold mb-5 text-green-700">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Product Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span>Product Total</span>
                <span className="font-semibold">₹{productTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Subscription</span>
                <span className="font-semibold">
                  {subscription ? `₹${subscriptionTotal}` : "₹0"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between text-2xl font-black text-green-700">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleProceedCheckout}
              disabled={isCartEmpty}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold disabled:bg-gray-400"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}