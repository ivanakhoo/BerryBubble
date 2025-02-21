import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "react-bootstrap";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase"; 
import { collection, getDocs, doc, getDoc, query, where, updateDoc } from "firebase/firestore";

export default function Alumni() {
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [currentStudents, setCurrentStudents] = useState<{ id: string; data: any }[]>([]);
    const { currentUser } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean>(false); 

    useEffect(() => {
        const fetchProfilePic = async () => {
            const user = currentUser; 
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as { profilePic?: string, adminFlag?: boolean };
                    setProfilePic(data.profilePic || ""); 
                    setIsAdmin(data.adminFlag || false); 
                }
            }
        };

        fetchProfilePic();
    }, [currentUser]);

    useEffect(() => {
        async function fetchCurrentStudents() {
            try {
                const q = query(collection(db, "users"), where("verified", "==", true)); 
                const querySnapshot = await getDocs(q);
                const docsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));

                const currentStudents = docsArray.filter(doc => {
                    const gradYear = parseInt(doc.data.GradYear, 10); 
                    return gradYear <= 2024; 
                });

                setCurrentStudents(currentStudents); 
            } catch (error) {
                console.error("Error fetching current students:", error);
            }
        }

        fetchCurrentStudents(); 
    }, []); 

    const updateVerifiedStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { verified: !currentStatus });

            setCurrentStudents((prevStudents) =>
                prevStudents.filter(student => student.id !== userId) 
            );
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    return (
        <>
            {/* Display Current Students with their Profile Pictures */}
            <h1 className="text-center mt-4">Current Students</h1>
            <div className="d-flex flex-wrap justify-content-center">
                {currentStudents.map((doc) => (
                    <div key={doc.id} className="text-center p-3">
                        <Card style={{ width: '18rem' }} className="mb-4">
                            <CardBody>
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
                                <div>
                                    {(doc.data.GitHub || doc.data.LinkedIn || doc.data.email) && (
                                        <div>
                                            {doc.data.GitHub && (
                                                <a href={doc.data.GitHub} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                                                    <img src="/githubwhite.png" alt="GitHub" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                                                </a>
                                            )}
                                            {doc.data.LinkedIn && (
                                                <a href={doc.data.LinkedIn} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                                                    <img src="/linkedinwhite.png" alt="LinkedIn" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                                                </a>
                                            )}
                                            {doc.data.email && (
                                                <a href={`mailto:${doc.data.email}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                                                    <img src="/email.png" alt="Email" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {isAdmin && (
                                    <Link to="/update-profile" state={{ userUID: doc.data.userUID }}>
                                        <Button variant="dark" className="mt-2">Update Profile</Button>
                                    </Link>
                                )}
                                <br />
                                <Link to="/details" state={{ userUID: doc.data.userUID }}>
                                    <Button variant="dark" className="mt-2">See More Details</Button>
                                </Link>
                                <br />
                                {isAdmin && (
                                    <Button 
                                        variant="success" 
                                        className="mt-2" 
                                        onClick={() => updateVerifiedStatus(doc.id, doc.data.verified)}
                                    >
                                        Activate/Deactivate User
                                    </Button>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                ))}
            </div>
        </>
    );
}
