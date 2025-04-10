import axios from "axios";
// @ts-ignore
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

const SchoolPictureUpload: React.FC = () => {
  const user = auth.currentUser;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post<{ secure_url: string }>(CLOUDINARY_URL, formData);
      const uploadedImageUrl = response.data.secure_url;

      await addDoc(collection(db, "schools"), {
        picture: uploadedImageUrl,
        verified: false,
        uploadedBy: user.uid,
        uploadedAt: new Date()
      });

      console.log("New school entry created!");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

export default SchoolPictureUpload;
