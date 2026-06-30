import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { placeOrder } from "../config/api";
import { getCart, getCartTotal, clearCart } from "../config/cart";
import {
  getCustomerName,
  getCustomerPhone,
  isCustomerLoggedIn,
} from "../config/auth";
import { PAYMENT_METHODS } from "../config/appConfig";
import { useNotifications } from "../context/NotificationContext";



export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.COD);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();
  

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      navigate("/auth");
      return;
    }

    const currentCart = getCart();

    if (!currentCart.length) {
      navigate("/cart");
      return;
    }

    setCart(currentCart);
    setCustomerName(getCustomerName());
    setPhone(getCustomerPhone());
  }, [navigate]);

  const total = useMemo(() => getCartTotal(), [cart]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [cart]
  );

  const handlePlaceOrder = async () => {
    if (!customerName || !phone || !address) {
      alert("Please fill customer name, phone and address");
      return;
    }

    if (!cart.length) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerName,
        phone,
        address,
        area,
        paymentMethod,
        items: cart.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          size: item.size,
        })),
        totalAmount: total,
      };

      const result = await placeOrder(payload);

      if (result.success) {
        if (paymentMethod === PAYMENT_METHODS.WHATSAPP) {
          const itemsText = cart
            .map(
              (item) =>
                `${item.name} (${item.size}) x ${item.qty} = ₹${
                  Number(item.price || 0) * Number(item.qty || 0)
                }`
            )
            .join("%0A");

          const msg =
            `Hello Farm Fresh Dairy,%0A%0A` +
            `New Order Request%0A` +
            `Name: ${customerName}%0A` +
            `Phone: ${phone}%0A` +
            `Address: ${address}%0A` +
            `Area: ${area}%0A%0A` +
            `Items:%0A${itemsText}%0A%0A` +
            `Total: ₹${total}%0A` +
            `Payment: WhatsApp`;

          // Replace with your business number
          const whatsappNumber = "91XXXXXXXXXX";
          window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");          
        }
        await addNotification({
          title: "Order Confirmed",
          message: "Your order has been placed successfully.",
          type: "order",
          priority: "high",
        });


        clearCart();
        alert("Order placed successfully");
        navigate("/order-history");
      } else {
        alert(result.message || "Order failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while placing order");
    } finally {
      setLoading(false);
    }
  };
  

   

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-green-700">
            💳 Checkout
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Complete your dairy order
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
          {/* LEFT FORM */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-5 sm:p-6">
            <h2 className="text-2xl font-black text-green-700 mb-5">
              Delivery Details
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-green-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-green-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Area
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full border border-green-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter area"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address
                </label>
                <textarea
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-green-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="House No, Street, Landmark..."
                />
              </div>
            </div>

            {/* PAYMENT */}
            <div className="mt-8">
              <h3 className="text-xl font-black text-green-700 mb-4">
                Payment Method
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod(PAYMENT_METHODS.COD)}
                  className={`p-4 rounded-2xl border font-bold transition ${
                    paymentMethod === PAYMENT_METHODS.COD
                      ? "bg-green-600 text-white border-green-600 shadow-lg"
                      : "bg-white border-green-200 text-gray-700 hover:bg-green-50"
                  }`}
                >
                  💵 Cash On Delivery
                </button>

                <button
                  onClick={() => setPaymentMethod(PAYMENT_METHODS.ONLINE)}
                  className={`p-4 rounded-2xl border font-bold transition ${
                    paymentMethod === PAYMENT_METHODS.ONLINE
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                      : "bg-white border-green-200 text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  💳 Online
                </button>

                <button
                  onClick={() => setPaymentMethod(PAYMENT_METHODS.WHATSAPP)}
                  className={`p-4 rounded-2xl border font-bold transition ${
                    paymentMethod === PAYMENT_METHODS.WHATSAPP
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-lg"
                      : "bg-white border-green-200 text-gray-700 hover:bg-emerald-50"
                  }`}
                >
                  💬 WhatsApp Order
                </button>
              </div>

              {paymentMethod === PAYMENT_METHODS.ONLINE && (
                <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
                  Razorpay / online payment integration can be connected here.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-black text-green-700 mb-5">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-green-50 border border-green-100 p-4"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-green-800 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.size} × {item.qty}
                      </p>
                      <p className="text-green-700 font-black mt-1">
                        ₹{Number(item.price || 0) * Number(item.qty || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>

              <hr />

              <div className="flex justify-between text-2xl font-black text-green-700">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || cart.length === 0}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold disabled:bg-gray-400"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold"
            >
              ← Back To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}