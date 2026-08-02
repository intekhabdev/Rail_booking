import { Link, useNavigate } from "react-router-dom";
import { FaTrain, FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { logout as logoutUser } from "../api/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
        >
          <FaTrain />
          RailBook
        </Link>

        <div className="hidden md:flex items-center gap-6 text-gray-700">
          <Link className="hover:text-blue-600 transition" to="/">
            Home
          </Link>

          <Link className="hover:text-blue-600 transition" to="/trains">
            Trains
          </Link>
          {user?.role === "user" && <Link to="/bookings">My Bookings</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
          {!user ? (
            <>
              <Link className="hover:text-blue-600" to="/login">
                Login
              </Link>

              <Link
                className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition"
                to="/register"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-gray-600">
                <FaUserCircle />
                {user?.name || "User"}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden flex flex-col gap-3 p-4 bg-gray-50 border-t">
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link to="/trains" onClick={() => setOpen(false)}>
            Trains
          </Link>
          {user?.role === "user" && <Link to="/bookings">My Bookings</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>

              <Link to="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-500 text-left">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
