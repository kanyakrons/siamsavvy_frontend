import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavBar({ variant = "white" }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAuth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="absolute w-full z-10">
      <nav
        className={`p-4 ${
          variant === "black" ? " text-black" : " text-white "
        }`}
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
            <img
              src="https://your-user-profile-image-url.com"
              alt="User Profile"
              className="profile-pic"
              onClick={toggleDropdown}
            />
          )}
          {dropdownVisible && (
            <div className="dropdown-menu">
              <ul>
                {isAuth && (
                  <>
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                      <Link to="/blogs/saved">Blogs</Link>
                    </li>
                    <li>
                      <Link to="/plans/saved">Plans</Link>
                    </li>
                    <li>
                      <button
                        onClick={() => logout(navigate)}
                        className="text-red-500"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
