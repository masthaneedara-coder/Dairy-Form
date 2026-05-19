import { useEffect, useState } from "react";

export default function Subscribe() {
  const [product, setProduct] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    quantity: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setProduct(params.get("product") || "");

    setFormData((prev) => ({
      ...prev,
      quantity: params.get("qty") || "",
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = () => {
    alert("Payment Integration Ready");
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl w-full">
        <h1 className="text-5xl font-black text-green-700 mb-10">
          {product}
        </h1>

        <div className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border rounded-2xl px-5 py-4"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-2xl px-5 py-4"
          />

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-2xl px-5 py-4"
          />

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg"
          >
            Proceed To Payment
          </button>
        </div>
      </div>
    </div>
  );
}