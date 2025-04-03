import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "react-bootstrap";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase"; 
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import SearchBar from "./SearchBar";

export default function Admin() {
    const [unverifiedUsers, setUnverifiedUsers] = useState<{ id: string; data: any }[]>([]);
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false); 

    useEffect(() => {
        const fetchProfilePic = async () => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as { profilePic?: string, adminFlag?: boolean };
                    setIsAdmin(data.adminFlag || false); 
                }
            }
        };

        fetchProfilePic();
    }, [currentUser]);

    useEffect(() => {
        async function fetchUnverifiedUsers() {
            try {
                const q = query(collection(db, "users"), where("verified", "==", false), where("emailVerified", "==", true));
                const querySnapshot = await getDocs(q);

                const usersArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));

                setUnverifiedUsers(usersArray); 
            } catch (error) {
                console.error("Error fetching unverified users:", error);
            }
        }

        fetchUnverifiedUsers(); 
    }, []); 


    const updateVerifiedStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { verified: !currentStatus });

            // Update state immediately to reflect the change
            setUnverifiedUsers((prevUsers) =>
                prevUsers.filter(user => user.id !== userId) // Remove user from list after verification
            );
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredUsers = unverifiedUsers.filter(user =>
        (user.data.DisplayName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
    

    return (
        <>
            <SearchBar query={searchQuery} onSearch={handleSearch} />

            <h1 className="text-center mt-4">Admin</h1>
            
            <div className="d-flex flex-wrap justify-content-center">
                {filteredUsers.map((doc) => (
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
                                {isAdmin && (
                                    <Link to="/update-profile" state={{ userUID: doc.id }}>
                                        <Button variant="dark" className="mt-2">Update Profile</Button>
                                    </Link>
                                )}
                                <br />
                                <Link to="/details" state={{ userUID: doc.id, Dashboard: 3 }}>
                                    <Button variant="dark" className="mt-2">See More Details</Button>
                                </Link>
                                <br />
                                {isAdmin && (
                                    <Button 
                                        variant="success" 
                                        className="mt-2" 
                                        onClick={() => updateVerifiedStatus(doc.id, doc.data.verified)}
                                    >
                                        Verify User
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
