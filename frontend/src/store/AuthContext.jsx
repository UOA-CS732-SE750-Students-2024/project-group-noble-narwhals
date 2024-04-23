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
          console.log("ready to set loggedIn to true")
          setUser(res.data.user);
          setIsLoggedIn(true);
        } else {
          console.log("ready to set loggedIn to false")
          setIsLoggedIn(false);
        }
        console.log("current loggedin?", isLoggedIn )
        setIsLoading(false);  // set loading status to false
      })
      .catch((err) => {
        setIsLoggedIn(false);
        setIsLoading(false);  // set loading status to false
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
