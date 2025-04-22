import React, { useState } from "react";
import axios from "axios";
// @ts-ignore
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface ProjectPictureUploadProps {
  id: string;
  onUploadComplete: (url: string) => void;
}

const ProjectPictureUpload: React.FC<ProjectPictureUploadProps> = ({ id, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const user = auth.currentUser;

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

      const q = query(collection(db, "projects"), where("id", "==", id));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const projectDoc = snapshot.docs[0];
        await updateDoc(projectDoc.ref, { CoverPicture: uploadedImageUrl });
        onUploadComplete(uploadedImageUrl);
        console.log("Project picture updated!");
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
        id={`project-picture-upload-${id}`}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <label
        htmlFor={`project-picture-upload-${id}`}
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
        Upload Project Picture
      </label>
      {uploading && <p className="text-blue-600 mt-1">Please wait... uploading</p>}
    </div>
  );
};

export default ProjectPictureUpload;
