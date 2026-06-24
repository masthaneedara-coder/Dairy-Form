import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import heroImage from "../assets/logo3.png";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";


export default function FarmFreshDairyWebsite() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] =
  useState({});
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [subscriptions, setSubscriptions] = useState([
  {
    id: 1,
    product: "Buffalo Milk",
    qty: 1,
    price: 80,
    status: "Active",
    slot: "Morning",
    skipTomorrow: false,
    days: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ],
  },
]);
const [cart, setCart] = useState([]);

const [walletBalance, setWalletBalance] =
  useState(1250);
  
const monthlyBill = subscriptions.reduce(
  (total, item) =>
    total + item.qty * item.price * 30,
  0
);  

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

 useEffect(() => {
  const loadProducts = async () => {
    try {
      const res = await fetch(`${SCRIPT_URL}?action=products`);
      const data = await res.json();

      console.log("Products API response:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.log("Products fetch error:", err);
      setProducts([]);
    }
  };

  loadProducts();
}, []);
  useEffect(() => {

  const hash =
    window.location.hash;

  if (hash) {

    setTimeout(() => {

      const element =
        document.querySelector(hash);

      if (element) {

        element.scrollIntoView({
          behavior: "smooth",
        });

      }

    }, 500);

  }

}, []);
  
  useEffect(() => {

  const handler = (e) => {

    e.preventDefault();

    setDeferredPrompt(e);

  };

  window.addEventListener(
    "beforeinstallprompt",
    handler
  );

  return () =>
    window.removeEventListener(
      "beforeinstallprompt",
      handler
    );

}, []);
  useEffect(() => {

  const enableNotifications =
    async () => {

    if (
      "Notification" in window
    ) {

      const permission =
        await Notification.requestPermission();

      console.log(
        "Notification Permission:",
        permission
      );

      if (
        permission === "granted"
      ) {

        console.log(
          "Notifications Enabled"
        );

      }

    }

  };

  enableNotifications();

}, []);
useEffect(() => {

  const loginStatus =
    localStorage.getItem(
      "customerLogin"
    );

  if (loginStatus === "true") {

    setIsLoggedIn(true);

    setCustomerName(
      localStorage.getItem(
        "customerName"
      ) || ""
    );

    setCustomerPhone(
      localStorage.getItem(
        "customerPhone"
      ) || ""
    );

  }

}, []);
  useEffect(() => {

  const statuses = [
    "Preparing",
    "Out For Delivery",
    "Reached Nearby",
    "Delivered",
  ];

  let index = 0;

  const interval = setInterval(() => {

    index++;

    if (index < statuses.length) {

      setDeliveryStatus(
        statuses[index]
      );

    } else {

      clearInterval(interval);

    }

  }, 5000);

  return () =>
    clearInterval(interval);

}, []);

  const handlePayment = (price) => {

  const options = {

    key: "rzp_live_SryV51ja9BVho8",

    amount: price * 100,

    currency: "INR",

    name: "Farm Fresh Dairy",

    description: "Milk Subscription",

    image: logo,

    handler: function (response) {

      alert(
        `Payment Successful ₹${price}`
      );

      console.log(response);

    },

    theme: {
      color: "#16a34a",
    },

  };

  const razorpay =
    new window.Razorpay(options);

  razorpay.open();

};
const rechargeWallet = (amount) => {

  const options = {

    key: "rzp_live_SryV51ja9BVho8",

    amount: amount * 100,

    currency: "INR",

    name: "Farm Fresh Dairy",

    description: "Wallet Recharge",

    image: logo,

    handler: function (response) {

      setWalletBalance(
        (prev) => prev + amount
      );

      alert(
        `Wallet Recharged Successfully\n₹${amount} Added`
      );
    },

    theme: {
      color: "#16a34a",
    },

  };

  const razor = new window.Razorpay(options);

  razor.open();
};
const addSubscription = (product) => {

  const newSubscription = {

    id: Date.now(),

    product: product.name,

    qty: 1,

    price: product.price,

    status: "Active",

    slot: "Morning",

    skipTomorrow: false,

    days: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ],

  };

  setSubscriptions([
    ...subscriptions,
    newSubscription,
  ]);

};
  const plans = [

  {
    title: "Starter Plan",
    qty: "500ml Daily",
    price: 1199,
  },

  {
    title: "Family Plan",
    qty: "1L Daily",
    price: 2699,
  },

  {
    title: "Premium Plan",
    qty: "2L Daily",
    price: 5399,
  },

];


  const subscriptionProducts = [
  {
    name: "Cow Milk",
    price: 60,
  },

  {
    name: "Buffalo Milk",
    price: 80,
  },

  {
    name: "Fresh Curd",
    price: 120,
  },

  {
    name: "Paneer",
    price: 350,
  },
];
  const today = new Date();

