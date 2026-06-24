import {
  useEffect,
  useState
} from "react";

export default function AdminProducts() {

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const [products, setProducts] =
    useState([]);

  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [image, setImage] =
    useState("");

  const loadProducts =
    async () => {

      const res =
        await fetch(
          `${SCRIPT_URL}?action=products`
        );

      const data =
        await res.json();

      setProducts(data);

    };

  useEffect(() => {

    loadProducts();

  }, []);

 const addProduct = async () => {

  if (!name || !price || !stock) {
    alert("Please fill all fields");
    return;
  }

  try {

    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "addProduct",
        name,
        price: Number(price),
        stock: Number(stock),
        image,
      }),
    });

    alert("Product Added");

    setName("");
    setPrice("");
    setStock("");
    setImage("");

    setTimeout(loadProducts, 1500);

  } catch (err) {

    console.error(err);
    alert("Failed to add product");

  }

};
const deleteProduct = async (
  productName
) => {

  if (
    !window.confirm(
      `Delete ${productName}?`
    )
  ) {
    return;
  }

  try {

    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type":
          "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "deleteProduct",
        productName,
      }),
    });

    setTimeout(loadProducts, 1000);

  } catch (err) {

    console.log(err);

  }

};
const updateStock = async (
  productName,
  change
) => {

  const product =
    products.find(
      (p) => p.name === productName
    );

  if (
    Number(product.stock) <= 0 &&
    change < 0
  ) {
    alert("Stock cannot be negative");
    return;
  }

  try {

    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type":
          "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "updateStock",
        productName,
        change,
      }),
    });

    setTimeout(loadProducts, 1000);

  } catch (err) {

    console.log(err);

  }

};

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-black text-green-700 mb-10">

        Product Management

      </h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">

  <div className="bg-white rounded-3xl p-6 shadow">
    <p>Total Products</p>
    <h2 className="text-4xl font-black text-green-600">
      {products.length}
    </h2>
  </div>

  <div className="bg-white rounded-3xl p-6 shadow">
    <p>In Stock</p>
    <h2 className="text-4xl font-black text-blue-600">
      {
        products.filter(
          p => Number(p.stock) > 0
        ).length
      }
    </h2>
  </div>

  <div className="bg-white rounded-3xl p-6 shadow">
    <p>Low Stock</p>
    <h2 className="text-4xl font-black text-orange-600">
      {
        products.filter(
          p =>
            Number(p.stock) > 0 &&
            Number(p.stock) < 10
        ).length
      }
    </h2>
  </div>

  <div className="bg-white rounded-3xl p-6 shadow">
    <p>Out Of Stock</p>
    <h2 className="text-4xl font-black text-red-600">
      {
        products.filter(
          p => Number(p.stock) <= 0
        ).length
      }
    </h2>
  </div>

</div>

      <div className="bg-white rounded-3xl p-8 shadow mb-10">

        <div className="grid md:grid-cols-4 gap-4">

          <input
            placeholder="Name"
            value={name}
            onChange={(e)=>
              setName(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e)=>
              setPrice(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

          <input
            placeholder="Stock"
            value={stock}
            onChange={(e)=>
              setStock(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

          <input
            placeholder="Image URL"
            value={image}
            onChange={(e)=>
              setImage(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

        </div>

        <button
          onClick={addProduct}
          className="mt-5 bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Add Product
        </button>

      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {products.length === 0 && (

            <div className="col-span-3 bg-white rounded-3xl p-10 text-center shadow">

                <h2 className="text-2xl font-bold text-gray-500">
                No Products Found
                </h2>

            </div>

            )}

        {products.map((product) => (

          <div
  key={product.name}
  className="bg-white rounded-3xl p-5 shadow-lg"
>

  <img
  src={
    product.image ||
    "https://via.placeholder.com/300x200?text=Milk"
  }
  alt={product.name}
  onError={(e) => {
    e.target.src =
      "https://via.placeholder.com/300x200?text=Milk";
  }}
  className="h-48 w-full object-cover rounded-xl"
/>

  <h3 className="font-bold text-lg mt-3 text-center">
    {product.name}
  </h3>

  <p className="text-green-600 font-bold">
    ₹{product.price}
  </p>

  <p className="mb-4">
    Stock: {product.stock}
  </p>

  <div className="flex gap-2">

    <button
      onClick={() =>
        updateStock(
          product.name,
          1
        )
      }
      className="flex-1 bg-green-500 text-white py-2 rounded-xl"
    >
      + Stock
    </button>

    <button
      onClick={() =>
        updateStock(
          product.name,
          -1
        )
      }
      className="flex-1 bg-orange-500 text-white py-2 rounded-xl"
    >
      - Stock
    </button>

  </div>

  <button
    onClick={() =>
      deleteProduct(
        product.name
      )
    }
    className="w-full mt-3 bg-red-500 text-white py-2 rounded-xl"
  >
    Delete Product
  </button>

</div>

        ))}

      </div>

    </div>

  );

}