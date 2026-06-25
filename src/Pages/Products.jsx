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
      setQuantities({
        ...quantities,
        [product.name]: current + 1,
      });
    }
  };

  const decreaseQty = (product) => {
    const current = quantities[product.name] || 1;
    if (current > 1) {
      setQuantities({
        ...quantities,
        [product.name]: current - 1,
      });
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24">
      <style>{`
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-floatY { animation: floatY 4s ease-in-out infinite; }
        .animate-fadeUp { animation: fadeUp .7s ease forwards; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-[#f7fff8] via-white to-[#eefaf0] px-4 sm:px-6 py-8 sm:py-10 md:px-10 md:py-12 shadow-[0_10px_40px_rgba(34,197,94,0.08)]">
          <span className="absolute top-6 left-6 text-2xl animate-floatY">🍃</span>
          <span className="absolute top-12 right-10 text-2xl animate-floatY">🌿</span>
          <span className="absolute bottom-8 left-1/4 text-2xl animate-floatY">🌱</span>

          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/80 backdrop-blur-md border border-green-100 text-green-700 shadow-xl"
            >
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[22px] h-6 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative z-10 text-center animate-fadeUp">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-green-100 bg-white/90 px-5 py-2.5 text-sm font-semibold text-green-700 shadow-sm backdrop-blur-md">
              <span>🌿</span>
              <span>100% Natural & Fresh</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-green-950">
              Fresh Dairy Products
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Pure, fresh and healthy dairy products delivered daily with
              quality you can trust.
            </p>

            <div className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="mt-8">
          {/* 3 per row desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.isArray(products) &&
              products.map((product, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col border border-green-100 hover:shadow-2xl transition-all duration-300 ${
                    Number(product.stock) === 0 ? "opacity-70" : ""
                  }`}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 sm:h-64 object-cover"
                    />

                    <div className="absolute top-4 left-4">
                      {Number(product.stock) > 0 ? (
                        <span className="bg-white/90 backdrop-blur-md text-green-700 px-3 py-1.5 rounded-full text-sm font-bold shadow">
                          In Stock
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow">
                          Out Of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h2 className="text-xl sm:text-2xl font-black text-center text-gray-900">
                      {product.name}
                    </h2>

                    <p className="text-green-600 text-2xl font-black text-center mt-2">
                      ₹
                      {getPrice(
                        Number(product.price),
                        selectedSizes[product.name] || "1L"
                      )}
                    </p>

                    <p className="text-center font-semibold mt-2 text-gray-600">
                      Stock: {product.stock}
                    </p>

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

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Size
                      </label>
                      <select
                        value={selectedSizes[product.name] || "1L"}
                        onChange={(e) =>
                          setSelectedSizes({
                            ...selectedSizes,
                            [product.name]: e.target.value,
                          })
                        }
                        className="w-full border rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-green-200"
                      >
                        <option value="250ml">250ml</option>
                        <option value="500ml">500ml</option>
                        <option value="1L">1 Liter</option>
                        <option value="2L">2 Liter</option>
                        <option value="3L">3 Liter</option>
                        <option value="5L">5 Liter</option>
                      </select>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button
                        disabled={Number(product.stock) === 0}
                        onClick={() => decreaseQty(product)}
                        className="w-11 h-11 rounded-full bg-red-500 text-white text-xl font-bold disabled:opacity-50"
                      >
                        -
                      </button>

                      <span className="font-black text-lg w-10 text-center">
                        {quantities[product.name] || 1}
                      </span>

                      <button
                        disabled={Number(product.stock) === 0}
                        onClick={() => increaseQty(product)}
                        className="w-11 h-11 rounded-full bg-green-500 text-white text-xl font-bold disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-auto pt-5">
                      <button
                        disabled={Number(product.stock) === 0}
                        onClick={() => addToCart(product)}
                        className={`w-full py-3.5 rounded-2xl font-bold text-white ${
                          Number(product.stock) === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
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

          {products.length === 0 && (
            <div className="mt-10 bg-white rounded-3xl p-10 text-center shadow">
              <h2 className="text-2xl font-bold text-gray-600">
                No products found
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}