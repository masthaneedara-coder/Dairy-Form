import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const customerName = localStorage.getItem("customerName") || "";
  const customerPhone = localStorage.getItem("customerPhone") || "";
  const savedAddress = localStorage.getItem("customerAddress") || "";
  const savedArea = localStorage.getItem("customerArea") || "";

  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [address, setAddress] = useState(savedAddress);
  const [area, setArea] = useState(savedArea);
  const [paymentMethod, setPaymentMethod] = useState("whatsapp");
  const [loading, setLoading] = useState(false);

  const cart = useMemo(() => {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(raw) ? raw : [];
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const saveOrder = async () => {
    const orderPayload = {
      action: "placeOrder",
      customerName: name,
      phone,
      address,
      area,
      paymentMethod,
      total,
      items: cart,
      orderDate: new Date().toISOString(),
      status: "Pending",
    };

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(orderPayload),
    });

    return await response.json();
  };

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address || !area) {
      alert("Please fill customer details");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === "whatsapp") {
        const result = await saveOrder();

        if (!result.success) {
          alert(result.message || "Order failed");
          return;
        }

        const orderText = cart
          .map(
            (item) =>
              `${item.name} - ${item.size} - Qty: ${item.qty} - ₹${item.total}`
          )
          .join("\n");

        const message = `
Farm Fresh Dairy Order

Customer: ${name}
Phone: ${phone}
Address: ${address}
Area: ${area}

Items:
${orderText}

Total: ₹${total}
Payment: WhatsApp Order
        `;

        window.open(
          `https://wa.me/919989663837?text=${encodeURIComponent(message)}`,
          "_blank"
        );

        alert("Order placed successfully");
        localStorage.setItem("customerAddress", address);
        localStorage.setItem("customerArea", area);
        localStorage.removeItem("cart");
        navigate("/dashboard");
        return;
      }

      if (paymentMethod === "online") {
        if (!window.Razorpay) {
          alert("Razorpay not loaded");
          return;
        }

        const options = {
          key: "rzp_live_SryV51ja9BVho8",
          amount: total * 100,
          currency: "INR",
          name: "Farm Fresh Dairy",
          description: "Milk Order Payment",
          handler: async function () {
            try {
              const result = await saveOrder();

              if (!result.success) {
                alert(result.message || "Payment success, order save failed");
                return;
              }

              alert("Payment successful & order placed");
              localStorage.setItem("customerAddress", address);
              localStorage.setItem("customerArea", area);
              localStorage.removeItem("cart");
              navigate("/dashboard");
            } catch (err) {
              console.error(err);
              alert("Payment success, but order save failed");
            }
          },
          prefill: {
            name,
            contact: phone,
          },
          theme: {
            color: "#16a34a",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      if (paymentMethod === "cod") {
        const result = await saveOrder();

        if (!result.success) {
          alert(result.message || "Order failed");
          return;
        }

        alert("Order placed successfully");
        localStorage.setItem("customerAddress", address);
        localStorage.setItem("customerArea", area);
        localStorage.removeItem("cart");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-green-700">
            Checkout
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Review your order and complete payment
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-5">
                Customer Details
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                />

                <textarea
                  rows="4"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                />

                <input
                  type="text"
                  placeholder="Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-6">
              <h2 className="text-2xl font-bold mb-5">Payment Method</h2>

              <div className="space-y-4">
                <label className="flex items-start gap-3 border-2 rounded-2xl p-4 cursor-pointer hover:border-green-500">
                  <input
                    type="radio"
                    value="whatsapp"
                    checked={paymentMethod === "whatsapp"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-bold">📱 WhatsApp Order</h3>
                    <p className="text-sm text-gray-500">
                      Send order details on WhatsApp
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 border-2 rounded-2xl p-4 cursor-pointer hover:border-green-500">
                  <input
                    type="radio"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-bold">💳 Online Payment</h3>
                    <p className="text-sm text-gray-500">
                      Pay securely with Razorpay
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 border-2 rounded-2xl p-4 cursor-pointer hover:border-green-500">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-bold">💵 Cash On Delivery</h3>
                    <p className="text-sm text-gray-500">
                      Pay during delivery
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-6 h-fit">
            <h2 className="text-2xl font-bold text-green-700 mb-5">
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-gray-600">
                  Your cart is empty
                </h3>
                <button
                  onClick={() => navigate("/products")}
                  className="mt-5 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold"
                >
                  Go To Products
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[420px] overflow-auto pr-1">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 border border-gray-100 rounded-2xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-2xl object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold break-words">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.size} × {item.qty}
                        </p>
                        <p className="font-bold text-green-700 mt-1">
                          ₹{Number(item.price || 0) * Number(item.qty || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-2xl p-5 mt-6">
                  <div className="flex justify-between text-lg">
                    <span>Total Items</span>
                    <span className="font-semibold">{cart.length}</span>
                  </div>

                  <div className="flex justify-between text-2xl font-black text-green-700 mt-4 border-t pt-4">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`w-full mt-6 py-4 rounded-2xl font-bold text-white text-lg ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="w-full mt-3 py-3 rounded-2xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Back To Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}