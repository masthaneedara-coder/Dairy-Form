import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isAdminLoggedIn =
      localStorage.getItem("adminLogin") === "true";

    const userRole =
      localStorage.getItem("userRole");

    if (isAdminLoggedIn && userRole === "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleAdminLogin = (e) => {
    e.preventDefault();

    const adminEmail = "admin@farmfresh.com";
    const adminPassword = "123456";

    if (
      email === adminEmail &&
      password === adminPassword
    ) {
      localStorage.setItem("adminLogin", "true");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("adminName", "Admin");

      navigate("/admin");
    } else {
      alert("Invalid admin email or password");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-black text-center text-green-700 mb-2">
          Admin Login
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Farm Fresh Dairy Admin Panel
        </p>

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-2xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-2xl px-4 py-3"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}