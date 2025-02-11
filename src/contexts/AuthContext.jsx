import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // Adjust if necessary
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword, verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

// Create Context with initial value
const AuthContext = createContext(null);

// Hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function upEmail(newEmail) {
    if (!currentUser) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const user = auth.currentUser;
    const email = user.email;
    const password = prompt("Please enter your password to confirm email update:"); 
    
    if (!password) {
      return Promise.reject(new Error("Password is required for re-authentication"));
    }
  
    const credential = EmailAuthProvider.credential(email, password);
  
    return reauthenticateWithCredential(user, credential)
      .then(() => {
        console.log("Verified!")
        return verifyBeforeUpdateEmail(user, newEmail);
      })
      .catch((error) => {
        console.error("Failed to update email:", error);
        throw error;
      });
  }
  

  function upPassword(password) {
    return updatePassword(currentUser, password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false)
    });

    return unsubscribe; 
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    upEmail,
    upPassword
  };

  return <AuthContext.Provider value={value}>
    {!loading && children}</AuthContext.Provider>;
}
