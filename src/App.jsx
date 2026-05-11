export default function FarmFreshDairyWebsite() {
  const products = [
    {
      name: "Cow Milk",
      price: "₹60/L",
      image:
        "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Buffalo Milk",
      price: "₹80/L",
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Fresh Curd",
      price: "₹50/Box",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const plans = [
    {
      title: "Starter Plan",
      qty: "500ml Daily",
      price: "₹900 / Month",
    },
    {
      title: "Family Plan",
      qty: "1L Daily",
      price: "₹1800 / Month",
    },
    {
      title: "Premium Plan",
      qty: "2L Daily",
      price: "₹3500 / Month",
    },
  ];

  const labels = [
    {
      title: "Premium Cow Milk Label",
      image:
        "https://images.unsplash.com/photo-1517448931760-9bf4414148c5?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Fresh Dairy Bottle Label",
      image:
        "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1200&auto=format&fit=crop",
    },
  ];
  const handlePayment = (plan) => {

  const amount =
    plan.title === "Starter Plan"
      ? 900
      : plan.title === "Family Plan"
      ? 1800
      : 3500;

  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: amount * 100,
    currency: "INR",
    name: "Farm Fresh Dairy",
    description: plan.title,
    image: "https://cdn-icons-png.flaticon.com/512/2674/2674486.png",

    handler: function (response) {

      alert(
        "Payment Successful\\nPayment ID: " +
        response.razorpay_payment_id
      );

      window.location.href = "/subscribe?plan=" + plan.title;
    },

    prefill: {
      name: "",
      contact: "",
    },

    theme: {
      color: "#16a34a",
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
};

  return (
    
    <div className="min-h-screen bg-white text-gray-800">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              🥛
            </div>
            <div>
              <h1 className="font-bold text-xl">Farm Fresh Dairy</h1>
              <p className="text-sm text-gray-500">Pure Milk Delivered Daily</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-8 font-medium">
            <a href="#home" className="hover:text-green-600">Home</a>
            <a href="#products" className="hover:text-green-600">Products</a>
            <a href="#plans" className="hover:text-green-600">Plans</a>
            <a href="#labels" className="hover:text-green-600">Labels</a>
            <a href="#contact" className="hover:text-green-600">Contact</a>
          </nav>

          <button className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded-xl shadow-lg">
            Order Now
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1600&auto=format&fit=crop')",
          }}
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-7xl mx-auto px-4 py-28 md:py-40 text-white">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur">
              🌿 100% Farm Fresh Milk
            </div>

            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              Fresh Milk
              <span className="block text-green-400">Delivered Every Morning</span>
            </h2>

            <p className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed">
              Natural farm milk with hygienic packaging and daily home delivery.
              Freshness you can trust for your family.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                  onClick={() => {
                    const section = document.getElementById("plans");
                    section?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-green-600 hover:bg-green-700 transition px-8 py-4 rounded-2xl font-semibold shadow-2xl"
                >
                  Subscribe Now
              </button>

              <button
                  onClick={() => {
                    window.open(
                      "https://wa.me/919989663837?text=Hello%20I%20want%20to%20order%20farm%20fresh%20milk"
                    );
                  }}
                  className="bg-white/10 border border-white/20 backdrop-blur px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition"
                >
                  WhatsApp Order
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-6">
          {[
            "Daily Fresh Delivery",
            "Premium Packaging",
            "Chemical Free",
            "Subscription Available",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-4">🥛</div>
              <h3 className="font-bold text-lg">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black">Our Dairy Products</h2>
            <p className="text-gray-500 mt-4">
              Freshly packed dairy products with premium quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
                className="rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100 hover:-translate-y-2 transition duration-300"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-72 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-bold">{product.name}</h3>
                  <p className="text-green-600 text-xl font-semibold mt-2">
                    {product.price}
                  </p>

                  <button className="mt-5 w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-2xl font-semibold">
                    Add To Subscription
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION */}
      <section id="plans" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black">Milk Subscription Plans</h2>
            <p className="text-gray-600 mt-4">
              Flexible monthly plans for your family.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded-bl-2xl text-sm font-semibold">
                  Popular
                </div>

                <h3 className="text-3xl font-black">{plan.title}</h3>
                <p className="text-gray-500 mt-4">{plan.qty}</p>

                <div className="text-5xl font-black text-green-600 mt-8">
                  {plan.price}
                </div>

                <ul className="mt-8 space-y-3 text-gray-600">
                  <li>✔ Daily Door Delivery</li>
                  <li>✔ Pause Anytime</li>
                  <li>✔ WhatsApp Support</li>
                  <li>✔ Hygienic Packaging</li>
                </ul>

                <button
                  onClick={() => handlePayment(plan)}
                  className="mt-8 w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold text-lg"
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOGO SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black">Dairy Brand Logo</h2>
            <p className="text-gray-500 mt-4">
              Premium minimal dairy logo concept.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-white rounded-[40px] p-12 shadow-2xl border border-green-100 text-center">
            <div className="w-36 h-36 mx-auto rounded-full bg-green-600 flex items-center justify-center text-7xl shadow-2xl text-white">
              🥛
            </div>

            <h3 className="text-5xl font-black mt-8 text-green-700">
              FARM FRESH
            </h3>

            <p className="text-2xl tracking-[0.3em] text-gray-500 mt-3">
              DAIRY MILK
            </p>

            <div className="mt-8 inline-flex items-center gap-2 bg-green-100 px-5 py-3 rounded-full text-green-700 font-semibold">
              Premium Natural Milk Brand
            </div>
          </div>
        </div>
      </section>

      {/* LABELS */}
      <section id="labels" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black">Milk Product Label Design</h2>
            <p className="text-gray-500 mt-4">
              Premium sticker and bottle label inspiration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {labels.map((label, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={label.image}
                  alt={label.title}
                  className="w-full h-96 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-bold">{label.title}</h3>

                  <div className="mt-4 flex gap-3 flex-wrap">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Waterproof
                    </span>
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Premium Finish
                    </span>
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Food Safe
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP SECTION */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-black leading-tight">
              Mobile Friendly
              <span className="block text-green-200">Milk Ordering Experience</span>
            </h2>

            <p className="mt-6 text-lg text-green-100 leading-relaxed">
              Customers can subscribe, pause deliveries, and order milk directly
              from mobile devices.
            </p>

            <div className="mt-8 space-y-4 text-lg">
              <div>✔ WhatsApp Integration</div>
              <div>✔ QR Payment Support</div>
              <div>✔ Delivery Notifications</div>
              <div>✔ Subscription Dashboard</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-80 bg-white rounded-[40px] p-4 shadow-2xl text-black">
              <div className="rounded-[32px] overflow-hidden bg-gray-100">
                <div className="bg-green-600 text-white p-5 text-center font-bold text-xl">
                  Farm Fresh Dairy
                </div>

                <div className="p-5 space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <div className="font-bold">Cow Milk</div>
                      <div className="text-sm text-gray-500">1L Daily</div>
                    </div>
                    <div className="text-green-600 font-bold">₹60</div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <div className="font-bold">Buffalo Milk</div>
                      <div className="text-sm text-gray-500">500ml Daily</div>
                    </div>
                    <div className="text-green-600 font-bold">₹40</div>
                  </div>

                  <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg">
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
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black">Contact Us</h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Daily milk delivery available in nearby villages and towns.
            </p>

            <div className="mt-8 space-y-4 text-lg">
              <div>📞 +91 9989663837</div>
              <div>📞 +91 75693 17209</div>
              <div>📍 Andhra Pradesh, India</div>
              <div>⏰ Delivery: 5AM - 8AM</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-3xl p-8 shadow-xl border border-green-100">
            <h3 className="text-2xl font-bold mb-6">Quick Enquiry</h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500"
              />

              <textarea
                rows="5"
                placeholder="Message"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500"
              />

              <button className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold text-lg">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Farm Fresh Dairy</h3>
            <p className="text-gray-400 mt-2">
              Fresh milk directly from farm to home.
            </p>
          </div>

          <div className="flex gap-6 text-gray-400">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
