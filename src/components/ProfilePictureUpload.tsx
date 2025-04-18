import axios from "axios";
// @ts-ignore
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface ProfilePictureUploadProp {
  UserUID: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProp> = ({ UserUID }) => {

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post<{ secure_url: string }>(CLOUDINARY_URL, formData);
      const uploadedImageUrl = response.data.secure_url;

      // Save the image URL in Firestore
      if (UserUID) {
        await setDoc(
          doc(db, "users", UserUID),
          { profilePic: uploadedImageUrl },
          { merge: true }
        );
        console.log("Profile picture updated!");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };


  return (
    <div>
      <p className="text-center mt-3">Upload Profile Picture</p>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

export default ProfilePictureUpload;
