import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import heroImage from "../assets/logo3.png";

export default function FarmFreshDairyWebsite() {
  const [products, setProducts] = useState([]);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwDo-NO1_Ul5WQNUvsUowPQG2rgebzgX47SGyfJFTa5m6vdKqk01TAdc6KC9rhZs_yD/exec";

  useEffect(() => {
    fetch(SCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlePayment = (amount, planName) => {
  const options = {
    key: "YOUR_RAZORPAY_KEY_ID",

    amount: amount * 100,

    currency: "INR",

    name: "Farm Fresh Dairy",

    description: planName,

    image: logo,

    handler: function (response) {
      alert(
        "Payment Successful\nPayment ID: " +
          response.razorpay_payment_id
      );
    },

    theme: {
      color: "#16a34a",
    },
  };

  const razor = new window.Razorpay(options);

  razor.open();
};

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

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
                src={logo}
                alt="Farm Fresh Dairy"
                className="w-16 h-16 rounded-full object-cover shadow-lg"/>

            <div>
              <h1 className="font-bold text-2xl">
                Farm Fresh Dairy
              </h1>

              <p className="text-gray-500">
                Pure Milk Delivered Daily
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              document
                .getElementById("products")
                .scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl"
          >
            Order Now
          </button>
        </div>
      </header>

      {/* HERO */}
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
      </div>
    </div>
  </div>
</section>
      {/* FEATURES */}
      <section className="py-16 bg-gray-50">
        {/* FEATURES SECTION */}
<div
  style={{
    width: "90%",
    maxWidth: "1250px",
    margin: "-120px auto 40px",
    background: "#ffffff",
    borderRadius: "35px",
    padding: "30px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    boxShadow: "0 10px 35px rgba(0,0,0,0.18)",
    position: "relative",
    zIndex: "20",
  }}
>
  {/* FEATURE 1 */}
  <div
    style={{
      flex: "1",
      minWidth: "220px",
      textAlign: "center",
      padding: "10px",
      borderRight: "1px solid #e5e5e5",
    }}
  >
    <div
      style={{
        width: "90px",
        height: "90px",
        margin: "0 auto 15px",
        borderRadius: "50%",
        background: "#e8f8e8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "42px",
      }}
    >
      🌿
    </div>

    <h3
      style={{
        color: "#169447",
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "10px",
      }}
    >
      100% Organic
    </h3>

    <p
      style={{
        color: "#444",
        fontSize: "17px",
        lineHeight: "1.7",
      }}
    >
      No chemicals &
      <br />
      preservatives
    </p>
  </div>

  {/* FEATURE 2 */}
  <div
    style={{
      flex: "1",
      minWidth: "220px",
      textAlign: "center",
      padding: "10px",
      borderRight: "1px solid #e5e5e5",
    }}
  >
    <div
      style={{
        width: "90px",
        height: "90px",
        margin: "0 auto 15px",
        borderRadius: "50%",
        background: "#e8f0ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "42px",
      }}
    >
      🥛
    </div>

    <h3
      style={{
        color: "#2563eb",
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "10px",
      }}
    >
      Pure & Fresh
    </h3>

    <p
      style={{
        color: "#444",
        fontSize: "17px",
        lineHeight: "1.7",
      }}
    >
      Hygienic &
      <br />
      premium quality
    </p>
  </div>

  {/* FEATURE 3 */}
  <div
    style={{
      flex: "1",
      minWidth: "220px",
      textAlign: "center",
      padding: "10px",
      borderRight: "1px solid #e5e5e5",
    }}
  >
    <div
      style={{
        width: "90px",
        height: "90px",
        margin: "0 auto 15px",
        borderRadius: "50%",
        background: "#fff3df",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "42px",
      }}
    >
      🚚
    </div>

    <h3
      style={{
        color: "#d97706",
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "10px",
      }}
    >
      Farm Direct
    </h3>

    <p
      style={{
        color: "#444",
        fontSize: "17px",
        lineHeight: "1.7",
      }}
    >
      Straight from
      <br />
      our farm
    </p>
  </div>

  {/* FEATURE 4 */}
  <div
    style={{
      flex: "1",
      minWidth: "220px",
      textAlign: "center",
      padding: "10px",
    }}
  >
    <div
      style={{
        width: "90px",
        height: "90px",
        margin: "0 auto 15px",
        borderRadius: "50%",
        background: "#ffe8ef",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "42px",
      }}
    >
      ❤️
    </div>

    <h3
      style={{
        color: "#e11d48",
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "10px",
      }}
    >
      Healthy & Nutritious
    </h3>

    <p
      style={{
        color: "#444",
        fontSize: "17px",
        lineHeight: "1.7",
      }}
    >
      Goodness in
      <br />
      every drop
    </p>
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
            {products.map((product, index) => (
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
                    id={`qty-${index}`}
                    type="number"
                    min="1"
                    placeholder="Enter Quantity / Liters"
                    className="w-full border rounded-2xl px-5 py-4 mt-6"
                  />

                  <button
                    onClick={() => {
                      const qty = document.getElementById(
                        `qty-${index}`
                      ).value;

                      if (!qty || qty <= 0) {
                        alert("Please enter quantity");
                        return;
                      }
                        window.location.assign(
                        `/subscribe?product=${product.name}&qty=${qty}`
                        );
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg mt-6"
                  >
                    Order Now
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
                  {plan.price}
                </div>

                <button
                    onClick={() =>
                        handlePayment(999, "Monthly Buffalo Milk Plan")
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
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
            className="w-90 h-90 object-contain"
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

      DESCRIPTION
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

            <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* CONTACT */}
<section className="py-20 bg-white">
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
    </div>
    
  );
}