import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

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

  const [cart, setCart] = useState([]);
  const [subscription, setSubscription] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("customerLogin") === "true";

    if (!isLoggedIn) {
      localStorage.setItem("afterLoginRedirect", "/checkout");
      navigate("/auth");
      return;
    }

    const savedCart = getSavedCart();
    const savedSubscription = getSavedSubscription();

    setCart(savedCart);
    setSubscription(savedSubscription);

    const savedPhone = localStorage.getItem("customerPhone") || "";
    const savedName = localStorage.getItem("customerName") || "";
    const savedAddress = localStorage.getItem("customerAddress") || "";

    setPhone(savedPhone);
    setName(savedName);
    setAddress(savedAddress);
  }, [navigate]);

  const productTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.qty || 0),
        0
      ),
    [cart]
  );

  const subscriptionTotal = Number(subscription?.monthlyAmount || 0);
  const subtotal = productTotal + subscriptionTotal;

  const gst =
    paymentMethod === "online"
      ? Math.round(subtotal * 0.02)
      : 0;

  const grandTotal = subtotal + gst;

  const hasAnythingToCheckout =
    cart.length > 0 || !!subscription;

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
          size: item.size || "1L",
          price: Number(item.price || 0),
          amount: Number(item.price || 0) * Number(item.qty || 0),
          paymentMethod,
          status: "Pending",
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to place product order");
      }
    }
  };

  const saveSubscriptionToSheet = async () => {
    if (!subscription) return;

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "addSubscription",
        customerName: name,
        phone,
        address,
        product: subscription.product,
        qty: subscription.qty,
        price: subscription.monthlyAmount,
        deliveryType: subscription.deliveryType,
        startDate: subscription.startDate,
        expireDate: subscription.expireDate,
        paymentMethod,
        status: "Active",
      }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to save subscription");
    }
  };

  const saveAll = async () => {
    if (cart.length > 0) {
      await saveOrdersToSheet();
    }

    if (subscription) {
      await saveSubscriptionToSheet();
    }
  };

  const clearAfterSuccess = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("subscriptionCart");
    localStorage.setItem("customerAddress", address);
  };

  const buildWhatsAppMessage = () => {
    const productLines =
      cart.length > 0
        ? cart
            .map(
              (item) =>
                `${item.name} (${item.size || "1L"}) x ${item.qty} = ₹${
                  Number(item.price || 0) * Number(item.qty || 0)
                }`
            )
            .join("\n")
        : "No product items";

    const subscriptionText = subscription
      ? `
Subscription:
Product: ${subscription.product}
Quantity: ${subscription.qty}
Delivery: ${subscription.deliveryType}
Start: ${subscription.startDate}
Expire: ${subscription.expireDate}
Monthly Amount: ₹${subscription.monthlyAmount}
`
      : "No subscription selected";

    return `
Farm Fresh Dairy Order

Name: ${name}
Phone: ${phone}
Address: ${address}

Products:
${productLines}

${subscriptionText}

Subtotal: ₹${subtotal}
${paymentMethod === "online" ? `GST: ₹${gst}` : ""}
Grand Total: ₹${grandTotal}
Payment Method: ${paymentMethod}
`;
  };

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      alert("Please fill all customer details");
      return;
    }

    if (!hasAnythingToCheckout) {
      alert("Cart is empty");
      return;
    }

    try {
      setPlacing(true);

      if (paymentMethod === "whatsapp") {
        const whatsappNumber = "919989663837";
        const message = buildWhatsAppMessage();

        window.open(
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
          "_blank"
        );

        await saveAll();
        clearAfterSuccess();
        alert("Order placed successfully");
        navigate("/dashboard");
        return;
      }

      if (paymentMethod === "online") {
        const options = {
          key: "rzp_live_SryV51ja9BVho8",
          amount: grandTotal * 100,
          currency: "INR",
          name: "Farm Fresh Dairy",
          description: "Milk Order Payment",
          handler: async function () {
            try {
              await saveAll();
              clearAfterSuccess();
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

      await saveAll();
      clearAfterSuccess();
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-green-700 mb-8 sm:mb-10">
        Checkout
      </h1>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Customer Details */}
        <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-8">
          {subscription && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <h3 className="font-bold text-green-700 mb-2">
                Subscription Details
              </h3>
              <p>Product: {subscription.product}</p>
              <p>Quantity: {subscription.qty}</p>
              <p>Delivery: {subscription.deliveryType}</p>
              <p>Start Date: {subscription.startDate}</p>
              <p>Expire Date: {subscription.expireDate}</p>
              <p>Monthly Amount: ₹{subscription.monthlyAmount}</p>
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
        <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-8">
          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          {cart.length > 0 && (
            <>
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
                    ₹{Number(item.price || 0) * Number(item.qty || 0)}
                  </span>
                </div>
              ))}
            </>
          )}

          {subscription && (
            <div className="border-b py-4">
              <p className="font-semibold text-blue-700">
                Subscription - {subscription.product}
              </p>
              <p className="text-gray-500 text-sm">
                {subscription.qty} • {subscription.deliveryType}
              </p>
              <p className="font-bold mt-1">
                ₹{subscription.monthlyAmount}
              </p>
            </div>
          )}

          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between mb-3">
              <span>Products Total</span>
              <span>₹{productTotal}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Subscription</span>
              <span>₹{subscriptionTotal}</span>
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

            <div className="flex justify-between border-t pt-4 mt-4 text-2xl sm:text-3xl font-bold text-green-700">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={placing || !hasAnythingToCheckout}
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