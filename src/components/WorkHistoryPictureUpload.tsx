import React, { useRef, useState } from "react";
import axios from "axios";
// @ts-ignore
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface WorkHistoryPictureUploadProps {
  companyID: string;
  onUploadComplete: (url: string) => void;
}

const WorkHistoryPictureUpload: React.FC<WorkHistoryPictureUploadProps> = ({ companyID, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const user = auth.currentUser;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setUploading(true);
    try {
      const response = await axios.post<{ secure_url: string }>(CLOUDINARY_URL, formData);
      const uploadedImageUrl = response.data.secure_url;

      const q = query(collection(db, "history"), where("id", "==", companyID));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, { picture: uploadedImageUrl });
        onUploadComplete(uploadedImageUrl);
        console.log("Company logo updated!");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          display: "inline-block",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        Upload Company Logo
      </div>
      {uploading && <p className="text-blue-300 mt-1">Please wait... uploading</p>}
    </div>
  );
};

export default WorkHistoryPictureUpload;
