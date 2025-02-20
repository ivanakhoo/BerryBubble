import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "react-bootstrap";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default function Details() {
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const { currentUser } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);


    const location = useLocation();
    const userUID = location.state?.userUID; 

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

    if (!user) {
        return <h1 className="text-center mt-4">Loading...</h1>;
    }

    return (
        <>
            <h1 className="text-center mt-4">{user.DisplayName || "User Profile"}</h1>
            <div className="d-flex justify-content-center">
                <Card style={{ width: '22rem' }} className="mb-4">
                    <CardBody className="text-center">
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
                        <h3>{user.DisplayName}</h3>
                        <h5>Class of {user.GradYear}</h5>
                        <p>{user.Bio}</p>

                        <div>
                            {(user.GitHub || user.LinkedIn || user.email) && (
                                <div>
                                    {user.GitHub && (
                                        <a href={user.GitHub} target="_blank" rel="noopener noreferrer">
                                            <img src="/githubwhite.png" alt="GitHub" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                                        </a>
                                    )}
                                    {user.LinkedIn && (
                                        <a href={user.LinkedIn} target="_blank" rel="noopener noreferrer">
                                            <img src="/linkedinwhite.png" alt="LinkedIn" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                                        </a>
                                    )}
                                    {user.email && (
                                        <a href={`mailto:${user.email}`} target="_blank" rel="noopener noreferrer">
                                            <img src="/email.png" alt="Email" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>                
                        {isAdmin && (
                            <Link to="/update-profile" state={{ userUID: user.userUID }}>
                                <Button variant="dark" className="mt-2">Update Profile</Button>
                            </Link>
                        )}
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
