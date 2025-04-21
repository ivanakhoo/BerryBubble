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
                <Button variant="dark" className="mt-2">Back to Details</Button>
              </Link>
            );
          case 1:
            return (
              <Link to="/currentStudents">
                <Button variant="dark" className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          case 2:
            return (
              <Link to="/alumni">
                <Button variant="dark" className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          case 3:
            return (
              <Link to="/admin">
                <Button variant="dark" className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          default:
            return (
                <Link to="/currentStudents">
                  <Button variant="dark" className="mt-2">Back to Dashboard</Button>
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
        <>
            <h1 className="text-center mt-4">{user.DisplayName || "User Profile"}</h1>
            <div className="d-flex justify-content-center">
                    <div style={{ textAlign: "center" }}>
                        <img 
                            src={profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                            alt="Profile" 
                            style={{
                                width: "150px", 
                                height: "150px", 
                                borderRadius: "50%", 
                                objectFit: "cover",
                                border: "3px solid #ddd" 
                            }} 
                        />
                        <h5 style={{ textAlign: "center" }}>Class of {user.GradYear}</h5>
                        <p style={{ textAlign: "center" }}>{user.Bio}</p>

                        <div style={{ textAlign: "center" }}>
                            {(user.GitHub || user.LinkedIn || user.email) && (
                                <div>
                                {user.GitHub && (
                                   <a href={user.GitHub} 
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
                                   }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-github" viewBox="0 0 16 16">
                                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                                    </svg>
                                </a>
                                
                                )}
                                {user.LinkedIn && (
                                    <a href={user.LinkedIn} 
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
                                    }}>
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-linkedin" viewBox="0 0 16 16">
                                       <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                                     </svg>
                                 </a>
                                 
                                )}
                                {user.email && (
                                    <a href={`mailto:${user.email}`} 
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
                                    }}>
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-envelope" viewBox="0 0 16 16">
                                       <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                                     </svg>
                                 </a>
                                 
                                )}
                            </div>
                            )}
                        </div>
                        {(isAdmin || currentUser == userUID) && (
                            <Link to="/update-profile" state={{ userUID: user.userUID, Dashboard: Dashboard }}>
                                <Button variant="dark" className="mt-2">Update Profile</Button>
                            </Link>
                        )}
                        <Projects userUID={userUID} isAdmin={isAdmin} currentUserUID={currentUser.uid} /> 
                    </div>
                    
            </div>
            <WorkHistory userUID={userUID} isAdmin={isAdmin} currentUserUID={currentUser.uid}/>
<div className="text-center">
{renderDashboardButton()}
</div>
            <div>
  </div>
        </>
    );
}
