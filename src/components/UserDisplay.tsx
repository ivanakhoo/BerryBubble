import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "react-bootstrap";
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
}

interface Doc {
  id: string;
  data: UserData;
}

interface UserCardProps {
  user: Doc;
  isAdmin: boolean;
  updateVerifiedStatus?: (id: string, currentStatus: boolean) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isAdmin, updateVerifiedStatus }) => {
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
    <Card style={{ width: '18rem' }} className="mb-4">
      <CardBody>
        <h3>{user.data.DisplayName}</h3>
        <img 
          src={profileImg}
          alt="Profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #ddd"
          }}
        />
        <h5 className="mt-2">Class of {user.data.GradYear}</h5>
        <p>{user.data.JobTitle}</p>
        <p>{user.data.Company}</p>
        <p>{user.data.Bio}</p>
        {favoriteProjectTitle && <p><strong>Favorite Project:</strong> {favoriteProjectTitle}</p>}

        <div>
          {(user.data.GitHub || user.data.LinkedIn || user.data.email) && (
            <div>
              {user.data.GitHub && (
                <a
                  href={user.data.GitHub}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'black',
                    margin: '3px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-github" viewBox="0 0 16 16">
                                              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                                            </svg>
                </a>
              )}
              {user.data.LinkedIn && (
                <a
                  href={user.data.LinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'black',
                    margin: '3px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-linkedin" viewBox="0 0 16 16">
                                               <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                                             </svg>
                </a>
              )}
              {user.data.email && (
                <a
                  href={`mailto:${user.data.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'black',
                    margin: '3px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-envelope" viewBox="0 0 16 16">
                                               <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                                             </svg>
                </a>
              )}
            </div>
          )}
        </div>

        <Link to="/details" state={{ userUID: user.data.userUID, Dashboard: 0 }}>
          <Button variant="dark" className="mt-2">See More Details</Button>
        </Link>

        {isAdmin && updateVerifiedStatus && (
          <>
            <Link to="/update-profile" state={{ userUID: user.data.userUID }}>
              <Button variant="dark" className="mt-2">Update Profile</Button>
            </Link>
            <br />
            <Button
              variant="success"
              className="mt-2"
              onClick={() => updateVerifiedStatus(user.data.userUID, user.data.verified)}
            >
              {user.data.verified ? "Deactivate User" : "Activate User"}
            </Button>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default UserCard;
