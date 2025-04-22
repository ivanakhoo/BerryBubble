import React, { useState } from "react";
import axios from "axios";
// @ts-ignore
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

const SchoolPictureUpload: React.FC = () => {
  const user = auth.currentUser;
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setSuccess(false);

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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); 
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploading && <p className="text-light mt-2">Please wait... uploading</p>}
      {success && <p className="text-green-300 mt-2">Upload successful!</p>}
    </div>
  );
};

export default SchoolPictureUpload;
