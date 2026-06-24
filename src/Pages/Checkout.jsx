import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const location = useLocation();
  const navigate = useNavigate();
  const subscriptionData = location.state;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);

  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  useEffect(() => {
    const savedPhone =
      localStorage.getItem("customerPhone") || "";
    const savedName =
      localStorage.getItem("customerName") || "";
    const savedAddress =
      localStorage.getItem("customerAddress") || "";

    setPhone(savedPhone);
    setName(savedName);
    setAddress(savedAddress);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const gst =
    paymentMethod === "online"
      ? Math.round(total * 0.02)
      : 0;

  const grandTotal = total + gst;

  const saveOrdersToSheet = async () => {
    for (const item of cart) {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "placeOrder",
          customerName: name,
          phone,
          address,
          product: item.name,
          qty: item.qty,
          price: item.total,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to place order"
        );
      }
    }
  };

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      alert("Please fill all customer details");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const itemsText = cart
      .map(
        (item) =>
          `${item.name} (${item.size || "1L"}) x ${item.qty} = ₹${item.total}`
      )
      .join("\n");

    try {
      setPlacing(true);

      // 1) WhatsApp Order
      if (paymentMethod === "whatsapp") {
        const message = `
Farm Fresh Dairy Order

Name: ${name}
Phone: ${phone}
Address: ${address}

Items:
${itemsText}

Total: ₹${grandTotal}
`;

        const whatsappNumber = "919989663837";

        window.open(
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            message
          )}`,
          "_blank"
        );

        // also save in Google Sheet
        await saveOrdersToSheet();

        localStorage.removeItem("cart");
        alert("Order placed successfully");
        navigate("/dashboard");
        return;
      }

      // 2) Online Payment
      if (paymentMethod === "online") {
        const options = {
          key: "rzp_live_SryV51ja9BVho8",
          amount: grandTotal * 100,
          currency: "INR",
          name: "Farm Fresh Dairy",
          description: "Milk Order Payment",
          handler: async function () {
            try {
              await saveOrdersToSheet();
              localStorage.removeItem("cart");
              alert("Payment successful and order placed");
              navigate("/dashboard");
            } catch (error) {
              alert(
                error.message ||
                  "Payment success, but order save failed"
              );
            }
          },
          theme: {
            color: "#16a34a",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // 3) COD
      await saveOrdersToSheet();
      localStorage.removeItem("cart");
      alert("Order placed successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-center text-green-700 mb-10">
        Checkout
      </h1>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Customer Details */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {subscriptionData?.subscription && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <h3 className="font-bold text-green-700 mb-2">
                Subscription Details
              </h3>
              <p>Product: {subscriptionData.product}</p>
              <p>Quantity: {subscriptionData.qty}</p>
              <p>Delivery: {subscriptionData.deliveryType}</p>
              <p>
                Monthly Amount: ₹
                {subscriptionData.monthlyAmount}
              </p>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6">
            Customer Details
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full border rounded-xl p-4 mb-4"
          />

          <input
            type="text"
            value={phone}
            readOnly
            className="w-full border rounded-2xl px-5 py-4 bg-gray-100 cursor-not-allowed mb-4"
          />

          <textarea
            placeholder="Delivery Address"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            className="w-full border rounded-xl p-4 mb-4"
            rows="4"
          />

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">
              Payment Method
            </h3>

            <label className="flex items-center gap-3 p-3 border rounded-xl mb-3 cursor-pointer hover:bg-green-50">
              <input
                type="radio"
                name="payment"
                value="whatsapp"
                checked={paymentMethod === "whatsapp"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />
              <span>📱 WhatsApp Order</span>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-xl mb-3 cursor-pointer hover:bg-green-50">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />
              <span>💳 Online Payment</span>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-green-50">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />
              <span>💵 Cash On Delivery</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b py-3"
            >
              <div>
                <p className="font-semibold">
                  {item.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {item.size || "1L"} × {item.qty}
                </p>
              </div>

              <span className="font-bold">
                ₹{item.total}
              </span>
            </div>
          ))}

          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Delivery Charges</span>
              <span className="text-green-600">
                Free
              </span>
            </div>

            {paymentMethod === "online" && (
              <div className="flex justify-between mb-3">
                <span>GST (2%)</span>
                <span>₹{gst}</span>
              </div>
            )}

            <div className="flex justify-between border-t pt-4 mt-4 text-3xl font-bold text-green-700">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-bold shadow-lg disabled:opacity-50"
          >
            {placing
              ? "Processing..."
              : paymentMethod === "online"
              ? `Pay ₹${grandTotal}`
              : paymentMethod === "whatsapp"
              ? "Send Order On WhatsApp"
              : "Place Order"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 bg-green-50 border border-green-200 rounded-xl p-3 text-center text-sm text-green-700">
        🚚 Fresh milk delivered daily • Secure ordering • Fast delivery
      </div>
    </div>
  );
}