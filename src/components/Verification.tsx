import React, { useEffect } from 'react';
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';

export default function Verification() {
  const { currentUser, upEmailVerified } = useAuth();

  useEffect(() => {
    const checkVerification = async () => {
      if (currentUser) {
        await currentUser.reload(); 
        if (currentUser.emailVerified) {
          await upEmailVerified(currentUser);
          alert("Your email has been verified!");
        } else {
          alert("Please check your email to verify your account.");
        }
      }
    };

    checkVerification();
  }, [currentUser, upEmailVerified]);

  return <div>You are now verified!</div>;
};

