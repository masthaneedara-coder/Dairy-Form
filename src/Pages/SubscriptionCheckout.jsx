import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-red-500">
            No Subscription Selected
          </h2>
          <button
            onClick={() => navigate("/subscription")}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold"
          >
            Go To Subscription
          </button>
        </div>
      </div>
    );
  }

  const customerName = localStorage.getItem("customerName") || "";
  const customerPhone = localStorage.getItem("customerPhone") || "";
  const customerAddress = localStorage.getItem("customerAddress") || "";
  const customerArea = localStorage.getItem("customerArea") || "";

  const startDate = useMemo(
    () => subscription.startDate || new Date().toISOString().split("T")[0],
    [subscription]
  );

  const expireDate = useMemo(() => {
    if (subscription.expireDate) return subscription.expireDate;

    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  }, [subscription]);

  const monthlyAmount = Number(subscription.monthlyAmount || 0);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return dateValue;

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
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

      if (paymentMethod === "whatsapp") {
        const result = await saveSubscription();

        if (!result.success) {
          alert(result.message || "Failed to create subscription");
          return;
        }

        const message = `
Farm Fresh Dairy Subscription

Customer: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}
Area: ${customerArea}

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

      if (paymentMethod === "online") {
        if (!window.Razorpay) {
          alert("Razorpay is not loaded. Please refresh and try again.");
          return;
        }

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
              alert("Payment successful, but saving subscription failed");
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

      if (paymentMethod === "cod") {
        const result = await saveSubscription();

        if (!result.success) {
          alert(result.message || "Failed to create subscription");
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
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-green-700">
            Subscription Checkout
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Review your plan and activate your subscription
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8">
              <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-6 sm:p-8 text-white">
                <div className="text-center">
                  <div className="text-5xl sm:text-6xl mb-4">🥛</div>

                  <h2 className="text-2xl sm:text-3xl font-bold break-words">
                    {subscription.product}
                  </h2>

                  <p className="mt-3 text-base sm:text-lg">{subscription.qty}</p>
                  <p className="text-base sm:text-lg">
                    {subscription.deliveryType}
                  </p>

                  <div className="mt-6 border-t border-green-300 pt-6">
                    <p className="text-sm">Monthly Plan</p>
                    <p className="text-3xl sm:text-5xl font-black">
                      ₹{monthlyAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 sm:p-6 mt-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium text-gray-600">Customer</span>
                  <span className="font-semibold break-words text-left sm:text-right">
                    {customerName || "-"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium text-gray-600">Phone</span>
                  <span className="font-semibold break-all text-left sm:text-right">
                    {customerPhone || "-"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium text-gray-600">Address</span>
                  <span className="font-semibold break-words text-left sm:text-right">
                    {customerAddress || "-"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium text-gray-600">Area</span>
                  <span className="font-semibold break-words text-left sm:text-right">
                    {customerArea || "-"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium text-gray-600">Start Date</span>
                  <span className="font-semibold text-left sm:text-right">
                    {formatDate(startDate)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium text-gray-600">Expire Date</span>
                  <span className="font-semibold text-left sm:text-right">
                    {formatDate(expireDate)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
                <div className="bg-green-50 rounded-2xl p-3 sm:p-4 text-center">
                  <div className="text-2xl">🚚</div>
                  <p className="text-xs sm:text-sm mt-2">Fresh Delivery</p>
                </div>

                <div className="bg-green-50 rounded-2xl p-3 sm:p-4 text-center">
                  <div className="text-2xl">🔒</div>
                  <p className="text-xs sm:text-sm mt-2">Secure Payment</p>
                </div>

                <div className="bg-green-50 rounded-2xl p-3 sm:p-4 text-center">
                  <div className="text-2xl">⭐</div>
                  <p className="text-xs sm:text-sm mt-2">Farm Fresh</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 h-fit">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 border-2 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-green-500">
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
                    Send subscription details instantly
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 border-2 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-green-500">
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

              <label className="flex items-start gap-3 border-2 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-green-500">
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
                    Pay when delivery starts
                  </p>
                </div>
              </label>
            </div>

            <div className="bg-green-50 rounded-2xl p-4 sm:p-6 mt-8 space-y-3">
              <div className="flex justify-between gap-4">
                <span>Product</span>
                <span className="font-semibold text-right break-words">
                  {subscription.product}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Quantity</span>
                <span className="font-semibold text-right">
                  {subscription.qty}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Delivery</span>
                <span className="font-semibold text-right">
                  {subscription.deliveryType}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t pt-3">
                <span className="font-semibold">Monthly Amount</span>
                <span className="font-bold text-lg text-green-700">
                  ₹{monthlyAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={activateSubscription}
              disabled={loading}
              className={`w-full mt-8 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold shadow-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Processing..." : "Activate Subscription"}
            </button>

            <button
              onClick={() => navigate("/subscription")}
              className="w-full mt-3 py-4 rounded-2xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Back To Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}