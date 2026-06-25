import { useEffect, useMemo, useState } from "react";
import logo from "../assets/logo.png";
import heroImage from "../assets/logo3.png";
import { useNavigate } from "react-router-dom";

export default function FarmFreshDairyWebsite() {
  const navigate = useNavigate();

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const plans = [
    {
      title: "Starter Plan",
      qty: "500ml Daily",
      price: 1199,
      desc: "Perfect for 1 person",
      badge: "Popular",
    },
    {
      title: "Family Plan",
      qty: "1L Daily",
      price: 2699,
      desc: "Best for family use",
      badge: "Best Value",
    },
    {
      title: "Premium Plan",
      qty: "2L Daily",
      price: 5399,
      desc: "Large family / business",
      badge: "Premium",
    },
  ];

  const features = [
    {
      icon: "🥛",
      title: "100% Farm Fresh",
      desc: "Pure fresh milk directly from our dairy farm.",
    },
    {
      icon: "🚚",
      title: "Daily Home Delivery",
      desc: "Morning and evening delivery to your doorstep.",
    },
    {
      icon: "📱",
      title: "Easy Mobile Ordering",
      desc: "Order products, subscriptions, and track delivery from mobile.",
    },
    {
      icon: "💚",
      title: "Healthy & Hygienic",
      desc: "Clean handling, fresh packing, and quality you can trust.",
    },
  ];

  const stats = [
    { label: "Happy Families", value: "500+" },
    { label: "Daily Deliveries", value: "200+" },
    { label: "Farm Fresh Quality", value: "100%" },
    { label: "Support", value: "24/7" },
  ];

  const safeCart = () => {
    try {
      const raw = JSON.parse(localStorage.getItem("cart") || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  };

  const refreshCartCount = () => {
    const cart = safeCart();
    const total = cart.reduce(
      (sum, item) => sum + Number(item.qty || 0),
      0
    );
    setCartCount(total);
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${SCRIPT_URL}?action=products`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data && Array.isArray(data.data)) {
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
    refreshCartCount();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleProductOrder = (product) => {
    const qty = Number(quantity[product.name] || 0);

    if (!qty || qty <= 0) {
      alert("Please enter quantity");
      return;
    }

    const cartItem = {
      name: product.name,
      price: Number(product.price || 0),
      image: product.image,
      qty,
      size: "1L",
      total: Number(product.price || 0) * qty,
    };

    const isCustomerLoggedIn =
      localStorage.getItem("customerLogin") === "true";

    if (!isCustomerLoggedIn) {
      localStorage.setItem("pendingCartItem", JSON.stringify(cartItem));
      navigate("/auth");
      return;
    }

    const cart = safeCart();
    const existing = cart.find((item) => item.name === product.name);

    if (existing) {
      existing.qty += qty;
      existing.total = existing.qty * Number(existing.price || 0);
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCartCount();
    alert(`${product.name} added to cart`);
    navigate("/cart");
  };

  const topProducts = useMemo(
    () => (Array.isArray(products) ? products.slice(0, 6) : []),
    [products]
  );

  return (
    <div className="min-h-screen bg-[#f8fff8] text-gray-800 overflow-x-hidden pb-24 lg:pb-0">
      {/* Animations */}
      <style>{`
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.35); }
          50% { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-floatY { animation: floatY 4s ease-in-out infinite; }
        .animate-glow { animation: pulseGlow 2.2s infinite; }
        .animate-fadeUp { animation: fadeUp .8s ease forwards; }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-black/45" />

        <div className="absolute top-16 left-6 sm:left-12 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/10 blur-xl animate-floatY" />
        <div className="absolute bottom-16 right-8 sm:right-20 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-green-400/20 blur-2xl animate-floatY" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div className="text-white animate-fadeUp">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-2 text-xs sm:text-sm font-semibold backdrop-blur-md">
                🌿 100% Farm Fresh Milk
              </div>

              <h2 className="mt-5 text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                Fresh Milk
                <span className="block text-green-400">
                  Delivered Every Morning
                </span>
              </h2>

              <p className="mt-5 sm:mt-6 text-sm sm:text-lg lg:text-xl text-gray-200 max-w-2xl leading-relaxed">
                Natural farm milk with hygienic packaging, fast home delivery,
                subscription plans, and easy ordering from mobile or WhatsApp.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold border border-white/15">
                  🚚 Same Day Delivery
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold border border-white/15">
                  🥛 Pure Cow & Buffalo Milk
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold border border-white/15">
                  📱 Easy Mobile Order
                </span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigate("/products")}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-lg animate-glow"
                >
                  🛒 Order Now
                </button>

                <button
                  onClick={() => scrollToSection("plans")}
                  className="bg-white/10 hover:bg-white/20 border border-white/25 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base backdrop-blur-md"
                >
                  Subscribe Now
                </button>

                <button
                  onClick={() =>
                    window.open("https://wa.me/919989663837", "_blank")
                  }
                  className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base"
                >
                  WhatsApp Order
                </button>
              </div>
            </div>

            {/* Right Card */}
            <div className="flex justify-center lg:justify-end animate-fadeUp">
              <div className="w-full max-w-sm rounded-[28px] bg-white/95 backdrop-blur-md shadow-2xl p-4 sm:p-5 border border-white/50">
                <div className="rounded-[24px] bg-gradient-to-br from-green-50 to-white p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={logo}
                      alt="Farm Fresh Dairy"
                      className="w-14 h-14 rounded-full object-cover border border-green-100"
                    />
                    <div>
                      <h3 className="font-black text-green-800 text-lg">
                        Farm Fresh Dairy
                      </h3>
                      <p className="text-xs text-gray-500">
                        Fresh milk • Fast delivery
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="font-bold">Cow Milk</p>
                        <p className="text-sm text-gray-500">1L Daily</p>
                      </div>
                      <div className="text-green-600 font-black text-lg">
                        ₹60
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="font-bold">Buffalo Milk</p>
                        <p className="text-sm text-gray-500">1L Daily</p>
                      </div>
                      <div className="text-green-600 font-black text-lg">
                        ₹80
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="font-bold">Fresh Curd</p>
                        <p className="text-sm text-gray-500">500ml</p>
                      </div>
                      <div className="text-green-600 font-black text-lg">
                        ₹50
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/subscription")}
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold"
                  >
                    Start Subscription
                  </button>

                  <button
                    onClick={() => navigate("/products")}
                    className="w-full mt-3 bg-green-50 hover:bg-green-100 text-green-700 py-3.5 rounded-2xl font-bold"
                  >
                    View Products
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white/90 backdrop-blur-md p-5 shadow-lg border border-green-100 text-center"
              >
                <div className="text-2xl sm:text-3xl font-black text-green-700">
                  {item.value}
                </div>
                <div className="text-sm sm:text-base text-gray-600 mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
              Why Choose Farm Fresh Dairy
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-lg max-w-3xl mx-auto">
              Fresh quality dairy products, reliable delivery, and a smooth
              mobile ordering experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl border border-green-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-xl font-black text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="py-14 sm:py-16 lg:py-20 bg-white px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
                Our Dairy Products
              </h2>
              <p className="text-gray-500 mt-3 text-sm sm:text-lg">
                Freshly packed dairy products with premium quality.
              </p>
            </div>

            <button
              onClick={() => navigate("/products")}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold"
            >
              View All Products
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-green-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 sm:h-64 w-full object-cover"
                  />

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold text-green-700 shadow">
                    {Number(product.stock || 0) > 0
                      ? "In Stock"
                      : "Out Of Stock"}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                      {product.name}
                    </h3>

                    <div className="text-right shrink-0">
                      <div className="text-green-600 text-2xl sm:text-3xl font-black">
                        ₹{product.price}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        per litre
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                    Stock: {product.stock} L
                  </div>

                  <div className="mt-5">
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter quantity / liters"
                      value={quantity[product.name] || ""}
                      onChange={(e) =>
                        setQuantity({
                          ...quantity,
                          [product.name]: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
                    />
                  </div>

                  <button
                    disabled={Number(product.stock || 0) <= 0}
                    onClick={() => handleProductOrder(product)}
                    className={`w-full mt-4 py-3.5 rounded-2xl font-bold text-white ${
                      Number(product.stock || 0) <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                    }`}
                  >
                    {Number(product.stock || 0) <= 0
                      ? "Out Of Stock"
                      : "🛒 Order Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION PLANS */}
      <section
        id="plans"
        className="py-14 sm:py-16 lg:py-20 bg-green-50 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
              Milk Subscription Plans
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-lg max-w-3xl mx-auto">
              Flexible monthly plans for your family with daily delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  i === 1
                    ? "border-green-500 ring-2 ring-green-100"
                    : "border-green-100"
                }`}
              >
                <div className="absolute top-5 right-5 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-gray-900">
                  {plan.title}
                </h3>

                <p className="text-gray-500 mt-3 text-lg">{plan.qty}</p>
                <p className="text-gray-500 mt-1">{plan.desc}</p>

                <div className="mt-8 text-4xl sm:text-5xl font-black text-green-600">
                  ₹{plan.price}
                  <span className="text-base sm:text-lg text-gray-500 font-semibold">
                    {" "}
                    / Month
                  </span>
                </div>

                <ul className="mt-6 space-y-3 text-gray-700">
                  <li>✔ Fresh daily delivery</li>
                  <li>✔ Easy pause / resume</li>
                  <li>✔ Customer support</li>
                  <li>✔ Farm fresh quality</li>
                </ul>

                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/subscription")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold"
                  >
                    Choose Plan
                  </button>

                  <button
                    onClick={() => navigate("/subscription")}
                    className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3.5 rounded-2xl font-bold"
                  >
                    View Subscription Page
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND SECTION */}
      <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] lg:rounded-[50px] p-6 sm:p-10 lg:p-14 shadow-2xl border border-green-100 text-center">
            <div className="flex justify-center">
              <div className="w-36 h-36 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-full bg-green-600 flex items-center justify-center shadow-2xl overflow-hidden animate-floatY">
                <img
                  src={logo}
                  alt="Farm Fresh Dairy"
                  className="w-[90%] h-[90%] object-contain"
                />
              </div>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mt-8 text-green-800 leading-tight">
              FARM FRESH
            </h2>

            <p className="text-base sm:text-2xl tracking-[0.2em] sm:tracking-[0.35em] text-gray-500 mt-2 sm:mt-3">
              DAIRY MILK
            </p>

            <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 sm:px-8 py-3 rounded-full font-bold text-sm sm:text-lg shadow">
              🌿 Premium Natural Milk Brand
            </div>

            <p className="mt-6 sm:mt-8 text-gray-600 text-sm sm:text-lg lg:text-xl leading-7 sm:leading-9 max-w-3xl mx-auto">
              Fresh farm milk delivered daily with hygienic packaging,
              premium quality, and natural nutrition for your family.
            </p>
          </div>
        </div>
      </section>

      {/* MOBILE / APP SECTION */}
      <section className="py-14 sm:py-16 lg:py-20 bg-green-600 text-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Mobile Friendly
              <span className="block text-green-100">
                Milk Ordering Experience
              </span>
            </h2>

            <p className="mt-5 sm:mt-8 text-base sm:text-xl lg:text-2xl text-green-100 leading-relaxed max-w-2xl">
              Customers can subscribe, pause deliveries, and order milk directly
              from mobile devices with WhatsApp support and easy checkout.
            </p>

            <div className="mt-8 space-y-3 sm:space-y-4 text-base sm:text-xl">
              <div>✔ WhatsApp Integration</div>
              <div>✔ QR / Online Payment Support</div>
              <div>✔ Delivery Notifications</div>
              <div>✔ Subscription Dashboard</div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/products")}
                className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-2xl font-bold"
              >
                Order Products
              </button>

              <button
                onClick={() => navigate("/subscription")}
                className="bg-black/20 border border-white/20 hover:bg-black/30 px-6 py-3 rounded-2xl font-bold"
              >
                Start Subscription
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm bg-white rounded-[34px] sm:rounded-[40px] p-4 shadow-2xl text-black">
              <div className="rounded-[28px] sm:rounded-[32px] overflow-hidden bg-gray-100">
                <div className="bg-green-600 text-white p-4 sm:p-5 text-center font-bold text-lg sm:text-2xl">
                  Farm Fresh Dairy
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between gap-3">
                    <div>
                      <div className="font-bold">Cow Milk</div>
                      <div className="text-gray-500 text-sm">1L Daily</div>
                    </div>
                    <div className="text-green-600 font-bold">₹60</div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between gap-3">
                    <div>
                      <div className="font-bold">Buffalo Milk</div>
                      <div className="text-gray-500 text-sm">1L Daily</div>
                    </div>
                    <div className="text-green-600 font-bold">₹80</div>
                  </div>

                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold"
                    onClick={() => navigate("/subscription")}
                  >
                    Subscribe Now
                  </button>

                  <button
                    className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3.5 rounded-2xl font-bold"
                    onClick={() => navigate("/products")}
                  >
                    Shop Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-14 sm:py-16 lg:py-20 bg-white px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
              Contact Us
            </h2>

            <p className="text-gray-600 mt-5 sm:mt-6 text-sm sm:text-lg lg:text-xl leading-7 sm:leading-9 max-w-2xl">
              Farm Fresh Dairy delivers pure and hygienic milk directly from our
              dairy farm to customers every morning. We provide Cow Milk,
              Buffalo Milk, Fresh Curd, and monthly subscription plans with
              home delivery service.
            </p>

            <div className="mt-8 space-y-4 text-base sm:text-xl">
              <div>📞 +91 9989663837</div>
              <div>📞 +91 75693 17209</div>
              <div>📍 Telangana, India</div>
              <div>⏰ Delivery: 5AM - 8AM and 6PM - 9PM</div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  window.open("https://wa.me/919989663837", "_blank")
                }
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold"
              >
                WhatsApp Us
              </button>

              <button
                onClick={() => navigate("/products")}
                className="bg-green-50 hover:bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-bold"
              >
                Shop Now
              </button>
            </div>
          </div>

          <div className="bg-green-50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border border-green-100">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6">
              Quick Enquiry
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
              />

              <textarea
                rows="5"
                placeholder="Message"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-200"
              />

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold text-base sm:text-lg">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-950 text-white px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Farm Fresh Dairy"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-2xl font-black">Farm Fresh Dairy</h3>
                  <p className="text-green-100 text-sm">
                    Pure Milk Delivered Daily
                  </p>
                </div>
              </div>

              <p className="mt-4 text-green-100 leading-7 max-w-md">
                Fresh dairy products, subscriptions, and daily delivery for your
                family.
              </p>
            </div>

            <div>
              <h4 className="font-black text-xl mb-4">Quick Links</h4>
              <div className="flex flex-col gap-3 text-green-100">
                <button
                  onClick={() => scrollToSection("products")}
                  className="text-left hover:text-white"
                >
                  Products
                </button>
                <button
                  onClick={() => scrollToSection("plans")}
                  className="text-left hover:text-white"
                >
                  Plans
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left hover:text-white"
                >
                  Contact
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="text-left hover:text-white"
                >
                  Shop
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-black text-xl mb-4">Policies</h4>
              <div className="flex flex-col gap-3 text-green-100">
                <a href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </a>
                <a href="/refund-policy" className="hover:text-white">
                  Refund Policy
                </a>
                <a href="/shipping-policy" className="hover:text-white">
                  Shipping Policy
                </a>
                <a href="/terms" className="hover:text-white">
                  Terms & Conditions
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-green-900 text-center text-green-100 text-sm">
            © {new Date().getFullYear()} Farm Fresh Dairy. All rights reserved.
          </div>
        </div>
      </footer>

      {/* FLOATING CART BUTTON */}
      <button
        onClick={() => navigate("/cart")}
        className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-2xl flex items-center justify-center text-2xl animate-glow"
      >
        🛒
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* MOBILE BOTTOM CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-green-100 bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-3 gap-2 p-3">
          <button
            onClick={() => navigate("/products")}
            className="bg-green-600 text-white py-3 rounded-2xl font-bold text-sm"
          >
            Shop
          </button>

          <button
            onClick={() => navigate("/subscription")}
            className="bg-green-50 text-green-700 py-3 rounded-2xl font-bold text-sm"
          >
            Subscribe
          </button>

          <button
            onClick={() =>
              window.open("https://wa.me/919989663837", "_blank")
            }
            className="bg-emerald-500 text-white py-3 rounded-2xl font-bold text-sm"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}