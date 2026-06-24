import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SubscriptionCheckout() {
  const location = useLocation();
  const navigate = useNavigate();

  const subscription = location.state;

  const [paymentMethod, setPaymentMethod] = useState("whatsapp");
  const [loading, setLoading] = useState(false);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold text-red-500">
          No Subscription Selected
        </h2>
      </div>
    );
  }

  const customerName = localStorage.getItem("customerName") || "";
  const customerPhone = localStorage.getItem("customerPhone") || "";
  const customerAddress = localStorage.getItem("customerAddress") || "";
  const customerArea = localStorage.getItem("customerArea") || "";

  const startDate =
    subscription.startDate || new Date().toISOString().split("T")[0];

  const expireDate =
    subscription.expireDate ||
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split("T")[0];
    })();

  const monthlyAmount = Number(subscription.monthlyAmount || 0);

  const buildSubscriptionPayload = () => ({
    action: "addSubscription",
    customerName,
    phone: customerPhone,
    address: customerAddress,
    area: customerArea,
    product: subscription.product,
    qty: subscription.qty,
    price: monthlyAmount,
    deliveryType: subscription.deliveryType,
    startDate,
    expireDate,
    status: "Active",
  });

  const saveSubscription = async () => {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(buildSubscriptionPayload()),
    });

    const result = await response.json();
    return result;
  };

  const activateSubscription = async () => {
    try {
      if (!customerName || !customerPhone) {
        alert("Customer name or phone number is missing. Please login again.");
        return;
      }

      setLoading(true);

      // WhatsApp
      if (paymentMethod === "whatsapp") {
        const result = await saveSubscription();

        if (!result.success) {
          alert(result.message || "Failed To Create Subscription");
          return;
        }

        const message = `
Farm Fresh Dairy Subscription

Customer: ${customerName}
Phone: ${customerPhone}
Product: ${subscription.product}
Quantity: ${subscription.qty}
Delivery: ${subscription.deliveryType}
Monthly Amount: ₹${monthlyAmount}
Start Date: ${startDate}
Expire Date: ${expireDate}
`;

        window.open(
          `https://wa.me/919989663837?text=${encodeURIComponent(message)}`,
          "_blank"
        );

        alert("Subscription created successfully");
        navigate("/dashboard");
        return;
      }

      // Online Payment
      if (paymentMethod === "online") {
        const options = {
          key: "rzp_live_SryV51ja9BVho8",
          amount: monthlyAmount * 100,
          currency: "INR",
          name: "Farm Fresh Dairy",
          description: "Subscription Payment",
          handler: async function () {
            try {
              const result = await saveSubscription();

              if (!result.success) {
                alert(result.message || "Payment done, but subscription save failed");
                return;
              }

              alert("Payment successful and subscription activated");
              navigate("/dashboard");
            } catch (err) {
              console.error(err);
              alert("Payment successful, but something went wrong while saving subscription");
            }
          },
          prefill: {
            name: customerName,
            contact: customerPhone,
          },
          theme: {
            color: "#16a34a",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // Cash On Delivery
      if (paymentMethod === "cod") {
        const result = await saveSubscription();

        if (!result.success) {
          alert(result.message || "Failed To Create Subscription");
          return;
        }

        alert("Subscription activated successfully");
        navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black text-center text-green-700 mb-10">
          Subscription Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT CARD */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🥛</div>

                <h2 className="text-3xl font-bold">
                  {subscription.product}
                </h2>

                <p className="mt-3 text-lg">{subscription.qty}</p>
                <p className="text-lg">{subscription.deliveryType}</p>

                <div className="mt-6 border-t border-green-300 pt-6">
                  <p className="text-sm">Monthly Plan</p>
                  <p className="text-5xl font-black">
                    ₹{monthlyAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 mt-6 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Customer</span>
                <span>{customerName || "-"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Phone</span>
                <span>{customerPhone || "-"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Start Date</span>
                <span>{startDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Expire Date</span>
                <span>{expireDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                🚚
                <p className="text-sm mt-2">Fresh Delivery</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 text-center">
                🔒
                <p className="text-sm mt-2">Secure Payment</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 text-center">
                ⭐
                <p className="text-sm mt-2">Farm Fresh</p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6">Payment Method</h2>

            <div className="space-y-4">
              <label className="flex items-center border-2 rounded-2xl p-5 cursor-pointer hover:border-green-500">
                <input
                  type="radio"
                  value="whatsapp"
                  checked={paymentMethod === "whatsapp"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                <div>
                  <h3 className="font-bold">📱 WhatsApp Order</h3>
                  <p className="text-sm text-gray-500">
                    Send subscription details instantly
                  </p>
                </div>
              </label>

              <label className="flex items-center border-2 rounded-2xl p-5 cursor-pointer hover:border-green-500">
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                <div>
                  <h3 className="font-bold">💳 Online Payment</h3>
                  <p className="text-sm text-gray-500">
                    Pay securely with Razorpay
                  </p>
                </div>
              </label>

              <label className="flex items-center border-2 rounded-2xl p-5 cursor-pointer hover:border-green-500">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                <div>
                  <h3 className="font-bold">💵 Cash On Delivery</h3>
                  <p className="text-sm text-gray-500">
                    Pay when delivery starts
                  </p>
                </div>
              </label>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 mt-8 space-y-3">
              <div className="flex justify-between">
                <span>Product</span>
                <span className="font-semibold">{subscription.product}</span>
              </div>

              <div className="flex justify-between">
                <span>Quantity</span>
                <span className="font-semibold">{subscription.qty}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold">{subscription.deliveryType}</span>
              </div>

              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold">Monthly Amount</span>
                <span className="font-bold text-lg">
                  ₹{monthlyAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={activateSubscription}
              disabled={loading}
              className={`w-full mt-8 py-5 rounded-2xl text-lg font-bold shadow-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Processing..." : "Activate Subscription"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}