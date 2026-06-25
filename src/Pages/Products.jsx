import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const getPrice = (basePrice, size) => {
    const price = Number(basePrice || 0);

    switch (size) {
      case "250ml":
        return Math.round(price * 0.25);
      case "500ml":
        return Math.round(price * 0.5);
      case "1L":
        return price;
      case "2L":
        return price * 2;
      case "3L":
        return price * 3;
      case "5L":
        return price * 5;
      default:
        return price;
    }
  };

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
    const totalQty = cart.reduce(
      (sum, item) => sum + Number(item.qty || 0),
      0
    );
    setCartCount(totalQty);
  };

  const playAddToCartSound = () => {
    try {
      const audio = new Audio(
        "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
      );
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch (err) {
      console.log(err);
    }
  };

  const increaseQty = (product) => {
    const current = quantities[product.name] || 1;
    const stock = Number(product.stock || 0);

    if (current < stock) {
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
    const qty = Number(quantities[product.name] || 1);
    const size = selectedSizes[product.name] || "1L";
    const price = getPrice(product.price, size);

    const cart = safeCart();

    const existing = cart.find(
      (item) => item.name === product.name && item.size === size
    );

    if (existing) {
      existing.qty += qty;
      existing.total = existing.qty * Number(existing.price || 0);
    } else {
      cart.push({
        name: product.name,
        image: product.image,
        size,
        qty,
        price,
        total: price * qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCartCount();
    playAddToCartSound();
    alert(`${product.name} added to cart successfully`);
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
          console.error("Products API did not return array");
          setProducts([]);
        }
      } catch (err) {
        console.error("Products Fetch Error:", err);
        setProducts([]);
      }
    };

    loadProducts();
    refreshCartCount();
  }, []);

  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];

    if (!search.trim()) return list;

    return list.filter((product) =>
      String(product.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-x-hidden pb-24 sm:pb-8">
      <style>{`
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.35); }
          50% { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
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
      <div className="px-2 sm:px-4 lg:px-6 pt-2 sm:pt-4">
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-green-100 bg-gradient-to-br from-[#f7fff8] via-white to-[#eefaf0] px-3 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 shadow-[0_10px_40px_rgba(34,197,94,0.08)]">
          <div className="absolute top-6 left-4 w-14 h-14 rounded-full bg-green-100 blur-xl animate-floatY" />
          <div className="absolute bottom-8 right-8 w-20 h-20 rounded-full bg-emerald-100 blur-2xl animate-floatY" />
          <span className="absolute top-10 right-24 text-2xl animate-floatY hidden sm:block">🍃</span>
          <span className="absolute bottom-10 left-10 text-2xl animate-floatY hidden sm:block">🌿</span>

          {/* cart button */}
          <div className="absolute top-3 right-3 sm:top-8 sm:right-8 z-20">
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-white/90 backdrop-blur-md border border-green-100 text-green-700 shadow-xl hover:scale-105 transition-all duration-300 animate-glow"
            >
              <span className="text-xl sm:text-2xl md:text-3xl">🛒</span>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[22px] h-5 sm:min-w-[24px] sm:h-6 px-1 rounded-full bg-red-500 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative z-10 text-center animate-fadeUp">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-green-100 bg-white/90 px-3 sm:px-5 py-2 text-[10px] sm:text-sm font-semibold text-green-700 shadow-sm backdrop-blur-md">
              <span>🌿</span>
              <span className="tracking-wide">100% Natural & Fresh Dairy</span>
            </div>

            <h2 className="mt-3 sm:mt-4 text-xl sm:text-4xl lg:text-5xl font-black tracking-tight text-green-950">
              Fresh Dairy Products
            </h2>

            <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-[11px] sm:text-base leading-relaxed text-slate-600 px-2">
              Pure, fresh and healthy dairy products delivered daily with quality you can trust.
            </p>

            <div className="mx-auto mt-4 sm:mt-5 h-1.5 w-20 sm:w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>

            {/* Search */}
            <div className="max-w-xl mx-auto mt-4 sm:mt-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-green-100 bg-white px-4 py-3 pr-12 text-sm sm:text-base outline-none shadow-sm focus:ring-2 focus:ring-green-200"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl">
                  🔍
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md border border-green-100 p-10 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-2xl font-black text-gray-700">No Products Found</h3>
            <p className="text-gray-500 mt-2">Try another product name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product, index) => {
              const stock = Number(product.stock || 0);
              const selectedSize = selectedSizes[product.name] || "1L";
              const currentQty = quantities[product.name] || 1;
              const currentPrice = getPrice(product.price, selectedSize);

              return (
                <div
                  key={index}
                  className={`group bg-white rounded-2xl sm:rounded-3xl shadow-md border border-green-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    stock === 0 ? "opacity-70" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-24 sm:h-44 lg:h-56 object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-1 left-1 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                      <span className="bg-white/95 backdrop-blur-md text-green-700 px-1.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-xs font-bold shadow">
                        🥛 Fresh
                      </span>

                      {stock > 0 && stock < 5 && (
                        <span className="bg-yellow-100 text-yellow-700 px-1.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-xs font-bold shadow">
                          {stock} left
                        </span>
                      )}

                      {stock === 0 && (
                        <span className="bg-red-100 text-red-700 px-1.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-xs font-bold shadow">
                          Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-2 sm:p-4 flex flex-col flex-1">
                    <h2 className="text-[10px] sm:text-lg lg:text-xl font-black text-gray-900 leading-tight text-center min-h-[30px] sm:min-h-[56px]">
                      {product.name}
                    </h2>

                    <p className="text-green-600 text-xs sm:text-xl font-black text-center mt-1">
                      ₹{currentPrice}
                    </p>

                    <p className="text-center text-[9px] sm:text-sm text-gray-500 mt-1">
                      Stock: {stock}
                    </p>

                    {/* size */}
                    <div className="mt-2 sm:mt-4">
                      <select
                        value={selectedSize}
                        onChange={(e) =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [product.name]: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg sm:rounded-2xl px-1 sm:px-4 py-1.5 sm:py-3 text-[9px] sm:text-sm outline-none focus:ring-2 focus:ring-green-200 bg-white"
                      >
                        <option value="250ml">250ml</option>
                        <option value="500ml">500ml</option>
                        <option value="1L">1L</option>
                        <option value="2L">2L</option>
                        <option value="3L">3L</option>
                        <option value="5L">5L</option>
                      </select>
                    </div>

                    {/* qty */}
                    <div className="mt-2 sm:mt-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-3">
                        <button
                          disabled={stock === 0}
                          onClick={() => decreaseQty(product)}
                          className="w-6 h-6 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-xl disabled:bg-gray-300"
                        >
                          −
                        </button>

                        <div className="flex-1 h-6 sm:h-11 rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center font-black text-[10px] sm:text-lg">
                          {currentQty}
                        </div>

                        <button
                          disabled={stock === 0}
                          onClick={() => increaseQty(product)}
                          className="w-6 h-6 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs sm:text-xl disabled:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* total */}
                    <div className="mt-2 sm:mt-4 rounded-lg sm:rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 px-1.5 sm:px-4 py-1.5 sm:py-3 text-center">
                      <p className="text-[8px] sm:text-sm text-gray-600">Total</p>
                      <p className="text-[10px] sm:text-lg font-black text-green-700">
                        ₹{currentPrice * currentQty}
                      </p>
                    </div>

                    {/* button */}
                    <div className="mt-auto pt-2 sm:pt-5">
                      <button
                        disabled={stock === 0}
                        onClick={() => addToCart(product)}
                        className={`w-full py-1.5 sm:py-3.5 rounded-lg sm:rounded-2xl font-bold text-[9px] sm:text-sm lg:text-base transition-all duration-300 ${
                          stock === 0
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg text-white"
                        }`}
                      >
                        {stock === 0 ? "Out" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating cart for mobile */}
      <button
        onClick={() => navigate("/cart")}
        className="sm:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-2xl flex items-center justify-center text-2xl animate-glow"
      >
        🛒
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* mobile bottom bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t border-green-100 bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-2 gap-3 p-3">
          <button
            onClick={() => navigate("/")}
            className="bg-green-50 text-green-700 py-3 rounded-2xl font-bold"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="relative bg-green-600 text-white py-3 rounded-2xl font-bold"
          >
            View Cart
            {cartCount > 0 && (
              <span className="absolute top-1 right-2 min-w-[22px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}