import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeliveryLogin() {
  const navigate = useNavigate();

  const [selectedBoy, setSelectedBoy] = useState("Ravi");
  const [password, setPassword] = useState("");

  const deliveryBoys = [
    "Ravi",
    "Suresh",
    "Mahesh",
    "Ramu"
  ];

  useEffect(() => {
    const isDeliveryLoggedIn =
      localStorage.getItem("deliveryLogin") === "true";

    const userRole = localStorage.getItem("userRole");

    if (isDeliveryLoggedIn && userRole === "delivery") {
      navigate("/delivery-boy");
    }
  }, [navigate]);

  const handleDeliveryLogin = (e) => {
    e.preventDefault();

    // Simple demo password for all delivery boys
    const deliveryPassword = "123456";

    if (!selectedBoy) {
      alert("Please select delivery boy");
      return;
    }

    if (password !== deliveryPassword) {
      alert("Invalid password");
      return;
    }

    // Clear any previous login
    localStorage.removeItem("customerLogin");
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerPhone");
    localStorage.removeItem("adminLogin");
    localStorage.removeItem("adminName");

    // Set delivery login
    localStorage.setItem("deliveryLogin", "true");
    localStorage.setItem("userRole", "delivery");
    localStorage.setItem("deliveryBoyName", selectedBoy);

    navigate("/delivery-boy");
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-black text-center text-orange-700 mb-2">
          Delivery Login
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Farm Fresh Dairy Delivery Panel
        </p>

        <form onSubmit={handleDeliveryLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Select Delivery Boy
            </label>

            <select
              value={selectedBoy}
              onChange={(e) => setSelectedBoy(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3"
            >
              {deliveryBoys.map((boy) => (
                <option key={boy} value={boy}>
                  {boy}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-2xl font-bold hover:bg-orange-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}