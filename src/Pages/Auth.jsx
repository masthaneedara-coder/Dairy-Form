import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  setCustomerLogin,
  setAdminLogin,
  setDeliveryLogin,
  getRedirectAfterLogin,
  clearRedirectAfterLogin,
} from "../config/auth";

export default function Auth() {
  const navigate = useNavigate();

  /* -----------------------------
     STATES
  ------------------------------*/

  const [selectedRole, setSelectedRole] = useState("customer");
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  /* -----------------------------
     REDIRECT
  ------------------------------*/

  const redirectUser = (defaultPath = "/") => {
    const redirectPath = getRedirectAfterLogin();

    if (redirectPath) {
      clearRedirectAfterLogin();
      navigate(redirectPath);
    } else {
      navigate(defaultPath);
    }
  };

  /* -----------------------------
     CUSTOMER SIGNUP
  ------------------------------*/

  const handleCustomerSignup = async () => {
    if (!name || !email || !mobile || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await addDoc(collection(db, "customers"), {
        uid: userCredential.user.uid,
        name,
        email,
        mobile,
      });

      alert("Signup Successful");

      setName("");
      setEmail("");
      setMobile("");
      setPassword("");

      setIsLogin(true);

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /* -----------------------------
     CUSTOMER LOGIN
     Mobile OR Email
  ------------------------------*/

  const handleCustomerLogin = async () => {

    if (!loginId || !password) {
      alert("Please enter Mobile/Email and Password");
      return;
    }

    try {

      let loginEmail = loginId;

      // Mobile Login
      if (!loginId.includes("@")) {

        const snapshot = await getDocs(
          collection(db, "customers")
        );

        let found = false;

        snapshot.forEach((doc) => {

          const data = doc.data();

          if (data.mobile === loginId) {
            loginEmail = data.email;
            found = true;
          }

        });

        if (!found) {
          alert("Customer not found");
          return;
        }

      }

      // Firebase Login

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          loginEmail,
          password
        );

      const uid = userCredential.user.uid;

      const snapshot = await getDocs(
        collection(db, "customers")
      );

      let customer = null;

      snapshot.forEach((doc) => {

        const data = doc.data();

        if (data.uid === uid) {
          customer = data;
        }

      });

      if (!customer) {
        alert("Customer profile not found");
        return;
      }

      setCustomerLogin({
        name: customer.name,
        phone: customer.mobile,
      });

      redirectUser("/dashboard");

    } catch (error) {

      console.error(error);

      switch (error.code) {

        case "auth/user-not-found":
          alert("No account found.");
          break;

        case "auth/wrong-password":
        case "auth/invalid-credential":
          alert("Invalid password.");
          break;

        case "auth/invalid-email":
          alert("Invalid Email.");
          break;

        default:
          alert(error.message);

      }

    }

  };
    /* -----------------------------
     ADMIN LOGIN
  ------------------------------*/

  const handleAdminLogin = () => {
    if (loginId === "admin" && password === "1234") {
      setAdminLogin({
        name: "Admin",
      });

      navigate("/admin");
      return;
    }

    alert("Invalid admin credentials");
  };

  /* -----------------------------
     DELIVERY LOGIN
  ------------------------------*/

  const handleDeliveryLogin = () => {
    if (loginId === "delivery" && password === "1234") {
      setDeliveryLogin({
        name: "Delivery Boy",
      });

      navigate("/delivery");
      return;
    }

    alert("Invalid delivery credentials");
  };

  /* -----------------------------
     SUBMIT
  ------------------------------*/

  const handleSubmit = async () => {

    if (selectedRole === "customer") {

      if (isLogin) {
        await handleCustomerLogin();
      } else {
        await handleCustomerSignup();
      }

      return;
    }

    if (selectedRole === "admin") {
      handleAdminLogin();
      return;
    }

    if (selectedRole === "delivery") {
      handleDeliveryLogin();
      return;
    }

  };

  /* -----------------------------
     UI
  ------------------------------*/

  return (

    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 flex items-center justify-center px-3 sm:px-4 py-6">

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch">

        {/* LEFT PANEL */}

        <div className="hidden lg:flex flex-col justify-between rounded-[32px] overflow-hidden bg-gradient-to-br from-green-700 via-emerald-600 to-green-700 text-white p-10 shadow-2xl">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 text-sm font-semibold">
              🌿 Farm Fresh Dairy
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight">
              Fresh Dairy
              <span className="block">
                Delivered Daily
              </span>
            </h1>

            <p className="mt-5 text-white/90">
              Fresh milk, groceries and subscriptions delivered to your doorstep.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white/10 rounded-3xl p-5">
              <p className="text-sm opacity-80">
                Customer
              </p>

              <p className="text-2xl font-black mt-2">
                Orders &
                <br />
                Subscription
              </p>
            </div>

            <div className="bg-white/10 rounded-3xl p-5">
              <p className="text-sm opacity-80">
                Admin
              </p>

              <p className="text-2xl font-black mt-2">
                Orders &
                <br />
                Billing
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="bg-white rounded-[32px] border border-green-100 shadow-2xl p-8">

          <div className="text-center">

            <div className="w-16 h-16 rounded-3xl bg-green-100 mx-auto flex items-center justify-center text-3xl">
              🔐
            </div>

            <h2 className="text-4xl font-black text-green-700 mt-5">

              {selectedRole === "customer"
                ? isLogin
                  ? "Customer Login"
                  : "Customer Signup"
                : selectedRole === "admin"
                ? "Admin Login"
                : "Delivery Login"}

            </h2>

            <p className="text-gray-500 mt-2">
              Continue to your dairy account
            </p>

          </div>
                    {/* ROLE SWITCH */}

          <div className="grid grid-cols-3 gap-2 bg-gray-100 rounded-2xl p-1 mt-8">

            <button
              onClick={() => {
                setSelectedRole("customer");
                setIsLogin(true);
              }}
              className={`py-3 rounded-2xl font-bold transition ${
                selectedRole === "customer"
                  ? "bg-green-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Customer
            </button>

            <button
              onClick={() => {
                setSelectedRole("admin");
                setIsLogin(true);
              }}
              className={`py-3 rounded-2xl font-bold transition ${
                selectedRole === "admin"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Admin
            </button>

            <button
              onClick={() => {
                setSelectedRole("delivery");
                setIsLogin(true);
              }}
              className={`py-3 rounded-2xl font-bold transition ${
                selectedRole === "delivery"
                  ? "bg-orange-500 text-white"
                  : "text-gray-700"
              }`}
            >
              Delivery
            </button>

          </div>

          {/* FORM */}

          <div className="space-y-4 mt-8">

            {/* Signup Name */}

            {selectedRole === "customer" && !isLogin && (

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-green-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

            )}

            {/* Signup Email */}

            {selectedRole === "customer" && !isLogin && (

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-green-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

            )}

            {/* Login */}

            {selectedRole === "customer" ? (

              isLogin ? (

                <input
                  type="text"
                  placeholder="Mobile Number or Email"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full border border-green-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                />

              ) : (

                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border border-green-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                />

              )

            ) : (

              <input
                type="text"
                placeholder={
                  selectedRole === "admin"
                    ? "Admin Username"
                    : "Delivery Username"
                }
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full border border-green-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

            )}

            {/* Password */}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-green-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Login Button */}

            <button
              onClick={handleSubmit}
              className={`w-full text-white py-4 rounded-2xl font-black transition ${
                selectedRole === "customer"
                  ? "bg-green-600 hover:bg-green-700"
                  : selectedRole === "admin"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {selectedRole === "customer"
                ? isLogin
                  ? "Login"
                  : "Signup"
                : "Login"}
            </button>

            {/* Toggle */}

            {selectedRole === "customer" && (

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-green-700 font-bold"
              >
                {isLogin
                  ? "Create New Account"
                  : "Already Have an Account?"}
              </button>

            )}

            {/* Forgot Password */}

            {selectedRole === "customer" && isLogin && (

              <button
                onClick={() => navigate("/forgot-password")}
                className="w-full text-green-700 hover:underline font-semibold"
              >
                Forgot Password?
              </button>

            )}
                        {/* Demo Credentials */}

            {(selectedRole === "admin" ||
              selectedRole === "delivery") && (

              <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">

                {/* <p className="font-bold mb-2">
                  Demo Credentials
                </p> */}

                {/* {selectedRole === "admin" ? (
                  <>
                    <p>Username : admin</p>
                    <p>Password : 1234</p>
                  </>
                ) : (
                  <>
                    <p>Username : delivery</p>
                    <p>Password : 1234</p>
                  </>
                )} */}

              </div>

            )}

            {/* Back Button */}

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
            >
              ← Back To Home
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}