const upcomingDays = [...Array(7)].map((_, i) => {

  const date = new Date();

  date.setDate(today.getDate() + i);

  return {
    day: date.toLocaleDateString("en-US", {
      weekday: "short",
    }),

    date: date.getDate(),
  };

});
const [orderHistory] = useState([
  {
    id: 1,
    product: "Buffalo Milk",
    qty: 2,
    amount: 160,
    status: "Delivered",
    date: "12 May 2026",
  },

  {
    id: 2,
    product: "Cow Milk",
    qty: 1,
    amount: 60,
    status: "Delivered",
    date: "11 May 2026",
  },

  {
    id: 3,
    product: "Fresh Curd",
    qty: 1,
    amount: 120,
    status: "Processing",
    date: "10 May 2026",
  },
]);
const [notifications, setNotifications] =
  useState([
    {
      id: 1,
      title: "Milk Delivered",
      message:
        "Your Buffalo Milk was delivered successfully.",
      type: "success",
    },

    {
      id: 2,
      title: "Wallet Low",
      message:
        "Recharge wallet to continue delivery.",
      type: "warning",
    },

    {
      id: 3,
      title: "Subscription Active",
      message:
        "Your Family Plan is active.",
      type: "info",
    },
  ]);
const [deliveryStatus, setDeliveryStatus] =
  useState("Preparing");

const deliverySteps = [
  "Preparing",
  "Out For Delivery",
  "Reached Nearby",
  "Delivered",
];
  const [showLogin, setShowLogin] =
  useState(false);

const [phone, setPhone] =
  useState("");

const [otp, setOtp] =
  useState("");

const [generatedOtp, setGeneratedOtp] =
  useState("");

const [isLoggedIn, setIsLoggedIn] =
  useState(false);
  const [customerName,
  setCustomerName] =
  useState("");

