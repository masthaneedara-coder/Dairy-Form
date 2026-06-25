import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [products, setProducts] = useState([]);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

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

  const refreshCartCount = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cart = Array.isArray(savedCart) ? savedCart : [];
    const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    setCartCount(totalQty);
  };

  const increaseQty = (product) => {
    const current = quantities[product.name] || 1;
    if (current < Number(product.stock || 0)) {
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

    const isCustomerLoggedIn =
      localStorage.getItem("customerLogin") === "true";

    if (!isCustomerLoggedIn) {
      localStorage.setItem("pendingCartItem", JSON.stringify(cartItem));
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/auth");
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cart = Array.isArray(savedCart) ? savedCart : [];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-[#f7fff8] via-white to-[#eefaf0] px-4 sm:px-6 py-8 sm:py-10 shadow-[0_10px_40px_rgba(34,197,94,0.08)]">
          <div className="absolute inset-0 pointer-events-none">
            <span className="leaf leaf-1">🍃</span>
            <span className="leaf leaf-2">🌿</span>
            <span className="leaf leaf-3">🍃</span>
            <span className="leaf leaf-4">🌱</span>
            <span className="leaf leaf-5">🍃</span>
          </div>

          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/80 backdrop-blur-md border border-green-100 text-green-700 shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-xl sm:text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-green-100 bg-white/90 px-5 py-2.5 text-sm font-semibold text-green-700 shadow-sm backdrop-blur-md">
              🌿 100% Natural & Fresh
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-green-950">
              Fresh Dairy Products
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
              Pure, fresh and healthy dairy products delivered daily with quality you can trust.
            </p>

            <div className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="mt-8 grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {Array.isArray(products) &&
            products.map((product, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col border border-green-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
                  Number(product.stock) === 0 ? "opacity-60" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 sm:h-56 object-cover"
                  />

                  <div className="absolute top-3 left-3">
                    {Number(product.stock) > 0 ? (
                      <span className="bg-green-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow">
                        In Stock
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow">
                        Out Of Stock
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur text-green-700 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <h2 className="text-base sm:text-xl font-bold text-center text-gray-900 min-h-[48px] flex items-center justify-center">
                    {product.name}
                  </h2>

                  <p className="text-green-600 text-lg sm:text-2xl font-black text-center mt-2">
                    ₹
                    {getPrice(
                      Number(product.price),
                      selectedSizes[product.name] || "1L"
                    )}
                  </p>

                  <p className="text-center text-xs sm:text-sm text-gray-500 mt-1">
                    Selected size price
                  </p>

                  <div className="h-14 sm:h-16 flex items-center justify-center mt-2">
                    {Number(product.stock) > 0 && Number(product.stock) < 5 && (
                      <div className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-xl text-[11px] sm:text-sm font-semibold text-center w-full">
                        ⚠️ Only {product.stock} left
                      </div>
                    )}

                    {Number(product.stock) === 0 && (
                      <div className="bg-red-100 text-red-700 px-3 py-2 rounded-xl text-[11px] sm:text-sm font-semibold text-center w-full">
                        ❌ Out Of Stock
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <select
                      value={selectedSizes[product.name] || "1L"}
                      onChange={(e) =>
                        setSelectedSizes({
                          ...selectedSizes,
                          [product.name]: e.target.value,
                        })
                      }
                      className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-200"
                    >
                      <option value="250ml">250ml</option>
                      <option value="500ml">500ml</option>
                      <option value="1L">1 Liter</option>
                      <option value="2L">2 Liter</option>
                      <option value="3L">3 Liter</option>
                      <option value="5L">5 Liter</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-3">
                    <button
                      disabled={Number(product.stock) === 0}
                      onClick={() => decreaseQty(product)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500 text-white font-bold"
                    >
                      -
                    </button>

                    <span className="font-bold text-base sm:text-lg w-8 text-center">
                      {quantities[product.name] || 1}
                    </span>

                    <button
                      disabled={Number(product.stock) === 0}
                      onClick={() => increaseQty(product)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-500 text-white font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-auto pt-4">
                    <button
                      disabled={Number(product.stock) === 0}
                      onClick={() => addToCart(product)}
                      className={`w-full py-3 rounded-2xl font-bold text-white text-sm sm:text-base ${
                        Number(product.stock) === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                      }`}
                    >
                      {Number(product.stock) === 0 ? "Out Of Stock" : "Add To Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}