import { useEffect, useState } from 'react';
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
// @ts-ignore
import { db } from "../firebase";

export default function Verification() {
  const { currentUser, upEmailVerified } = useAuth();
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchEmailVerified = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as { emailVerified?: boolean };
          setEmailVerified(!!data.emailVerified);
        }
      }
    };

    fetchEmailVerified();
  }, [currentUser]);

  const handleCheckVerification = async () => {
    if (currentUser) {
      await currentUser.reload();
      if (!emailVerified) {
        await upEmailVerified(currentUser);
        setEmailVerified(true);
        alert("Your email has been verified!");
      } else {
        alert("Your email is already verified.");
      }
    }
  };
  

  return (
    <div style={{ textAlign: "center" }}>
      {emailVerified ? (
        <h1 className="text-center mt-4">Your email is verified!</h1>
      ) : (
        <h1 className="text-center mt-4">Your email is not verified.</h1>
      )}
      <button onClick={handleCheckVerification}>Verify Email</button>
    </div>
  );
}
