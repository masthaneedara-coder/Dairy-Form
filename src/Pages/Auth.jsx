import { useState } from "react";

import { db } from "../firebase";

import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

export default function Auth() {

  const [isLogin,
    setIsLogin] =
    useState(true);

  const [name,
    setName] =
    useState("");

  const [mobile,
    setMobile] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleSignup =
    async () => {

    if (
      !name ||
      !mobile ||
      !password
    ) {

      alert(
        "Please fill all fields"
      );

      return;

    }

    try {

      await addDoc(
        collection(db, "customers"),
        {

          name,
          mobile,
          password,

        }
      );

      alert(
        "Signup Successful"
      );

      setIsLogin(true);

    } catch (error) {

      console.log(error);

    }

  };

  const handleLogin =
    async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(
            db,
            "customers"
          )
        );

      let found = false;

      querySnapshot.forEach(
        (doc) => {

        const data =
          doc.data();

        if (
          data.mobile ===
            mobile &&
          data.password ===
            password
        ) {

          found = true;

          localStorage.setItem(
            "customerLogin",
            "true"
          );
          localStorage.setItem(
            "userRole",
            "customer"
            );

          localStorage.setItem(
            "customerName",
            data.name
          );

          localStorage.setItem(
            "customerPhone",
            data.mobile
          );

          window.location.href =
            "/dashboard";

        }

      });

      if (!found) {

        alert(
          "Invalid Credentials"
        );

      }

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">

        <h1 className="text-4xl font-black text-green-700 text-center mb-8">

          {isLogin
            ? "Customer Login"
            : "Customer Signup"}

        </h1>

        <div className="space-y-5">

          {!isLogin && (

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl px-5 py-4"
            />

          )}

          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) =>
              setMobile(
                e.target.value
              )
            }
            className="w-full border rounded-2xl px-5 py-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border rounded-2xl px-5 py-4"
          />

          <button
            onClick={
              isLogin
                ? handleLogin
                : handleSignup
            }
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold"
          >

            {isLogin
              ? "Login"
              : "Signup"}

          </button>

          <button
            onClick={() =>
              setIsLogin(
                !isLogin
              )
            }
            className="text-blue-600 font-bold w-full"
          >

            {isLogin
              ? "Create New Account"
              : "Already Have Account?"}

          </button>

        </div>

      </div>

    </div>

  );

}