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
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 rgba(34,197,94,0); }
          50% { box-shadow: 0 12px 28px rgba(34,197,94,0.16); }
        }

        .product-card {
          animation: fadeUp 0.65s ease forwards;
        }

        .product-card:hover {
          transform: translateY(-6px);
          transition: all 0.35s ease;
          box-shadow: 0 18px 40px rgba(16, 185, 129, 0.16);
        }

        .product-image-wrap {
          overflow: hidden;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
          transition: transform 0.5s ease;
        }

        .animate-floatY {
          animation: floatY 4s ease-in-out infinite;
        }

        .cart-float {
          animation: pulseGlow 2.5s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-green-100 bg-gradient-to-br from-[#f7fff8] via-white to-[#eefaf0] px-4 sm:px-6 py-8 sm:py-10 md:px-10 md:py-12 shadow-[0_10px_40px_rgba(34,197,94,0.08)]">
          <span className="absolute top-5 left-5 text-2xl sm:text-3xl animate-floatY">
            🍃
          </span>
          <span className="absolute top-10 right-12 text-2xl sm:text-3xl animate-floatY">
            🌿
          </span>
          <span className="absolute bottom-8 left-1/4 text-2xl sm:text-3xl animate-floatY">
            🥛
          </span>

          {/* CART BUTTON */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20">
            <button
              onClick={() => navigate("/cart")}
              className="cart-float relative flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white/90 backdrop-blur-md border border-green-100 text-green-700 shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-xl sm:text-3xl">🛒</span>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[22px] h-6 px-1 rounded-full bg-red-500 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-green-100 bg-white/90 px-4 sm:px-5 py-2 text-[11px] sm:text-sm font-semibold text-green-700 shadow-sm backdrop-blur-md">
              <span>🌿</span>
              <span>100% Natural & Fresh Dairy</span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-green-950">
              Our Dairy Products
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-base leading-relaxed text-slate-600">
              Pure milk, curd and fresh dairy products delivered with farm freshness.
            </p>

            <div className="mx-auto mt-4 sm:mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
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

          {/* MOBILE = 2 PRODUCTS | DESKTOP = 3 PRODUCTS */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {Array.isArray(products) &&
              products.map((product, index) => {
                const stock = Number(product.stock || 0);
                const currentPrice = getPrice(
                  Number(product.price),
                  selectedSizes[product.name] || "1L"
                );

                return (
                  <div
                    key={index}
                    className={`product-card bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden flex flex-col border border-green-100 transition-all duration-300 ${
                      stock === 0 ? "opacity-70" : ""
                    }`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    {/* IMAGE */}
                    <div className="relative product-image-wrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image w-full h-36 sm:h-44 md:h-56 object-cover transition-all duration-500"
                      />

                      {/* TOP LEFT - STOCK STATUS */}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        {stock > 0 ? (
                          <span className="bg-white/95 text-green-700 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow">
                            In Stock
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow">
                            Out Of Stock
                          </span>
                        )}
                      </div>

                      {/* TOP RIGHT - STOCK COUNT */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow ${
                            stock > 0
                              ? "bg-green-600 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {stock}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
                      {/* NAME */}
                      <h3 className="text-base sm:text-xl md:text-2xl font-black text-center text-gray-900 leading-tight min-h-[40px] sm:min-h-[56px] flex items-center justify-center">
                        {product.name}
                      </h3>

                      {/* PRICE */}
                      <p className="text-green-600 text-lg sm:text-2xl md:text-3xl font-black text-center mt-1">
                        ₹{currentPrice}
                      </p>

                      {/* LOW STOCK WARNING */}
                      <div className="mt-2 min-h-[38px] sm:min-h-[44px] flex items-center justify-center">
                        {stock > 0 && stock < 5 && (
                          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-semibold text-center w-full">
                            ⚠️ Only {stock} left
                          </div>
                        )}

                        {stock === 0 && (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-semibold text-center w-full">
                            ❌ Out
                          </div>
                        )}
                      </div>

                      {/* SIZE */}
                      <div className="mt-3">
                        <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                          Size
                        </label>

                        <select
                          value={selectedSizes[product.name] || "1L"}
                          onChange={(e) =>
                            setSelectedSizes((prev) => ({
                              ...prev,
                              [product.name]: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-2 sm:py-3 outline-none focus:ring-2 focus:ring-green-200 text-[11px] sm:text-base"
                        >
                          <option value="250ml">250ml</option>
                          <option value="500ml">500ml</option>
                          <option value="1L">1 Liter</option>
                          <option value="2L">2 Liter</option>
                          <option value="3L">3 Liter</option>
                          <option value="5L">5 Liter</option>
                        </select>
                      </div>

                      {/* QTY */}
                      <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3">
                        <button
                          disabled={stock === 0}
                          onClick={() => decreaseQty(product)}
                          className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-red-500 text-white text-lg sm:text-xl font-bold disabled:opacity-50 hover:scale-105 transition"
                        >
                          -
                        </button>

                        <span className="font-black text-sm sm:text-lg w-8 sm:w-10 text-center">
                          {quantities[product.name] || 1}
                        </span>

                        <button
                          disabled={stock === 0}
                          onClick={() => increaseQty(product)}
                          className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-green-500 text-white text-lg sm:text-xl font-bold disabled:opacity-50 hover:scale-105 transition"
                        >
                          +
                        </button>
                      </div>

                      {/* BUTTON */}
                      <div className="mt-auto pt-4">
                        <button
                          disabled={stock === 0}
                          onClick={() => addToCart(product)}
                          className={`w-full py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-[12px] sm:text-base text-white transition-all duration-300 ${
                            stock === 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 hover:shadow-xl hover:-translate-y-0.5"
                          }`}
                        >
                          {stock === 0 ? "Out Of Stock" : "Add To Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* EMPTY */}
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