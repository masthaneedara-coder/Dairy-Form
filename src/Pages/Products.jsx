import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchProducts } from "../config/api";
import { addToCart, getCartItemCount } from "../config/cart";
import { useSearchParams } from "react-router-dom";
import Categories from "../components/home/Categories";
import { PRODUCT_SIZES } from "../config/productSizes";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1200&auto=format&fit=crop";

export default function Products() {
  const [searchParams] = useSearchParams();

const selectedCategory =
  searchParams.get("category") || "All";
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [toast, setToast] = useState("");
  const [addedProduct, setAddedProduct] = useState(null);

  /* ----------------------------------
     PLAY CART SOUND
  ---------------------------------- */
  const playCartSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.log("Audio play failed", err);
    }
  };

  /* ----------------------------------
     SAFE NUMBER
  ---------------------------------- */
  const toNumber = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  /* ----------------------------------
     NORMALIZE PRODUCT DATA
     Supports many Google Sheet column names
  ---------------------------------- */
  const normalizeProduct = (item, index = 0) => {
    const rawName =
      item.name ||
      item.Name ||
      item.productName ||
      item["Product Name"] ||
      item["Product"] ||
      item["Item Name"] ||
      item["Title"] ||
      "";

    const rawPrice =
      item.price ??
      item.Price ??
      item.productPrice ??
      item["Product Price"] ??
      item["Price/Liter"] ??
      item["Price Per Liter"] ??
      item["Rate"] ??
      item["Amount"] ??
      0;

    const rawStock =
      item.stock ??
      item.Stock ??
      item.qty ??
      item.quantity ??
      item["Stock Qty"] ??
      item["Stock Quantity"] ??
      item["Available Stock"] ??
      item["Available Qty"] ??
      0;

    const rawImage =
      item.image ||
      item.Image ||
      item.productImage ||
      item["Product Image"] ||
      item["Image URL"] ||
      item["Photo"] ||
      "";

    return {
      id:
        item.id ||
        item.productId ||
        item["Product ID"] ||
        item["ID"] ||
        `product-${index}`,
      name: String(rawName || "Product"),
      price: toNumber(rawPrice, 0),
      stock: toNumber(rawStock, 0),
      image: String(rawImage || "").trim(),
      category:
        item.category ||
        item.Category ||
        item["Product Category"] ||
        "",
    };
  };
  const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter((product) => {
        const name = (product.name || "").toLowerCase();

        switch (selectedCategory) {
          case "Buffalo Milk":
            return name.includes("buffalo");

          case "Cow Milk":
            return name.includes("cow");

          case "Curd":
            return name.includes("curd");

          case "Ghee":
            return name.includes("ghee") || name.includes("gee");

          case "Paneer":
            return name.includes("paneer");

          case "Eggs":
            return name.includes("egg");

          case "Vegetables":
            return name.includes("vegetable");

          case "Groceries":
            return (
              name.includes("rice") ||
              name.includes("oil") ||
              name.includes("cashew")
            );

          default:
            return true;
        }
      });

  /* ----------------------------------
     SIZE PRICE CALCULATION
  ---------------------------------- */
  // const getPrice = (basePrice, size) => {
  //   const price = toNumber(basePrice, 0);

  //   switch (size) {
  //     case "250ml":
  //       return Math.round(price * 0.25);
  //     case "500ml":
  //       return Math.round(price * 0.5);
  //     case "1L":
  //       return Math.round(price);
  //     case "2L":
  //       return Math.round(price * 2);
  //     case "3L":
  //       return Math.round(price * 3);
  //     case "5L":
  //       return Math.round(price * 5);
  //     default:
  //       return Math.round(price);
  //   }
  // };

  /* ----------------------------------
     LOAD PRODUCTS
  ---------------------------------- */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();

        console.log("Products API response:", data);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const normalized = list
          .map((item, index) => normalizeProduct(item, index))
          .filter((p) => p.name && p.name.trim() !== "");

        console.log("Normalized products:", normalized);

        setProducts(normalized);
      } catch (error) {
        console.error("Products fetch failed:", error);
        setProducts([]);
      }
    };

    loadProducts();
    setCartCount(getCartItemCount());

    // sync cart count if localStorage changes in another tab/page
    const onStorage = () => setCartCount(getCartItemCount());
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ----------------------------------
     QUANTITY HANDLERS
  ---------------------------------- */
  const increaseQty = (product) => {
    const current = quantities[product.id] || 1;
    const stock = toNumber(product.stock, 0);

    if (current < stock) {
      setQuantities((prev) => ({
        ...prev,
        [product.id]: current + 1,
      }));
    }
  };

  const decreaseQty = (product) => {
    const current = quantities[product.id] || 1;

    if (current > 1) {
      setQuantities((prev) => ({
        ...prev,
        [product.id]: current - 1,
      }));
    }
  };

  /* ----------------------------------
     ADD TO CART
  ---------------------------------- */
  const getCalculatedPrice = (product) => {

  const selectedLabel =
    selectedSizes[product.id] || "1 L";

  const selectedSize =
    (PRODUCT_SIZES[product.name] || []).find(
      (item) => item.label === selectedLabel
    );

  const multiplier =
    selectedSize?.multiplier || 1;

  return Math.round(product.price * multiplier);

};
const handleAddToCart = (product) => {
  console.log("Clicked:", product);

  const qty = quantities[product.id] || 1;
  const size = selectedSizes[product.id] || "1 L";  
const price = getCalculatedPrice(product);
  

  if (!product.name || price <= 0) {
    console.log("Validation Failed");
    setToast("Product data is invalid");
    return;
  }

  console.log("Adding to cart...");

  addToCart({
    id: product.id,
    name: product.name,
    image: product.image || FALLBACK_IMAGE,
    size,
    qty,
    price,
    stock: product.stock,
    total: qty * price,
  });

  console.log("Cart Added");

  setCartCount(getCartItemCount());

  console.log("Changing Button");

  setAddedProduct(product.id);

  console.log("Playing Sound");

  playCartSound();

  setToast(`${product.name} added to cart`);

  setTimeout(() => {
    setToast("");
    setAddedProduct(null);
  }, 2000);
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Cart sound */}
      <audio ref={audioRef} preload="auto">
        <source src="https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg" type="audio/ogg" />
      </audio>

      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[28px] border border-green-100 bg-gradient-to-br from-[#f7fff8] via-white to-[#eefaf0] px-4 sm:px-8 py-8 sm:py-10 shadow-[0_10px_40px_rgba(34,197,94,0.08)] mb-6 sm:mb-8">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/95 backdrop-blur-md border border-green-100 text-green-700 shadow-xl hover:scale-105 transition"
            >
              <span className="text-2xl">🛒</span>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[22px] h-6 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-green-100 bg-white/90 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-green-700 shadow-sm backdrop-blur-md">
              <span>🌿</span>
              <span>100% Natural & Fresh Dairy</span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-green-950">
              Fresh Dairy Products
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
              Pure, fresh and healthy dairy products delivered daily with quality you can trust.
            </p>

            <div className="mx-auto mt-5 h-1.5 w-20 sm:w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
          </div>
        </div>

        {/* TOAST */}
        {toast && (
          <div className="fixed top-24 right-4 z-50 rounded-2xl bg-green-600 text-white px-5 py-3 shadow-2xl font-bold">
            {toast}
          </div>
        )}

        {/* PRODUCTS GRID */}
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={(category) =>
            navigate(`/products?category=${encodeURIComponent(category)}`)
          }
        />

        {/* EMPTY */}
        {products.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center mt-8">
            <div className="text-6xl mb-4">🥛</div>
            <h2 className="text-2xl font-black text-gray-700">
              No products found
            </h2>
          </div>
        )}
        {/* PRODUCTS */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-10 text-center mt-8">
                <div className="text-6xl mb-4">🥛</div>

                <h2 className="text-2xl font-black text-gray-700">
                  No products found
                </h2>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">

                {filteredProducts.map((product) => {
                  const qty = quantities[product.id] || 1;
                const price = getCalculatedPrice(product);

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                      <img
                        src={product.image || FALLBACK_IMAGE}
                        alt={product.name}
                        className="w-full h-36 object-cover"
                      />

                      <div className="p-3">
                        <h3 className="text-lg font-bold text-green-800">
                          {product.name}
                        </h3>

                        <p className="text-xl font-bold text-green-600 mt-1">
                          ₹{getCalculatedPrice(product)}
                        </p>
                        {/* Size Selection */}

                         <div className="mt-3">

                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Size
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {(PRODUCT_SIZES[product.name] || []).map((size) => (

                                <button
                                  key={size.label}
                                  type="button"
                                  onClick={() =>
                                    setSelectedSizes({
                                      ...selectedSizes,
                                      [product.id]: size.label,
                                    })
                                  }
                                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border

                                  ${
                                    (selectedSizes[product.id] || "1 L") === size.label
                                      ? "bg-green-600 text-white border-green-600 shadow"
                                      : "bg-white text-gray-700 border-gray-300 hover:border-green-500 hover:text-green-600"
                                  }

                                  `}
                                >
                                  {size.label}
                                </button>

                              ))}

                            </div>

                          </div>

                        <p
                          className={`mt-2 font-semibold ${
                            Number(product.stock) === 0
                              ? "text-red-600"
                              : Number(product.stock) <= 2
                              ? "text-red-500"
                              : Number(product.stock) <= 5
                              ? "text-orange-500"
                              : "text-green-600"
                          }`}
                        >
                          {Number(product.stock) === 0
                            ? "Out of Stock"
                            : Number(product.stock) <= 2
                            ? `⚠ Only ${product.stock} Left`
                            : Number(product.stock) <= 5
                            ? `🔥 Low Stock (${product.stock})`
                            : `✔ ${product.stock} Available`}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <button
                              disabled={Number(product.stock) === 0}
                              onClick={() => handleAddToCart(product)}
                              className={`rounded-2xl py-3 font-bold transition-all duration-300 ${
                                Number(product.stock) === 0
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : addedProduct === product.id
                                  ? "bg-green-700 text-white scale-105 shadow-lg"
                                  : "bg-green-600 hover:bg-green-700 text-white"
                              }`}
                            >
                              {Number(product.stock) === 0
                                ? "Out of Stock"
                                : addedProduct === product.id
                                ? "✓ Added"
                                : "Add To Cart"}
                            </button>
                          <button
                            disabled={Number(product.stock) === 0}
                            onClick={() => navigate("/subscription")}
                            className={`rounded-2xl py-3 font-bold ${
                              Number(product.stock) === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-green-50 hover:bg-green-100 text-green-700"
                            }`}
                          >
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}

                  </div>
                </div>
              );
            }