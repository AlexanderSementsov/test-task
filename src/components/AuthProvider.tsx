import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import { login } from "../services/api";

const AuthContext = React.createContext({});

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      const isAuthenticated = !!token;
      setAuthenticated(isAuthenticated);
      setToken(token);
    };

    checkAuthentication();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      if (response && response.token) {
        const { token } = response;
        setAuthenticated(true);
        localStorage.setItem("token", token);
        setToken(token);
        navigate("/");
      } else {
        console.error("Login failed:", response);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const checkAuthenticated = () => {
    return authenticated;
  };

  return (
    <AuthContext.Provider value={{ authenticated, token, login: handleLogin, logout: handleLogout, checkAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
