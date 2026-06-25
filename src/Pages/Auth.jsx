import { useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");

  const handleSignup = async () => {
    if (!name || !mobile || !password || !address || !area) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "customers"), {
        name,
        mobile,
        password,
        address,
        area,
      });

      alert("Signup Successful. Please login.");
      setIsLogin(true);
    } catch (error) {
      console.log(error);
      alert("Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "customers"));
      let found = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.mobile === mobile && data.password === password) {
          found = true;

          localStorage.setItem("customerLogin", "true");
          localStorage.setItem("userRole", "customer");
          localStorage.setItem("customerName", data.name || "");
          localStorage.setItem("customerPhone", data.mobile || "");
          localStorage.setItem("customerAddress", data.address || "");
          localStorage.setItem("customerArea", data.area || "");

          const pendingItem = JSON.parse(
            localStorage.getItem("pendingCartItem") || "null"
          );

          if (pendingItem) {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const safeCart = Array.isArray(cart) ? cart : [];

            const existing = safeCart.find(
              (item) =>
                item.name === pendingItem.name &&
                item.size === pendingItem.size
            );

            if (existing) {
              existing.qty += pendingItem.qty;
              existing.total = existing.qty * existing.price;
            } else {
              safeCart.push(pendingItem);
            }

            localStorage.setItem("cart", JSON.stringify(safeCart));
            localStorage.removeItem("pendingCartItem");
          }

          const redirectPath =
            localStorage.getItem("redirectAfterLogin") || "/dashboard";
          localStorage.removeItem("redirectAfterLogin");

          navigate(redirectPath);
        }
      });

      if (!found) {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-green-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl shadow-inner">
            🥛
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-green-700 mt-4">
            {isLogin ? "Customer Login" : "Customer Signup"}
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            {isLogin
              ? "Login to continue your dairy orders"
              : "Create account for milk orders & subscription"}
          </p>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-200"
              />

              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-200"
              />

              <input
                type="text"
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-200"
              />
            </>
          )}

          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-200"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-200"
          />

          <button
            onClick={isLogin ? handleLogin : handleSignup}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg"
          >
            {isLogin ? "Login" : "Signup"}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-bold w-full py-2"
          >
            {isLogin ? "Create New Account" : "Already Have Account?"}
          </button>
        </div>
      </div>
    </div>
  );
}