const [customerPhone,
  setCustomerPhone] =
  useState("");
  const sendOtp = async () => {

  try {

    if (!phone) {
      alert("Enter phone number");
      return;
    }

    window.recaptchaVerifier =
      new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {}
      );

    const appVerifier =
      window.recaptchaVerifier;

    const confirmationResult =
      await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        appVerifier
      );

    window.confirmationResult =
      confirmationResult;

    alert("OTP Sent Successfully");

  } catch (error) {

    console.log(error);

    alert(error.message);

  }

};
const verifyOtp = async () => {
  

  try {

    await window.confirmationResult.confirm(otp);
    localStorage.setItem(
        "customerLogin",
        "true"
      );

      localStorage.setItem(
        "userRole",
        "customer"
      );

      localStorage.setItem(
        "customerPhone",
        phone
      );

    setIsLoggedIn(true);

    setShowLogin(false);

    alert("Login Successful");

  } catch (error) {

    console.log(error);

    alert("Invalid OTP");

  }  

};
const testNotification = () => {

  if (
    Notification.permission ===
    "granted"
  ) {

    new Notification(
      "🥛 Farm Fresh Dairy",
      {

        body:
          "Your milk delivery is on the way 🚚",

        icon: "/logo.png",

      }
    );

  } else {

    alert(
      "Notification permission not granted"
    );

  }

};
const installApp = async () => {

  if (!deferredPrompt) {

    alert(
      "Install not available yet"
    );

    return;

  }

  deferredPrompt.prompt();

  const choiceResult =
    await deferredPrompt.userChoice;

  if (
    choiceResult.outcome ===
    "accepted"
  ) {

    console.log(
      "App Installed"
    );

  }

  setDeferredPrompt(null);

};
const handleLogin = () => {

  if (
    !customerName ||
    !customerPhone
  ) {

    alert(
      "Please fill all fields"
    );

    return;

  }

  setIsLoggedIn(true);

  localStorage.setItem(
    "customerLogin",
    "true"
  );

  localStorage.setItem(
    "customerName",
    customerName
  );

  localStorage.setItem(
    "customerPhone",
    customerPhone
  );

};

  return (   
    
<div className="min-h-screen bg-white text-gray-800">
  
          {/* HERO */}
    {/* HEADER */}
<header className="sticky top-0 z-50 bg-white shadow-md">

  {/* TOP BAR */}
  {/* <div className="bg-gray-50 border-b">
    <div className="max-w-7xl mx-auto px-6 py-2 flex justify-end">

      {isLoggedIn ? (
        <div className="flex items-center gap-3">

          <span className="font-semibold text-green-700">
            👋 {customerName}
          </span>

          <button
            onClick={() => {
              localStorage.removeItem("customerLogin");
              localStorage.removeItem("customerName");
              localStorage.removeItem("customerPhone");

              setIsLoggedIn(false);

              navigate("/");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      ) : (
        <button
          onClick={() => navigate("/auth")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          Login
        </button>
      )}

    </div>
  </div> */}

  {/* MAIN HEADER */}
 
</header>
  {/* FEATURES */}
      {/* SMART FEATURES SECTION */}
        <section className="relative overflow-hidden">
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url(${heroImage})`,
    }}
  />

  <div className="absolute inset-0 bg-black/50" />

  <div className="relative max-w-7xl mx-auto px-6 py-32 text-white">
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-3 rounded-full mb-8">
        🌿 100% Farm Fresh Milk
      </div>

      <h2 className="text-6xl font-black leading-tight">
        Fresh Milk
        <span className="block text-green-400">
          Delivered Every Morning
        </span>
      </h2>

      <p className="mt-8 text-2xl text-gray-200">
        Natural farm milk with hygienic packaging and
        daily home delivery.
      </p>

      <div className="mt-10 flex gap-5">
        <button aria-label="Subscribe Now"
          onClick={() => {
            document
              .getElementById("plans")
              .scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl font-bold text-lg"
        >
          Subscribe Now
        </button>

        <button aria-label="WhatsApp Order"
          onClick={() => {
            window.open("https://wa.me/919989663837");
          }}
          className="bg-white/10 border border-white/30 px-8 py-4 rounded-2xl font-bold"
        >
          WhatsApp Order
        </button>
        <button
          onClick={testNotification}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-bold text-white"
        >
          Test Notification
        </button>
        <button
            onClick={installApp}
            className="bg-black hover:bg-gray-800 px-8 py-4 rounded-2xl font-bold text-white"
          >
            📱 Install App
          </button>
      </div>
    </div>
  </div>
</section>   

 
      {/* PRODUCTS */}
      <section id="products" className="py-20">
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-black">
              Our Dairy Products
            </h2>

            <p className="text-gray-500 mt-4 text-xl">
              Freshly packed dairy products with premium quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {(Array.isArray(products) ? products : []).map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-80 w-full object-cover"
                />

                <div className="p-8">
                  <h3 className="text-4xl font-black">
                    {product.name}
                  </h3>

                  <div className="text-green-600 text-3xl font-bold mt-4">
                    ₹{product.price} / L
                  </div>

                  <div className="mt-5 inline-block bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
                    In Stock : {product.stock}L
                  </div>

                  <input
                        type="number"
                        min="1"
                        placeholder="Enter Quantity / Liters"
                        value={
                          quantity[product.name] || ""
                        }
                        onChange={(e) =>
                          setQuantity({
                            ...quantity,
                            [product.name]:
                              Number(e.target.value),
                          })
                        }
                        className="w-full border rounded-2xl px-5 py-4 mt-6"
                      />
                      <button
                        onClick={() => {

                          const isLoggedIn =
                            localStorage.getItem("customerLogin") === "true";

                          const qty =
                            quantity[product.name];

                          if (!qty || qty <= 0) {

                            alert("Please enter quantity");

                            return;

                          }

                          const cartItem = {
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            qty: Number(qty),
                          };

                          // Login Check
                          if (!isLoggedIn) {

                            localStorage.setItem(
                              "pendingCartItem",
                              JSON.stringify(cartItem)
                            );

                            navigate("/auth");

                            return;

                          }

                          const cart =
                            JSON.parse(
                              localStorage.getItem("cart") || "[]"
                            );

                          const existingItem =
                            cart.find(
                              item => item.name === product.name
                            );

                          if (existingItem) {

                            existingItem.qty += Number(qty);

                          } else {

                            cart.push(cartItem);

                          }

                          localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                          );

                          navigate("/cart");

                        }}
                        className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        🛒 Order Now
                      </button>

               
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section
        id="plans"
        className="py-20 bg-green-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-black">
              Milk Subscription Plans
            </h2>

            <p className="text-gray-500 mt-4 text-xl">
              Flexible monthly plans for your family.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {plans.map((plan, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-10 shadow-2xl"
              >
                <h3 className="text-5xl font-black">
                  {plan.title}
                </h3>

                <p className="text-gray-500 mt-5 text-2xl">
                  {plan.qty}
                </p>

                <div className="text-6xl font-black text-green-600 mt-10">
                  ₹{plan.price} / Month
                </div>

               <button
                  onClick={() => {

                    const isLoggedIn =
                      localStorage.getItem("customerLogin") === "true";

                    if (!isLoggedIn) {

                      navigate("/auth");

                      return;

                    }

                    handlePayment(plan.price);

                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold"
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* LOGO SECTION */}
<section className="py-20 bg-gradient-to-b from-green-50 to-white">
  <div className="max-w-4xl mx-auto px-4">

    {/* BRAND SECTION */}
    <div className="max-w-3xl mx-auto bg-white rounded-[50px] p-12 shadow-2xl border border-green-100 text-center">

      {/* LOGO */}
      <div className="flex justify-center">
        <div className="w-60 h-60 rounded-full bg-green-600 flex items-center justify-center shadow-2xl overflow-hidden">

            <img
            src={logo}
            alt="Farm Fresh Dairy"
            className="w-72 h-72 object-contain"
            />

        </div>
        </div>
        

      {/* TITLE */}
      <h2 className="text-6xl font-black mt-10 text-green-800 leading-tight">
        FARM FRESH
      </h2>

      {/* SUBTITLE */}
      <p className="text-3xl tracking-[0.35em] text-gray-500 mt-3">
        DAIRY MILK
      </p>

      {/* TAGLINE */}
      <div className="mt-8 inline-flex items-center gap-2 bg-green-100 text-green-700 px-8 py-4 rounded-full font-bold text-lg shadow">

        🌿 Premium Natural Milk Brand

      </div>

      {/* DESCRIPTION */}
      <p className="mt-8 text-gray-600 text-xl leading-9 max-w-2xl mx-auto">
        Fresh farm milk delivered daily with hygienic packaging,
        premium quality, and natural nutrition for your family.
      </p>

    </div>

    {/* LABEL SECTION
    <div className="text-center mt-24">

      <h3 className="text-5xl font-black text-gray-900">
        Milk Product Label Design
      </h3>

      <p className="text-gray-500 mt-4 text-xl">
        Premium sticker and bottle label inspiration.
      </p>

    </div> */}

  </div>
</section>
{/* LABEL SECTION */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-14">
      <h2 className="text-5xl font-black">
        Milk Product Label Design
      </h2>

      <p className="text-gray-500 mt-4 text-xl">
        Premium sticker and bottle label inspiration.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-10">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1517448931760-9bf4414148c5?q=80&w=1200&auto=format&fit=crop"
          className="w-full h-96 object-cover"
        />

        <div className="p-8">
          <h3 className="text-4xl font-black">
            Premium Cow Milk Label
          </h3>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
              Waterproof
            </span>

            <span className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
              Premium Finish
            </span>

            <span className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
              Food Safe
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop"
          className="w-full h-96 object-cover"
        />

        <div className="p-8">
          <h3 className="text-4xl font-black">
            Fresh Dairy Bottle Label
          </h3>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
              Waterproof
            </span>

            <span className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
              Premium Finish
            </span>

            <span className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
              Food Safe
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* MOBILE SECTION */}
<section className="py-20 bg-green-600 text-white">
  <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h2 className="text-6xl font-black leading-tight">
        Mobile Friendly
        <span className="block text-green-100">
          Milk Ordering Experience
        </span>
      </h2>

      <p className="mt-8 text-2xl text-green-100 leading-relaxed">
        Customers can subscribe, pause deliveries,
        and order milk directly from mobile devices.
      </p>

      <div className="mt-10 space-y-5 text-2xl">
        <div>✔ WhatsApp Integration</div>
        <div>✔ QR Payment Support</div>
        <div>✔ Delivery Notifications</div>
        <div>✔ Subscription Dashboard</div>
      </div>
    </div>

    <div className="flex justify-center">
      <div className="w-80 bg-white rounded-[40px] p-4 shadow-2xl text-black">
        <div className="rounded-[32px] overflow-hidden bg-gray-100">
          <div className="bg-green-600 text-white p-5 text-center font-bold text-2xl">
            Farm Fresh Dairy
          </div>

          <div className="p-5 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
              <div>                
                <div className="font-bold">Cow Milk</div>
                <div className="text-gray-500">
                  1L Daily
                </div>
              </div>
              <div className="text-green-600 font-bold">
                ₹60
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
              <div>                
                <div className="font-bold">Bufellow Milk</div>
                <div className="text-gray-500">
                  1L Daily
                </div>
              </div>
              <div className="text-green-600 font-bold">
                ₹80
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg"
              onClick={() => {

                    const isLoggedIn =
                      localStorage.getItem(
                        "customerLogin"
                      ) === "true";

                    if (!isLoggedIn) {

                      alert(
                        "Please login first"
                      );

                      window.location.href =
                        "/auth";

                      return;

                    }

                    document
                      .getElementById(
                        "subscriptions"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });

                  }}
                  >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* CONTACT */}
<section id="contact" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
    <div>
      <h2 className="text-5xl font-black">
        Contact Us
      </h2>

      <p className="text-gray-600 mt-6 text-2xl leading-relaxed">
       Farm Fresh Dairy delivers pure and hygienic milk
      directly from our dairy farm to customers every
      morning. We provide Cow Milk, Buffalo Milk,
      Fresh Curd, and subscription plans with
      home delivery services.
      </p>

      <div className="mt-10 space-y-6 text-2xl">
        <div>📞 +91 9989663837</div>
        <div>📞 +91 75693 17209</div>
        <div>📍 Telangana, India</div>
        <div>⏰ Delivery: 5AM - 8AM  And 6PM to 9PM</div>
      </div>
    </div>

    <div className="bg-green-50 rounded-3xl p-10 shadow-2xl">
      <h3 className="text-4xl font-black mb-8">
        Quick Enquiry
      </h3>

      <div className="space-y-5">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border rounded-2xl px-5 py-4"
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border rounded-2xl px-5 py-4"
        />

        <textarea
          rows="5"
          placeholder="Message"
          className="w-full border rounded-2xl px-5 py-4"
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg">
          Send Message
        </button>
      </div>
    </div>
  </div>
</section>
        <div className="flex flex-wrap gap-5 mt-6 text-sm">
        <a href="/privacy-policy">
            Privacy Policy
        </a>

        <a href="/refund-policy">
            Refund Policy
        </a>

        <a href="/shipping-policy">
            Shipping Policy
        </a>

        <a href="/terms">
            Terms & Conditions
        </a>
        </div>
        {/* LOGIN MODAL */}

{showLogin && (

  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">

    <div className="bg-white rounded-3xl p-10 w-full max-w-md">

      <h2 className="text-4xl font-black text-center text-green-700">
        Customer Login
      </h2>

      <p className="text-center text-gray-500 mt-3">
        Login with mobile OTP
      </p>

      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        className="w-full border rounded-2xl px-5 py-4 mt-8"
      />

      <button
        onClick={sendOtp}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold mt-5"
      >
        Send OTP
      </button>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value)
        }
        className="w-full border rounded-2xl px-5 py-4 mt-5"
      />
      <div
        id="recaptcha-container"
        className="mt-5"
        ></div>

      <button
        onClick={verifyOtp}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold mt-5"
      >
        Verify OTP
      </button>

      <button
        onClick={() =>
          setShowLogin(false)
        }
        className="w-full mt-4 text-gray-500 font-bold"
      >
        Close
      </button>

    </div>

  </div>

)}
    </div>
    
  );
}