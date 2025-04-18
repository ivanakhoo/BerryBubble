import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase"; 

interface UserData {
  DisplayName: string;
  profilePic?: string;
  GradYear: string;
  JobTitle: string;
  Company: string;
  Bio: string;
  GitHub?: string;
  LinkedIn?: string;
  email?: string;
  userUID: string;
  verified: boolean;
  FavoriteProject?: string;
  reported: boolean;
}

interface Doc {
  id: string;
  data: UserData;
}

interface UserCardProps {
  user: Doc;
  isAdmin: boolean;
  updateVerifiedStatus?: (id: string, currentStatus: boolean) => void;
  resetReportedStatus?: (id: string, reportedStatus: boolean) => void;
  Dashboard: number;
}

const UserCard: React.FC<UserCardProps> = ({ user, isAdmin, updateVerifiedStatus, resetReportedStatus, Dashboard }) => {
  const profileImg = user.data.profilePic 
    || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    const [favoriteProjectTitle, setFavoriteProjectTitle] = useState<string>("");

  useEffect(() => {
    const fetchProject = async () => {
      if (user.data.FavoriteProject) {
        try {
          const projectRef = doc(db, "projects", user.data.FavoriteProject);
          const projectSnap = await getDoc(projectRef);
          if (projectSnap.exists()) {
            const projectData = projectSnap.data();
            setFavoriteProjectTitle(projectData.ProjectName || "Unnamed Project");
          } else {
            setFavoriteProjectTitle("Project not found");
          }
        } catch (error) {
          console.error("Error fetching project:", error);
          setFavoriteProjectTitle("Error loading project");
        }
      }
    };

    fetchProject();
  }, [user.data.FavoriteProject]);

  return (
    <Card
  style={{
    width: '100%',
    maxWidth: '360px', // 👈 consistent card width
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    margin: '0 auto', // 👈 optional: horizontally center card itself
  }}
  className="mb-4 text-center text-white p-3"
>

  {/* Flag Button */}
  {!user.data.reported && (
    <Button
      variant="danger"
      size="sm"
      title="Report User"
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 10px rgba(255,0,0,0.4)",
        zIndex: 10,
      }}
      onClick={async () => {
        try {
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, { reported: true });
          user.data.reported = true;
          alert("User has been reported.");
        } catch (error) {
          console.error("Error reporting user:", error);
        }
      }}
    >
      <i className="bi bi-flag-fill" style={{ color: "white", fontSize: "1rem" }}></i>
    </Button>
  )}

  {/* Profile Image */}
  <img
  src={profileImg}
  alt="Profile"
  style={{
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid rgba(255,255,255,0.2)",
    boxShadow: "0 0 12px rgba(255, 255, 255, 0.2)",
    marginBottom: "12px",
    marginLeft: "auto",   // 👈 center horizontally
    marginRight: "auto",  // 👈 center horizontally
    display: "block"      // 👈 required for margin auto to take effect
  }}
/>


  <h4 className="fw-bold mb-1">{user.data.DisplayName}</h4>
  <p className="mb-1 text-sm text-secondary">Class of {user.data.GradYear}</p>
  <p className="mb-1">{user.data.JobTitle}</p>
  <p className="mb-1">{user.data.Company}</p>
  <p className="mb-2 px-3" style={{ fontStyle: 'italic' }}>{user.data.Bio}</p>

  {favoriteProjectTitle && (
    <p className="mb-2"><strong>Favorite Project:</strong> {favoriteProjectTitle}</p>
  )}

  {/* Social Icons */}
  <div className="d-flex justify-content-center gap-2 mb-3">
    {user.data.GitHub && (
      <a href={user.data.GitHub} target="_blank" rel="noopener noreferrer" className="tech-icon-link">
        <i className="bi bi-github"></i>
      </a>
    )}
    {user.data.LinkedIn && (
      <a href={user.data.LinkedIn} target="_blank" rel="noopener noreferrer" className="tech-icon-link">
        <i className="bi bi-linkedin"></i>
      </a>
    )}
    {user.data.email && (
      <a href={`mailto:${user.data.email}`} target="_blank" rel="noopener noreferrer" className="tech-icon-link">
        <i className="bi bi-envelope"></i>
      </a>
    )}
  </div>

  <Link to="/details" state={{ userUID: user.data.userUID, Dashboard }}>
    <Button variant="dark" className="w-100 mb-2">See More Details</Button>
  </Link>

  {isAdmin && (
    <>
      <Link to="/update-profile" state={{ userUID: user.data.userUID, Dashboard }}>
        <Button variant="outline-light" className="w-100 mb-2">Update Profile</Button>
      </Link>

      <Button
        variant="outline-success"
        className="w-100 mb-2"
        onClick={() => updateVerifiedStatus?.(user.data.userUID, user.data.verified)}
      >
        {user.data.verified ? "Deactivate User" : "Activate User"}
      </Button>

      {user.data.reported && (
        <Button
          variant="outline-warning"
          className="w-100"
          onClick={() => resetReportedStatus?.(user.data.userUID, user.data.reported)}
        >
          Reset Reported Status
        </Button>
      )}
    </>
  )}
</Card>
  );
};

export default UserCard;
