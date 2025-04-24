import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase"; 
import { Dropdown } from "react-bootstrap"
import { forwardRef } from "react";

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
  CardDescription: string;
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
    const navigate = useNavigate();

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

  const CustomToggle = forwardRef(({ onClick }: any, ref: any) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{
        all: "unset", 
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
      }}
    >
      <i className="bi bi-three-dots-vertical" style={{ fontSize: "1.2rem", color: "#2E3A59" }}></i>
    </button>
  ));
  

  return (
    <Card
  style={{
    width: '360px',
    height:'485px',
    maxHeight: '620px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '100px'
  }}
  className="mb-4 text-center text-white p-3"
>

  {/* Flag Button */}

<Dropdown style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
  <Dropdown.Toggle as={CustomToggle} />

  <Dropdown.Menu>
  {isAdmin && (<Dropdown.Item
    onClick={() => {
      navigate("/update-profile", {
        state: { userUID: user.data.userUID, Dashboard },
      });
    }}
  >
    <i className="bi bi-pencil me-2 text-primary" /> Update Profile
  </Dropdown.Item>)}

  {isAdmin && (
    <Dropdown.Item
    onClick={() => updateVerifiedStatus?.(user.data.userUID, user.data.verified)}
  >
    <i className={`bi ${user.data.verified ? "bi-person-dash" : "bi-person-check"} me-2 text-success`} />
    {user.data.verified ? "Deactivate User" : "Activate User"}
  </Dropdown.Item>)}

  {(user.data.reported && isAdmin) && (
    <Dropdown.Item
      onClick={() => resetReportedStatus?.(user.data.userUID, user.data.reported)}
    >
      <i className="bi bi-arrow-counterclockwise me-2 text-warning" /> Reset Reported Status
    </Dropdown.Item>
  )}

  {isAdmin && (
    <Dropdown.Divider />)}

  <Dropdown.Item
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
    <i className="bi bi-flag-fill me-2 text-danger" /> Report User
  </Dropdown.Item>
</Dropdown.Menu>

</Dropdown>



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
  {user.data.GradYear && (
    <p className="mb-1 text-sm text-secondary">Class of {user.data.GradYear}</p>
  )}

  {/* Social Icons */}
  <div className="d-flex justify-content-center gap-3 mb-3 social-icons">
  {user.data.GitHub && (
    <a href={user.data.GitHub} target="_blank" rel="noopener noreferrer" className="icon-link">
      <i className="bi bi-github"></i>
    </a>
  )}
  {user.data.LinkedIn && (
    <a href={user.data.LinkedIn} target="_blank" rel="noopener noreferrer" className="icon-link">
      <i className="bi bi-linkedin"></i>
    </a>
  )}
  {user.data.email && (
    <a href={`mailto:${user.data.email}`} target="_blank" rel="noopener noreferrer" className="icon-link">
      <i className="bi bi-envelope"></i>
    </a>
  )}
</div>

  {user.data.JobTitle && (
    <p className="mb-1">{user.data.JobTitle}</p>
  )}
  {user.data.Company && (
    <p className="mb-1">{user.data.Company}</p>
  )}
  {user.data.CardDescription && (
    <p className="mb-2 px-3" style={{ fontStyle: 'italic' }}>{user.data.CardDescription}</p>
  )}
  

  {favoriteProjectTitle && (
    <p className="mb-2"><strong>Favorite Project:</strong> {favoriteProjectTitle}</p>
  )}



<div style={{
    position: 'absolute',
    bottom: '15px',
    left: '16px',
    right: '16px',
  }}>
    <Link to="/details" state={{ userUID: user.data.userUID, Dashboard }}>
      <Button variant="dark" className="w-100 custom-btn">View Profile</Button>
    </Link>
  </div>
  
</Card>
  );
};

export default UserCard;
