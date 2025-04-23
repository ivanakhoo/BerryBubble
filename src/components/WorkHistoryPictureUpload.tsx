import axios from "axios";
// @ts-ignore
import { db, auth } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface WorkHistoryPictureUploadProps {
  companyID: string;
}

const WorkHistoryPictureUpload: React.FC<WorkHistoryPictureUploadProps> = ({ companyID }) => {
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

      const docRef = doc(db, "history", companyID);
      await updateDoc(docRef, { picture: uploadedImageUrl });

      console.log("Project picture updated!");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        id={`project-picture-upload-${companyID}`}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <label
        htmlFor={`project-picture-upload-${companyID}`}
        style={{
          display: "inline-block",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Upload Company Logo
      </label>
    </div>
  );
};

export default WorkHistoryPictureUpload;
