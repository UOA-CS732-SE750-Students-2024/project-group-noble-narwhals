import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/auth/check-session`)
      .then((res) => {
        if (res.data.isLoggedIn) {
          setUser(res.data.user);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        console.log("current loggedin?", isLoggedIn )
      })
      .catch((err) => {
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
