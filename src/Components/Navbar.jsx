import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {

  const isLoggedIn =
    localStorage.getItem(
      "customerLogin"
    ) === "true";

  const userRole =
    localStorage.getItem(
      "userRole"
    );

  const currentPath =
    window.location.pathname;

  const isHomePage =
    currentPath === "/";

  const handleLogout = () => {

    localStorage.clear();

    window.location.href =
      "/";

  };

  return (

    <header className="sticky top-0 z-50 bg-white shadow-lg">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT SIDE */}

        <Link
          to="/"
          className="flex items-center gap-4"
        >

          <img            
            src={logo}
            alt="logo"
            className="w-16 h-16 rounded-full object-cover border-4 border-green-100"
          />

          <div>

            <h1 className="text-4xl font-black text-green-700">

              FarmFreshDairy

            </h1>

            <p className="text-gray-500 text-lg">

              Pure Milk Delivered Daily

            </p>

          </div>

        </Link>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-5">

          {/* GUEST */}

          {!isLoggedIn && (

            <>

              <Link
                to="/"
                className="font-bold text-gray-700 hover:text-green-600"
              >

                Home

              </Link>

              <button
                onClick={() => {

                  window.location.href =
                    "/auth";

                }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
              >

                Login

              </button>

            </>

          )}

          {/* CUSTOMER */}

          {isLoggedIn &&
            userRole ===
              "customer" &&
            !isHomePage && (

            <>

              <Link
                to="/dashboard"
                className="font-bold text-gray-700 hover:text-green-600"
              >

                Dashboard

              </Link>

              <Link
                to="/track-order"
                className="font-bold text-gray-700 hover:text-green-600"
              >

                Track Orders

              </Link>

              <button
                onClick={
                  handleLogout
                }
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
              >

                Logout

              </button>

            </>

          )}

          {/* ADMIN */}

          {isLoggedIn &&
            userRole ===
              "admin" && (

            <>

              <Link
                to="/admin"
                className="font-bold text-gray-700 hover:text-green-600"
              >

                Admin

              </Link>

              <button
                onClick={
                  handleLogout
                }
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
              >

                Logout

              </button>

            </>

          )}

          {/* DELIVERY */}

          {isLoggedIn &&
            userRole ===
              "delivery" && (

            <>

              <Link
                to="/delivery"
                className="font-bold text-gray-700 hover:text-green-600"
              >

                Delivery Panel

              </Link>

              <button
                onClick={
                  handleLogout
                }
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
              >

                Logout

              </button>

            </>

          )}

        </div>

      </div>

    </header>

  );

}