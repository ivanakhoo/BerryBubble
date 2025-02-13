import { useEffect, useState } from "react";
// @ts-ignore
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProfilePictureDisplay: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string>("");

  useEffect(() => {
    const fetchProfilePic = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as { profilePic?: string };
          setProfilePic(data.profilePic || ""); // Ensure fallback to empty string
        }
      }
    };

    fetchProfilePic();
  }, [auth.currentUser]); // Dependency added to re-run effect when user changes

  return (
    <div>
      {profilePic ? (
        <img src={profilePic} alt="Profile" width="100" style={{ borderRadius: "50%" }} />
      ) : (
        <p>No profile picture uploaded</p>
      )}
    </div>
  );
};

export default ProfilePictureDisplay;
