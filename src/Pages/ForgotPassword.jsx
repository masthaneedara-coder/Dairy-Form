import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
  if (!email) {
    alert("Please enter your registered email.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);

    alert(
      "Password reset email has been sent. Please check your inbox."
    );

    navigate("/auth");

  } catch (error) {
    console.error(error);

    switch (error.code) {
      case "auth/user-not-found":
        alert("No account found with this email.");
        break;

      case "auth/invalid-email":
        alert("Invalid email address.");
        break;

      default:
        alert(error.message);
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-black text-green-700 text-center">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Enter your registered mobile number.
        </p>

        <input
          type="email"
          placeholder="Email Address"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-8 border rounded-xl px-4 py-3"
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-green-600 text-white rounded-xl py-3 font-bold hover:bg-green-700"
        >
          Continue
        </button>

        <button
          onClick={() => navigate("/auth")}
          className="w-full mt-3"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}