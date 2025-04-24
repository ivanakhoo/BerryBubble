import React, { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <div
        className="d-flex d-flex align-items-center dropdown-item"
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: "pointer", padding: 0 }}
      >
        <i className="bi bi-upload me-2" style={{ fontSize: "1rem" }} />
        <span>Upload Project Picture</span>
      </div>
      {uploading && (
        <p className="text-muted mb-0 ps-5" style={{ fontSize: "0.85rem" }}>
          Please wait... uploading
        </p>
      )}
    </div>
  );
};

export default ProjectPictureUpload;
