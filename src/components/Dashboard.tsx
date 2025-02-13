import React, { useState, useEffect } from "react";
import { Card, Button, Alert, CardBody } from "react-bootstrap";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
    const [error, setError] = useState("");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [allDocs, setAllDocs] = useState<{ id: string; data: any }[]>([]);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        setError('');

        try {
            await logout();
            navigate("/login");
        } catch {
            setError('Failed to log out.');
        }
    }

    // Fetch profile picture of current user from Firestore
    useEffect(() => {
        const fetchProfilePic = async () => {
            const user = currentUser; // Get current user from context
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as { profilePic?: string };
                    setProfilePic(data.profilePic || ""); // Set profilePic state
                }
            }
        };

        fetchProfilePic();
    }, [currentUser]);

    // Fetch all user data from Firestore
    useEffect(() => {
        async function fetchAll() {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const docsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                setAllDocs(docsArray); // Update state with fetched documents
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchAll(); // Call the fetchAll function when component mounts
    }, []); // Empty dependency array means it only runs once on mount

    return (
        <>
            <Card>
                <CardBody>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email:</strong> {currentUser.email}
                    <br />
                    {/* Display Profile Picture for Current User */}
                    {profilePic ? (
                        <div className="mt-3">
                            <h3>Profile Picture</h3>
                            <img 
                            src={profilePic} 
                            alt="Profile" 
                            style={{
                              width: "150px", 
                              height: "150px", 
                              borderRadius: "50%", 
                              objectFit: "cover",
                              border: "3px solid #ddd" // Optional border for aesthetics
                            }} 
                          />
                        </div>
                    ) : (
                        <p>No profile picture uploaded</p>
                    )}
                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                        Update Profile
                    </Link>
                </CardBody>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div>

            {/* Display All Users with their Profile Pictures */}
            <h1 className="text-center mt-4">All Users</h1>
            <div className="d-flex flex-wrap justify-content-center">
                {allDocs.map((doc) => (
                    <div key={doc.id} className="text-center p-3">
                        <h3>{doc.data.DisplayName}</h3>
                        {/* Display Profile Picture for each user */}
                        {doc.data.profilePic ? (
                            <img 
                            src={doc.data.profilePic} 
                            alt="Profile" 
                            style={{
                              width: "150px", 
                              height: "150px", 
                              borderRadius: "50%", 
                              objectFit: "cover",
                              border: "3px solid #ddd" 
                            }} 
                          />
                        ) : (
                            <img 
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                            alt="Profile" 
                            style={{
                              width: "150px", 
                              height: "150px", 
                              borderRadius: "50%", 
                              objectFit: "cover",
                              border: "3px solid #ddd"
                            }} 
                          />
                        )}
                        <h5>Class of {doc.data.GradYear}</h5>
                        <p>{doc.data.Bio}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
