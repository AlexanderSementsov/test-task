import React, { useState } from "react";
import { navigate } from "gatsby";
import { login } from '../services/api';

const AuthContext = React.createContext({});

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      if (response && response.success) {
        setAuthenticated(true);
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
    navigate("/login");
  };

  const checkAuthenticated = () => {
    return authenticated;
  };

  return (
    <AuthContext.Provider value={{ authenticated, login: handleLogin, logout: handleLogout, checkAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };