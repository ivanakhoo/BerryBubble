import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // Adjust if necessary
import { createUserWithEmailAndPassword } from "firebase/auth";

// Create Context with initial value
const AuthContext = createContext(null);

// Hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe; // Cleanup on component unmount
  }, []);

  const value = {
    currentUser,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
