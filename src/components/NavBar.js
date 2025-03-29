import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavBar({ variant = "white" }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAuth, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [img, setImg] = useState(user?.imageUrl); // Use context user first

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    // Update img when user context changes
    if (user?.imageUrl) {
      setImg(user.imageUrl);
    } else {
      // Fallback to localStorage if context doesn't have it
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setImg(storedUser?.imageUrl);
    }
  }, [user]); // Watch for changes in user context

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.imageUrl && storedUser.imageUrl !== img) {
        setImg(storedUser.imageUrl);
      }
    };

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [img]);

  return (
    <header className="absolute w-full z-10">
      <nav
        className={`p-4 ${variant === "black" ? "text-black" : " text-white "}`}
      >
        <div className="navbar-left ">
          <Link to="/" className="logo ">
            SiamSavvy
          </Link>
        </div>
        <div className="navbar-center ">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/blogs">Blogs</Link>
            </li>
            <li>
              <Link to="/places">Places</Link>
            </li>
            <li>
              <Link to="/plans/generate">Trip planner</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          {!isAuth && <Link to="/Login">Login</Link>}
          {isAuth && (
            <div className="relative">
              <img
                src={img || "https://randomuser.me/api/portraits/men/1.jpg"} // Fallback image
                alt="User Profile"
                className="profile-pic rounded-full w-10 h-10 object-cover cursor-pointer"
                onClick={toggleDropdown}
              />
              {dropdownVisible && (
                <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownVisible(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blogs/saved"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownVisible(false)}
                      >
                        Blogs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/plans/saved"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownVisible(false)}
                      >
                        Plans
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout(navigate);
                          setDropdownVisible(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
