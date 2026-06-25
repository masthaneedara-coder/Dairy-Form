import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [cartCount, setCartCount] = useState(0);

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
    const total = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    setCartCount(total);
  };

  const getPrice = (basePrice, size) => {
    switch (size) {
      case "250ml":
        return Math.round(basePrice * 0.25);
      case "500ml":
        return Math.round(basePrice * 0.5);
      case "1L":
        return basePrice;
      case "2L":
        return basePrice * 2;
      case "3L":
        return basePrice * 3;
      case "5L":
        return basePrice * 5;
      default:
        return basePrice;
    }
  };

  useEffect(() => {
    fetch(`${SCRIPT_URL}?action=products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Products Fetch Error:", err);
        setProducts([]);
      });

    refreshCartCount();
  }, []);

  const increaseQty = (product) => {
    const current = quantities[product.name] || 1;

    if (current < Number(product.stock || 9999)) {
      setQuantities((prev) => ({
        ...prev,
        [product.name]: current + 1,
      }));
    }
  };

  const decreaseQty = (product) => {
    const current = quantities[product.name] || 1;

    if (current > 1) {
      setQuantities((prev) => ({
        ...prev,
        [product.name]: current - 1,
      }));
    }
  };

  const addToCart = (product) => {
    const isCustomerLoggedIn =
      localStorage.getItem("customerLogin") === "true";

    const qty = quantities[product.name] || 1;
    const size = selectedSizes[product.name] || "1L";
    const price = getPrice(Number(product.price), size);

    const cartItem = {
      name: product.name,
      image: product.image,
      size,
      qty,
      price,
      total: price * qty,
    };

    // If not logged in → save item and redirect to auth
    if (!isCustomerLoggedIn) {
      localStorage.setItem("pendingCartItem", JSON.stringify(cartItem));
      localStorage.setItem("afterLoginRedirect", "/cart");
      alert("Please login/signup to continue");
      navigate("/auth");
      return;
    }

    const cart = safeCart();

    const existing = cart.find(
      (item) => item.name === product.name && item.size === size
    );

    if (existing) {
      existing.qty += qty;
      existing.total = existing.qty * existing.price;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCartCount();

    alert(`${product.name} added to cart`);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 overflow-hidden">
      {/* LOCAL ANIMATIONS */}
      <style>{`
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 rgba(34,197,94,0.0); }
          50% { box-shadow: 0 12px 30px rgba(34,197,94,0.18); }
        }

        @keyframes zoomSoft {
          0% { transform: scale(1); }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }

        .animate-floatY {
          animation: floatY 4s ease-in-out infinite;
        }

        .animate-fadeUp {
          animation: fadeUp 0.7s ease forwards;
        }

        .product-card {
          animation: fadeUp 0.7s ease forwards;
        }

        .product-card:hover {
          transform: translateY(-8px);
          transition: all 0.35s ease;
          box-shadow: 0 18px 40px rgba(16, 185, 129, 0.15);
        }

        .product-image-wrap {
          overflow: hidden;
        }

        .product-card:hover .product-image {
          transform: scale(1.06);
          transition: transform 0.5s ease;
        }

        .cart-float {
          animation: pulseGlow 2.5s infinite;
        }

        .hero-badge {
          animation: pulseGlow 2.8s infinite;
        }

        .hero-title {
          animation: fadeUp 0.8s ease forwards;
        }

        .hero-subtitle {
          animation: fadeUp 1s ease forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-green-100 bg-gradient-to-br from-[#f7fff8] via-white to-[#eefaf0] px-4 sm:px-6 py-8 sm:py-10 md:px-10 md:py-12 shadow-[0_10px_40px_rgba(34,197,94,0.08)]">
          {/* floating icons */}
          <span className="absolute top-5 left-5 text-2xl sm:text-3xl animate-floatY">
            🍃
          </span>
          <span className="absolute top-10 right-12 text-2xl sm:text-3xl animate-floatY">
            🌿
          </span>
          <span className="absolute bottom-8 left-1/4 text-2xl sm:text-3xl animate-floatY">
            🥛
          </span>
          <span className="absolute bottom-10 right-1/4 text-2xl sm:text-3xl animate-floatY">
            🌱
          </span>

          {/* Cart button */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20">
            <button
              onClick={() => navigate("/cart")}
              className="cart-float relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/90 backdrop-blur-md border border-green-100 text-green-700 shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl sm:text-3xl">🛒</span>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[22px] h-6 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative z-10 text-center">
            <div className="hero-badge inline-flex items-center justify-center gap-2 rounded-full border border-green-100 bg-white/90 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-green-700 shadow-sm backdrop-blur-md">
              <span>🌿</span>
              <span>100% Natural & Fresh Dairy</span>
            </div>

            <h1 className="hero-title mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-green-950">
              Our Dairy Products
            </h1>

            <p className="hero-subtitle mx-auto mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
              Pure milk, fresh curd, paneer and healthy dairy products delivered
              to your doorstep with farm freshness.
            </p>

            <div className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="mt-8 sm:mt-10">
          <div className="mb-5 sm:mb-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-green-800">
              Fresh Products
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Choose your product, size and quantity
            </p>
          </div>

          {/* 
            MOBILE = 1 column
            TABLET = 2 columns
            DESKTOP = 3 columns
          */}
         <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-5">
            {Array.isArray(products) &&
              products.map((product, index) => (
                <div
                  key={index}
                  className={`product-card bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col border border-green-100 transition-all duration-300 ${
                    Number(product.stock) === 0 ? "opacity-70" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* image */}
                  <div className="relative product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image w-full h-56 sm:h-64 md:h-64 object-cover transition-all duration-500"
                    />

                    <div className="absolute top-4 left-4">
                      {Number(product.stock) > 0 ? (
                        <span className="bg-white/90 backdrop-blur-md text-green-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow">
                          In Stock
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow">
                          Out Of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    {/* name */}
                    <h3 className="text-xl sm:text-2xl font-black text-center text-gray-900">
                      {product.name}
                    </h3>

                    {/* price */}
                    <p className="text-green-600 text-2xl sm:text-3xl font-black text-center mt-2">
                      ₹
                      {getPrice(
                        Number(product.price),
                        selectedSizes[product.name] || "1L"
                      )}
                    </p>

                    <p className="text-center font-semibold mt-2 text-gray-600 text-sm sm:text-base">
                      Stock: {product.stock}
                    </p>

                    {/* stock notice */}
                    <div className="h-14 flex items-center justify-center mt-2">
                      {Number(product.stock) > 0 &&
                        Number(product.stock) < 5 && (
                          <div className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-xl text-sm font-semibold text-center w-full">
                            ⚠️ Only {product.stock} left
                          </div>
                        )}

                      {Number(product.stock) === 0 && (
                        <div className="bg-red-100 text-red-700 px-3 py-2 rounded-xl text-sm font-semibold text-center w-full">
                          ❌ Out Of Stock
                        </div>
                      )}
                    </div>

                    {/* size */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Size
                      </label>

                      <select
                        value={selectedSizes[product.name] || "1L"}
                        onChange={(e) =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [product.name]: e.target.value,
                          }))
                        }
                        className="w-full border rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-green-200 text-sm sm:text-base"
                      >
                        <option value="250ml">250ml</option>
                        <option value="500ml">500ml</option>
                        <option value="1L">1 Liter</option>
                        <option value="2L">2 Liter</option>
                        <option value="3L">3 Liter</option>
                        <option value="5L">5 Liter</option>
                      </select>
                    </div>

                    {/* qty */}
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button
                        disabled={Number(product.stock) === 0}
                        onClick={() => decreaseQty(product)}
                        className="w-11 h-11 rounded-full bg-red-500 text-white text-xl font-bold disabled:opacity-50 hover:scale-105 transition"
                      >
                        -
                      </button>

                      <span className="font-black text-lg w-10 text-center">
                        {quantities[product.name] || 1}
                      </span>

                      <button
                        disabled={Number(product.stock) === 0}
                        onClick={() => increaseQty(product)}
                        className="w-11 h-11 rounded-full bg-green-500 text-white text-xl font-bold disabled:opacity-50 hover:scale-105 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* button */}
                    <div className="mt-auto pt-5">
                      <button
                        disabled={Number(product.stock) === 0}
                        onClick={() => addToCart(product)}
                        className={`w-full py-3.5 rounded-2xl font-bold text-white transition-all duration-300 ${
                          Number(product.stock) === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 hover:shadow-xl hover:-translate-y-0.5"
                        }`}
                      >
                        {Number(product.stock) === 0
                          ? "Out Of Stock"
                          : "Add To Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* no products */}
          {products.length === 0 && (
            <div className="mt-10 bg-white rounded-3xl p-10 text-center shadow">
              <div className="text-5xl mb-3">🥛</div>
              <h2 className="text-2xl font-bold text-gray-600">
                No products found
              </h2>
              <p className="text-gray-500 mt-2">
                Please add products in your admin sheet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}