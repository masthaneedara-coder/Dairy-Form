import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
  const initialCart = Array.isArray(savedCart) ? savedCart : [];

  const [cart, setCart] = useState(initialCart);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* PAGE TITLE */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-green-700">
            🛒 Shopping Cart
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Review your selected dairy products
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.length === 0 && (
              <div className="bg-white p-8 sm:p-10 rounded-3xl text-center shadow-lg">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-600">
                  Your Cart Is Empty
                </h2>

                <button
                  onClick={() => navigate("/products")}
                  className="mt-5 bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {cart.length > 0 &&
              cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-md p-4 sm:p-5"
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
                          Total: ₹{Number(item.price || 0) * Number(item.qty || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Qty + Remove */}
                    <div className="flex flex-col sm:items-end gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const newCart = [...cart];
                            if (newCart[index].qty > 1) {
                              newCart[index].qty -= 1;
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

          {/* SUMMARY */}
          <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-5 text-green-700">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between text-2xl font-black text-green-700">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold disabled:bg-gray-400"
            >
              Proceed To Checkout
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}