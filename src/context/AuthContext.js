import { useEffect, useState, createContext } from "react";
import { loginApi } from "../api/userApi";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenExpirationCheck, setTokenExpirationCheck] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken && tokenExpiry) {
      const now = new Date().getTime();
      if (now >= tokenExpiry) {
        alert("Your session has expired. Please log in again.");
        logout();
      } else {
        setUser(storedUser);
        setToken(storedToken);
        setTokenExpirationCheck(tokenExpiry - now); // Set timeout for alert
      }
    }
  }, []);

  const login = async (userData) => {
    try {
      const response = await loginApi(userData);
      const expiryTime = new Date().getTime() + response?.data.expiresIn;
      localStorage.setItem("user", JSON.stringify({ id: response?.data.id, username: response?.data.username }));
      localStorage.setItem("token", response?.data.token);
      localStorage.setItem("tokenExpiry", expiryTime);
      setUser(localStorage.getItem("user"));
      setTokenExpirationCheck(response?.data.expiresIn);
      setToken(response?.data.token);
    } catch (err) {
      console.log("failed to login");
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");

    setUser(null);
    setToken(null);

    if (navigate) navigate("/");
  };

  const isAuth = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
