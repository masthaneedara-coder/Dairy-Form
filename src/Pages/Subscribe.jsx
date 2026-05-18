import { useState } from "react";

export default function Subscribe() {

  const params = new URLSearchParams(window.location.search);

  const product = params.get("product");
  const qty = params.get("qty");
  const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwDo-NO1_Ul5WQNUvsUowPQG2rgebzgX47SGyfJFTa5m6vdKqk01TAdc6KC9rhZs_yD/exec";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    quantity: qty || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = () => {

  if (
    !formData.name ||
    !formData.mobile ||
    !formData.address
  ) {

    alert("Please Fill All Details");
    return;
  }

  const price =
    product === "Cow Milk"
      ? 60
      : product === "Buffalo Milk"
      ? 80
      : 50;

  const total =
    Number(formData.quantity) * price;

  const options = {

    key: "YOUR_RAZORPAY_KEY",

    amount: total * 100,

    currency: "INR",

    name: "Farm Fresh Dairy",

    description: product,

    handler: async function (response) {

      try {

        await fetch(GOOGLE_SCRIPT_URL, {

          method: "POST",

          mode: "no-cors",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            name: formData.name,

            mobile: formData.mobile,

            address: formData.address,

            quantity: formData.quantity,

            product: product,

            total: total,

            paymentId:
              response.razorpay_payment_id,

          }),

        });

        alert("Payment Successful");

        window.location.href = "/";

      } catch (error) {

        console.log(error);

        alert("Error Saving Order");

      }

    },

    theme: {
      color: "#16a34a",
    },

  };

  const razorpay =
    new window.Razorpay(options);

  razorpay.open();
  };
  return (

    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl w-full">

        <h1 className="text-4xl font-black text-green-700 mb-8">
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
            placeholder="Quantity / Liters"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-2xl px-5 py-4"
          />

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg"
          >
            Proceed To Payment
          </button>

        </div>

      </div>

    </div>
  );
}