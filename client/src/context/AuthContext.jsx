/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useState, useContext, useEffect } from "react";

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user data on mount if already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/me", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
