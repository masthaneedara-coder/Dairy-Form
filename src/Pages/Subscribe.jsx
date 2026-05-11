import { useState } from "react";

export default function Subscribe() {
  const params = new URLSearchParams(window.location.search);
  const selectedPlan = params.get("plan");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    plan: selectedPlan || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async () => {
  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbwmjV0AbgvH0OEls83NDUu7Oct_n9ZPcbx-RN96Gxcwjgr_q2pIM3lUafDrcHlHrB5T/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    alert("Subscription Saved!");

     setFormData({
      name: "",
      liters: "",
      date: "",
      cost: "",
    });


  } catch (error) {
    console.log(error);
    alert("Failed To Save");
  }
};

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl w-full">
        <h1 className="text-4xl font-black text-green-700 mb-6">
          Milk Subscription
        </h1>

        <div className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            name="plan"
            value={formData.plan}
            readOnly
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-gray-100"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg"
          >
            Submit Subscription
          </button>
        </div>
      </div>
    </div>
  );
}