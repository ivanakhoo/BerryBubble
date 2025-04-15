import axios from "axios";
// @ts-ignore
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface ProjectPictureUploadProps {
  projectName: string;
}

const ProjectPictureUpload: React.FC<ProjectPictureUploadProps> = ({ projectName }) => {

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
      const projectsRef = collection(db, "projects");
      const q = query(projectsRef, where("ProjectName", "==", projectName));
      const querySnapshot = await getDocs(q);
      console.log(q);
      if (!querySnapshot.empty) {
        const projectDoc = querySnapshot.docs[0]; 
        await updateDoc(projectDoc.ref, { CoverPicture: uploadedImageUrl });
        console.log("Project picture updated!");
      } else {
        console.log("No matching project found.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="project-picture-upload"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <label
        htmlFor="project-picture-upload"
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
    </div>
  );
};

export default ProjectPictureUpload;
