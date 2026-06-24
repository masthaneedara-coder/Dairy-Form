import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {

  const navigate =  useNavigate();

  const [cart, setCart] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "cart"
        )
      ) || []
    );

  const updateCart =
    (newCart) => {

      setCart(newCart);

      localStorage.setItem(
        "cart",
        JSON.stringify(newCart)
      );

    };

  const total = cart.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);

const totalItems = cart.reduce(
  (sum, item) => sum + item.qty,
  0
);

  return (

   <div className="max-w-7xl mx-auto p-6">
  <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
    Shopping Cart
  </h1>

  <div className="grid lg:grid-cols-3 gap-6">

    {/* Cart Items */}
    <div className="lg:col-span-2 space-y-4">
        {cart.length === 0 && (
            <div className="bg-white p-10 rounded-2xl text-center shadow">
                <h2 className="text-2xl font-bold text-gray-600">
                Your Cart Is Empty
                </h2>

                <button
                onClick={() => navigate("/products")}
                className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl"
                >
                Continue Shopping
                </button>
            </div>
            )}

      {cart.length > 0 &&
  cart.map((item, index) => (

        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between"
        >

          <div className="flex items-center gap-4">

            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-xl object-cover"
            />

            <div>
              <h2 className="font-bold text-xl">
                {item.name}
              </h2>

              <p className="text-gray-500">
                {item.size}
              </p>

              <p className="text-green-600 font-bold">
                ₹{item.price}
              </p>
            </div>

          </div>

         <div className="flex items-center gap-3">

            <button
                onClick={() => {
                const newCart = [...cart];

                if (newCart[index].qty > 1) {
                    newCart[index].qty -= 1;
                    updateCart(newCart);
                }
                }}
                className="bg-red-500 text-white w-8 h-8 rounded-full"
            >
                -
            </button>

            <span className="font-bold text-lg">
                {item.qty}
            </span>

            <button
                onClick={() => {
                const newCart = [...cart];
                newCart[index].qty += 1;
                updateCart(newCart);
                }}
                className="bg-green-500 text-white w-8 h-8 rounded-full"
            >
                +
            </button>

            <button
                onClick={() => {
                const newCart = cart.filter(
                    (_, i) => i !== index
                );
                updateCart(newCart);
                }}
                className="bg-red-600 text-white px-3 py-2 rounded-lg"
            >
                Remove
            </button>

            </div>

        </div>

      ))}

    </div>

    {/* Summary */}
    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">

      <h2 className="text-2xl font-bold mb-4">
        Order Summary
      </h2>

      <div className="flex justify-between mb-3">
        <span>Items</span>
        <span>{totalItems}</span>
      </div>

      <div className="flex justify-between mb-3">
        <span>Delivery</span>
        <span className="text-green-600">
          Free
        </span>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl"
        >
        Proceed To Checkout
    </button>

    </div>

  </div>
</div>

  );

}