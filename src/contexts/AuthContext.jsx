import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // Adjust if necessary
// @ts-ignore
import { db } from "../firebase"; // Import Firestore instance
import { doc, setDoc, updateDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword, verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from "firebase/auth";

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

      await sendEmailVerification(user);

      const newUserRef = doc(db, "users", user.uid);

      await setDoc(newUserRef, {
        email: user.email,
        userUID: user.uid,
        adminFlag: false,
        createdAt: new Date().toISOString(),
        verified: false,
        emailVerified: false
      });
  
      return user; 
    } catch (error) {
      console.error("Error signing up:", error);
      throw error; 
    }
  }
  

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  async function upEmail(newEmail, user) {
    console.log(user)
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
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
  

  function upPassword(password, user) {
    return updatePassword(user, password)
  }

  async function upBio(bio, user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); // Get reference to the user's Firestore document
  
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
  
  async function upGradYear(gradYear, user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); // Get reference to the user's Firestore document
  
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

  async function upFirstName(firstName, user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); 
  
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


  async function upLastName(lastName, user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); 
  
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

  async function upDisplayName(displayName, user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); 
  
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

  async function upLinkedIn(linkedIn, user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); 
  
    return updateDoc(userRef, {
      LinkedIn: linkedIn,
    })
      .then(() => {
        console.log("LinkedIn URL updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating LinkedIn URL:", error);
        throw error;
      });
  }

  async function upGitHub(gitHub, user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); 
  
    return updateDoc(userRef, {
      GitHub: gitHub,
    })
      .then(() => {
        console.log("GitHub URL updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating GitHub URL:", error);
        throw error;
      });
  }

  async function upJobTitle(jobTitle, user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); 
  
    return updateDoc(userRef, {
      JobTitle: jobTitle,
    })
      .then(() => {
        console.log("JobTitle updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating JobTitle:", error);
        throw error;
      });
  }

  async function upCompany(company, user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); 
  
    return updateDoc(userRef, {
      Company: company,
    })
      .then(() => {
        console.log("Company updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating Company:", error);
        throw error;
      });
  }

  async function upEmailVerified(user) {
    if (!user) {
      return Promise.reject(new Error("No authenticated user"));
    }
  
    const userRef = doc(db, "users", user.userUID); 
  
    return updateDoc(userRef, {
      emailVerified: true
    })
      .then(() => {
        console.log("Email was successfully verified!");
      })
      .catch((error) => {
        console.error("Error verifiying email:", error);
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
    upDisplayName,
    upLinkedIn,
    upGitHub,
    upEmailVerified,
    upCompany,
    upJobTitle
  };

  return <AuthContext.Provider value={value}>
    {!loading && children}</AuthContext.Provider>;
}
