import { useState, useEffect } from "react";
import { Button, Card, CardBody, FormControl, InputGroup } from "react-bootstrap";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase"; 
import { collection, getDocs, doc, getDoc, query, where, updateDoc } from "firebase/firestore";
import SearchBar from "./SearchBar";

export default function Dashboard() {
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [verifiedUsers, setVerifiedUsers] = useState<{ id: string; data: any }[]>([]);
    const { currentUser } = useAuth();
    const [filteredUsers, setFilteredUsers] = useState<{ id: string; data: any }[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
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
        async function fetchVerifiedUsers() {
            try {
                const q = query(collection(db, "users"), where("verified", "==", true), where("emailVerified", "==", true)); 
                const querySnapshot = await getDocs(q);
                const docsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                setVerifiedUsers(docsArray); 
            } catch (error) {
                console.error("Error fetching verified users:", error);
            }
        }

        fetchVerifiedUsers(); 
    }, []); 

    const updateVerifiedStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { verified: !currentStatus });

            setVerifiedUsers((prevUsers) =>
                prevUsers.filter(user => user.id !== userId) 
            );
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = verifiedUsers.filter(user =>
            user.data.DisplayName.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    return (
        <>
            <SearchBar query={searchQuery} onSearch={handleSearch} />
    
            {/* Display Verified Users with their Profile Pictures */}
            <h1 className="text-center mt-4">Verified Users</h1>
            <div className="d-flex flex-wrap justify-content-center">
                {(searchQuery ? filteredUsers : verifiedUsers).map((doc) => (
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
                                <h5 className="mt-2">Class of {doc.data.GradYear}</h5>
                                <p>{doc.data.Bio}</p>
                                {/* Display social links and buttons as before */}
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
                                        Deactivate User
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
