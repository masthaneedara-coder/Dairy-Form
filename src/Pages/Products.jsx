import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
const navigate = useNavigate();
 
const [cartCount, setCartCount] = useState(0);
const [quantities, setQuantities] = useState({});
const [selectedSizes, setSelectedSizes] = useState({});
const [products, setProducts] = useState([]);
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
const increaseQty = (
  product
) => {

  const current =
    quantities[
      product.name
    ] || 1;

  if (
    current <
    product.stock
  ) {

    setQuantities({

      ...quantities,

      [product.name]:
        current + 1,

    });

  }

};
const decreaseQty = (
  product
) => {

  const current =
    quantities[
      product.name
    ] || 1;

  if (current > 1) {

    setQuantities({

      ...quantities,

      [product.name]:
        current - 1,

    });

  }

};
const addToCart = (product) => {
  const qty =
    quantities[product.name] || 1;

  const size =
    selectedSizes[product.name] || "1L";

  const price =
    getPrice(
      Number(product.price),
      size
    );

  const savedCart = JSON.parse(
  localStorage.getItem("cart") || "[]"
  );

  const cart = Array.isArray(savedCart)
  ? savedCart
  : [];

  const existing = cart.find(
    (item) =>
      item.name === product.name &&
      item.size === size
  );

  if (existing) {
    existing.qty += qty;
    existing.total =
      existing.qty * existing.price;
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

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  const totalQty = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  setCartCount(totalQty);

  
};

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

 useEffect(() => {
  fetch(`${SCRIPT_URL}?action=products`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Products API:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Products API did not return array");
        setProducts([]);
      }
    })
    .catch((err) => {
      console.error("Products Fetch Error:", err);
      setProducts([]);
    });
}, []);
useEffect(() => {
  const savedCart = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const cart = Array.isArray(savedCart)
    ? savedCart
    : [];

  const totalQty = cart.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  setCartCount(totalQty);
}, []);

  return (

   <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-20 p-2">
     <div className="relative overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-[#f7fff8] via-white to-[#eefaf0] px-6 py-10 md:px-10 md:py-12 shadow-[0_10px_40px_rgba(34,197,94,0.08)]">
        {/* Falling leaves */}
        <span className="leaf leaf-1">🍃</span>
        <span className="leaf leaf-2">🌿</span>
        <span className="leaf leaf-3">🍃</span>
        <span className="leaf leaf-4">🌱</span>
        <span className="leaf leaf-5">🍃</span>

        {/* Cart Button */}
        <div className="absolute top-8 right-8 z-20">
            <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/80 backdrop-blur-md border border-green-100 text-green-700 shadow-xl hover:scale-105 transition-all duration-300"
            >
            <span className="text-2xl md:text-3xl">🛒</span>

            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                {cartCount}
                </span>
            )}
            </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-green-100 bg-white/90 px-5 py-2.5 text-sm font-semibold text-green-700 shadow-sm backdrop-blur-md">
            <span className="text-sm">🌿</span>
            <span className="tracking-wide">100% Natural & Fresh</span>
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-green-950 md:text-5xl">
            Fresh Dairy Products
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            Pure, fresh and healthy dairy products delivered daily with quality you can trust.
            </p>

            <div className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
        </div>
        </div>


  <div className="grid grid-cols-4 gap-4 px-2">

 {Array.isArray(products) &&
  products.map((product, index) => (

    <div
      key={index}
      className={`bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col ${
        Number(product.stock) === 0
          ? "opacity-60"
          : ""
      }`}
    >

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover"
      />

      <div className="p-4 flex flex-col flex-1">

        <h2 className="text-xl font-bold text-center">
          {product.name}
        </h2>

        <p className="text-green-600 text-xl font-bold text-center mt-2">
          ₹{
            getPrice(
              Number(product.price),
              selectedSizes[product.name] || "1L"
            )
          }
        </p>

        <p className="text-center font-semibold mt-2">
          Stock: {product.stock}
        </p>

        <div className="h-16 flex items-center justify-center mt-2">

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

        <div className="flex items-center justify-center gap-2 mt-2">

          <button
            disabled={Number(product.stock) === 0}
            onClick={() => decreaseQty(product)}
            className="w-10 h-10 rounded-lg bg-red-500 text-white"
          >
            -
          </button>

          <span className="font-bold text-lg w-8 text-center">
            {quantities[product.name] || 1}
          </span>

          <select
            value={selectedSizes[product.name] || "1L"}
            onChange={(e) =>
              setSelectedSizes({
                ...selectedSizes,
                [product.name]: e.target.value,
              })
            }
            className="border rounded-lg px-2 py-2"
          >
            <option value="250ml">250ml</option>
            <option value="500ml">500ml</option>
            <option value="1L">1 Liter</option>
            <option value="2L">2 Liter</option>
            <option value="3L">3 Liter</option>
            <option value="5L">5 Liter</option>
          </select>

          <button
            disabled={Number(product.stock) === 0}
            onClick={() => increaseQty(product)}
            className="w-10 h-10 rounded-lg bg-green-500 text-white"
          >
            +
          </button>

        </div>

        <div className="mt-auto pt-4">

          <button
            disabled={Number(product.stock) === 0}
            onClick={() => addToCart(product)}
            className={`w-full py-3 rounded-xl font-bold text-white ${
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

    </div>

  );

}