import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase"; 
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Projects from "./Projects";
import WorkHistory from "./WorkHistory";

export default function Details() {
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const { currentUser } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);


    const location = useLocation();
    const userUID = location.state?.userUID; 
    const Dashboard = location.state?.Dashboard;

    interface User {
        Bio?: string;
        DisplayName?: string;
        FirstName?: string;
        LastName?: string;
        GitHub?: string;
        LinkedIn?: string;
        GradYear?: string;
        adminFlag?: boolean;
        createdAt?: string;
        email?: string;
        profilePic?: string;
        userUID?: string;
    }

    interface Project {
        ProjectName: string;
        CoverPicture: string;
        Summary: string;
        UserUID: string
        Technologies: string[];
      }

    
      const renderDashboardButton = () => {
        switch (Dashboard) {
          case 4:
            return (
              <Link to="/">
                <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Details</Button>
              </Link>
            );
          case 1:
            return (
              <Link to="/currentStudents">
                <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          case 2:
            return (
              <Link to="/alumni">
                <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          case 3:
            return (
              <Link to="/admin">
                <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          default:
            return (
                <Link to="/currentStudents">
                  <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Dashboard</Button>
                </Link>
              );
        }
      };

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userUID) return; 

            try {
                const docRef = doc(db, "users", userUID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as User;
                    setProfilePic(data.profilePic || ""); 
                    setUser(data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserProfile();
    }, [userUID]); 


    useEffect(() => {
        const fetchAdmin = async () => {
            const user = currentUser; 
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as { adminFlag?: boolean };
                    setIsAdmin(data.adminFlag || false); 
                }
            }
        };

        fetchAdmin();
    }, [currentUser]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!userUID) return;

            try {
                const projectsRef = collection(db, "projects");
                const q = query(projectsRef, where("UserUID", "==", userUID));
                const querySnapshot = await getDocs(q);
                const projectsList: Project[] = [];
                querySnapshot.forEach((doc) => {
                    projectsList.push({ UserUID: doc.id, ...doc.data() } as Project);
                });
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, [userUID]);

    if (!user) {
        return <h1 className="text-center mt-4">Loading...</h1>;
    }

    return (
      <div className="container py-5">
        {/* PROFILE SECTION */}
        <div className="card text-center shadow-sm p-4 mb-5" style={{ borderRadius: "20px" }}>
          <img
            src={profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            alt="Profile"
            style={{
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #e2e8f0",
              margin: "0 auto",
            }}
          />
          <h3 className="mt-3 mb-1">{user.DisplayName || "User Profile"}</h3>
          {user.GradYear && <p className="text-muted">Class of {user.GradYear}</p>}
          {user.Bio && (
            <div className="mt-2" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <p className="fst-italic">{user.Bio}</p>
            </div>
          )}

    
          {/* Icons */}
          <div className="d-flex justify-content-center gap-3 my-3">
            {user.GitHub && (
              <a href={user.GitHub} target="_blank" rel="noopener noreferrer" className="icon-link" style={{ fontSize: "1.8rem" }}>
                <i className="bi bi-github"></i>
              </a>
            )}
            {user.LinkedIn && (
              <a href={user.LinkedIn} target="_blank" rel="noopener noreferrer" className="icon-link" style={{ fontSize: "1.8rem" }}>
                <i className="bi bi-linkedin"></i>
              </a>
            )}
            {user.email && (
              <a href={`mailto:${user.email}`} target="_blank" rel="noopener noreferrer" className="icon-link" style={{ fontSize: "1.8rem" }}>
              <i className="bi bi-envelope"></i>
            </a>
            )}
          </div>
    
          {(isAdmin || (currentUser?.uid && user.userUID && currentUser.uid === user.userUID)) && (
            <Link to="/update-profile" state={{ userUID: user.userUID, Dashboard }}>
              <Button
                className="mt-2"
                style={{
                  color: "#4A90E2",
                  border: "1px solid #4A90E2",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4A90E2";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#4A90E2";
                }}
              >
                Update Profile
              </Button>

            </Link>
          )}
        </div>
    
        {/* PROJECTS SECTION */}
        <div className="mb-5">
          <div className="row g-4">
            <Projects userUID={userUID} isAdmin={isAdmin} currentUserUID={currentUser?.uid || ""} />
          </div>
        </div>
    
        {/* EXPERIENCE SECTION */}
        <div className="mb-5">
          <WorkHistory userUID={userUID} isAdmin={isAdmin} currentUserUID={currentUser?.uid || ""} />
        </div>
    
        {/* BACK BUTTON */}
        <div className="text-center">{renderDashboardButton()}</div>
      </div>
    );
    
     
}
