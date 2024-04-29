// Global state management for user authentication

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  // add loading status, default is true

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/auth/check-session`)
      .then((res) => {
        if (res.data.isLoggedIn) {
          setUser(res.data.user);
          setIsLoggedIn(true);
          window.localStorage.setItem("isLoggedIn", true);
        } else {
          console.log("ready to set loggedIn to false")
          setIsLoggedIn(false);
          setUser(null);
          window.localStorage.setItem("isLoggedIn", false);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoggedIn(false);
        setIsLoading(false);
        window.localStorage.setItem("isLoggedIn", false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
