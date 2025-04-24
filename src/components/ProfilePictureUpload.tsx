import React, { useState } from "react";
import axios from "axios";
// @ts-ignore
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface ProfilePictureUploadProp {
  UserUID: string;
  onUploadComplete: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProp> = ({ UserUID, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setUploading(true);
    try {
      const response = await axios.post<{ secure_url: string }>(CLOUDINARY_URL, formData);
      const uploadedImageUrl = response.data.secure_url;

      if (UserUID) {
        await setDoc(doc(db, "users", UserUID), { profilePic: uploadedImageUrl }, { merge: true });
        console.log("Profile picture updated!");
        onUploadComplete(uploadedImageUrl); // notify parent
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
      id={`profile-picture-upload-${UserUID}`}
      accept="image/*"
      onChange={handleImageUpload}
      style={{ display: "none" }}
    />
    <label
      htmlFor={`profile-picture-upload-${UserUID}`}
      style={{
        display: "inline-block",
        padding: "8px 16px",
        backgroundColor: "#4A90E2",
        color: "#fff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      <i className="bi bi-upload me-2" style={{ fontSize: "1rem" }} />
      Upload Profile Picture
    </label>
    {uploading && <p className="text-blue-600 mt-1">Please wait... uploading</p>}
  </div>
  );
};

export default ProfilePictureUpload;
