import { useState, useEffect } from "react";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
// @ts-ignore
import { db } from "../firebase"; 
import { collection, getDocs, doc, getDoc, query, where, updateDoc } from "firebase/firestore";
import SearchBar from "./SearchBar";
import UserDisplay from "./UserDisplay";
import { reload } from "firebase/auth";

export default function Dashboard() {
    const [verifiedUsers, setVerifiedUsers] = useState<{ id: string; data: any }[]>([]);
    const { currentUser } = useAuth();
    const [filteredUsers, setFilteredUsers] = useState<{ id: string; data: any }[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchCategory, setSearchCategory] = useState("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false); 

    useEffect(() => {
        const fetchProfilePic = async () => {
            const user = currentUser; 
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as { profilePic?: string, adminFlag?: boolean, emailVerified?: boolean };
                    setIsAdmin(data.adminFlag || false); 
                }
            }
        };

        fetchProfilePic();
    }, [currentUser]);

    useEffect(() => {
        async function fetchVerifiedUsers() {
            try {
                if (currentUser) {
                    await reload(currentUser); 
                if (currentUser.emailVerified) {
                    await updateDoc(doc(db, "users", currentUser.uid), {
                    emailVerified: true,
                    });
                }
                }
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
    
        const filtered = verifiedUsers.filter(user => {
            const name = user.data.DisplayName?.toLowerCase() || "";
            const gradYear = String(user.data.GradYear || "").toLowerCase();
            const jobTitle = user.data.JobTitle?.toLowerCase() || "";
            
            return (
                name.includes(query) ||
                gradYear.includes(query) ||
                jobTitle.includes(query)
            );
        });
    
        setFilteredUsers(filtered);
    };

    return (
        <>
            <div className="text-center w-full">
            <SearchBar
                query={searchQuery}
                onSearch={handleSearch}
                searchCategory={searchCategory}
                onCategoryChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setSearchCategory(event.target.value);
                }}
            />
            </div>

    
            {/* Display Verified Users with their Profile Pictures */}
            <h1 className="text-center mt-4">Berry Bubble</h1>
            <div className="d-flex flex-wrap justify-content-center">
                {(searchQuery ? filteredUsers : verifiedUsers).map((doc) => (
                    <div key={doc.id} className="text-center p-3">
                        <UserDisplay 
                        user={doc} 
                        isAdmin={isAdmin} 
                        updateVerifiedStatus={() => updateVerifiedStatus(doc.data.userUID, doc.data.verified)} 
                        Dashboard={4}
                        />
                    </div>
                ))}
            </div>
        </>
    );
    
}
