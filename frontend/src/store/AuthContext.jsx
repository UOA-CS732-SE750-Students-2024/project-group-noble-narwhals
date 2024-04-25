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
    console.log("initialize useEffect in AuthContext.jsx");
    // .get(`${import.meta.env.VITE_API_BASE_URL}/auth/check-session`)
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/auth/check-session`)
      .then((res) => {
        console.log("res.data", res.data)
        if (res.data.isLoggedIn) {
          setIsLoggedIn(res.data.isLoggedIn);
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

  useEffect(() => {
    console.log("当前登录状态:", isLoggedIn);
    console.log("当前用户数据:", user);
    // 在这里，你可以根据最新状态进行一些操作，比如导航重定向等
  }, [isLoggedIn, user]); // 监听 isLoggedIn 和 user 的变化

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
