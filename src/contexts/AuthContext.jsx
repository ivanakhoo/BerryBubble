import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // Adjust if necessary
// @ts-ignore
import { db } from "../firebase"; // Import Firestore instance
import { doc, setDoc, updateDoc, collection } from "firebase/firestore";
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

  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const newUserRef = doc(db, "users", user.uid);

      await setDoc(newUserRef, {
        email: user.email,
        createdAt: new Date().toISOString(),
      });
  
      return user; 
    } catch (error) {
      console.error("Error signing up:", error);
      throw error; 
    }
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

  async function upEmail(newEmail) {
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

  async function upBio(bio) {
    if (!currentUser) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", currentUser.uid); // Get reference to the user's Firestore document
  
    return updateDoc(userRef, {
      Bio: bio, // Update the Bio field
    })
      .then(() => {
        console.log("Bio updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating bio:", error);
        throw error;
      });
  }
  
  async function upGradYear(gradYear) {
    if (!currentUser) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", currentUser.uid); // Get reference to the user's Firestore document
  
    return updateDoc(userRef, {
      GradYear: gradYear, // Update the GradYear field
    })
      .then(() => {
        console.log("Graduation year updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating graduation year:", error);
        throw error;
      });
  }

  async function upFirstName(firstName) {
    if (!currentUser) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", currentUser.uid); 
  
    return updateDoc(userRef, {
      FirstName: firstName,
    })
      .then(() => {
        console.log("First name updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating first name:", error);
        throw error;
      });
  }


  async function upLastName(lastName) {
    if (!currentUser) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", currentUser.uid); 
  
    return updateDoc(userRef, {
      LastName: lastName,
    })
      .then(() => {
        console.log("Last name updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating last name:", error);
        throw error;
      });
  }

  async function upDisplayName(displayName) {
    if (!currentUser) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", currentUser.uid); 
  
    return updateDoc(userRef, {
      DisplayName: displayName,
    })
      .then(() => {
        console.log("Display name updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating display name:", error);
        throw error;
      });
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
    upPassword,
    upBio,
    upGradYear,
    upFirstName,
    upLastName,
    upDisplayName
  };

  return <AuthContext.Provider value={value}>
    {!loading && children}</AuthContext.Provider>;
}
