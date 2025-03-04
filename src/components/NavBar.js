import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isAuth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav>
      <div className="navbar-left">
        <Link to="/" className="logo">
          SiamSavvy
        </Link>
      </div>
      <div className="navbar-center">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/">Blogs</Link>
          </li>
          <li>
            <Link to="/places">Places</Link>
          </li>
          <li>
            <Link to="/plans/generate">Trip planner</Link>
          </li>
          {!isAuth && (
            <li>
              <Link to="/Login">Login</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="navbar-right">
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
                    <Link to="/">Profile</Link>
                  </li>
                  <li>
                    <Link to="/">Blogs</Link>
                  </li>
                  <li>
                    <Link to="/">Plans</Link>
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
  );
}

export default NavBar;
