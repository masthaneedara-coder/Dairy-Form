import { useEffect, useState } from "react";
import { db } from "../firebase";
import jsPDF from "jspdf";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Subscribe() {

  const [product, setProduct] =
    useState("");

  const [price, setPrice] =
    useState(0);

  const [formData, setFormData] =
    useState({
      name: "",
      mobile: "",
      address: "",
      quantity: "",
    });

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const productName =
      params.get("product");

    const qty =
      params.get("qty");

    const totalPrice =
      params.get("price");

    setProduct(productName || "");

    setPrice(Number(totalPrice));

    setFormData((prev) => ({
      ...prev,
      quantity: qty || "",
    }));

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handlePayment = () => {

    const options = {

      key: "rzp_live_SryV51ja9BVho8",

      amount: price * 100,

      currency: "INR",

      name: "Farm Fresh Dairy",

      description: product,

     handler: async function (response) {

  try {

    await addDoc(
      collection(db, "orders"),
      {

        customerName:
          formData.name,

        mobile:
          formData.mobile,

        address:
          formData.address,

        product,

        quantity:
          formData.quantity,

        amount: price,

        paymentId:
          response.razorpay_payment_id,

        status:
          "Order Placed",

        createdAt:
          serverTimestamp(),

      }
    );

    alert(
      "Order Saved Successfully"
    );

    console.log(response);

  } catch (error) {

    console.log(error);

    alert(
      "Failed To Save Order"
    );

  }

},

      prefill: {

        name: formData.name,

        contact:
          formData.mobile,

      },

      notes: {

        address:
          formData.address,

      },

      theme: {
        color: "#16a34a",
      },

    };

    const razorpay =
      new window.Razorpay(options);

    razorpay.open();

  };
  const downloadInvoice = () => {

  const doc =
    new jsPDF();

  doc.setFontSize(24);

  doc.text(
    "Farm Fresh Dairy",
    20,
    20
  );

  doc.setFontSize(16);

  doc.text(
    "Invoice Receipt",
    20,
    35
  );

  doc.setFontSize(12);

  doc.text(
    `Customer: ${formData.name}`,
    20,
    55
  );

  doc.text(
    `Mobile: ${formData.mobile}`,
    20,
    65
  );

  doc.text(
    `Address: ${formData.address}`,
    20,
    75
  );

  doc.text(
    `Product: ${product}`,
    20,
    95
  );

  doc.text(
    `Quantity: ${formData.quantity}L`,
    20,
    105
  );

  doc.text(
    `Amount Paid: ₹${price}`,
    20,
    115
  );

  doc.text(
    `Status: Paid`,
    20,
    125
  );

  doc.text(
    `Thank You For Choosing Farm Fresh Dairy`,
    20,
    155
  );

  doc.save(
    "FarmFreshInvoice.pdf"
  );

};
const sendWhatsAppMessage =
  () => {

  const message =

`🥛 Farm Fresh Dairy

Hello ${formData.name},

Your order is confirmed.

📦 Product:
${product}

🥛 Quantity:
${formData.quantity}L

💰 Amount:
₹${price}

🚚 Status:
Order Placed

Thank you for ordering with us.`;

  const whatsappURL =

`https://wa.me/91${formData.mobile}?text=${encodeURIComponent(message)}`;

  window.open(
    whatsappURL,
    "_blank"
  );

};

    <button
      onClick={sendWhatsAppMessage}
      className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold mt-4"
    >
      Send WhatsApp Confirmation
    </button>

  return (

    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl w-full">

        <h1 className="text-5xl font-black text-green-700 mb-4 text-center">
          {product}
        </h1>

        <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
          ₹{price}
        </h2>

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
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold"
          >
            Proceed To Payment
          </button>
          <button
            onClick={downloadInvoice}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold mt-4"
          >
            Download Invoice PDF
          </button>

        </div>

      </div>

    </div>

  );

}