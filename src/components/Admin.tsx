import { useState, useEffect } from "react";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
// @ts-ignore
import { db } from "../firebase"; 
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import SearchBar from "./SearchBar";
import UserDisplay from "./UserDisplay";

export default function Admin() {
    const [unverifiedUsers, setUnverifiedUsers] = useState<{ id: string; data: any }[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<{ id: string; data: any }[]>([]);
    const [unverifiedCompanies, setUnverifiedCompanies] = useState<{ id: string; data: any }[]>([]);
    const [unverifiedSchools, setUnverifiedSchools] = useState<{ id: string; data: any }[]>([]);
    const [reportedUsers, setReportedUsers] = useState<{ id: string; data: any }[]>([]);

    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchCategory, setSearchCategory] = useState("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false); 

    useEffect(() => {
        async function fetchUnverifiedCompaniesAndSchools() {
            try {
                const companiesQuery = query(
                    collection(db, "companies"),
                    where("verified", "==", false)
                );
                const companiesSnapshot = await getDocs(companiesQuery);
                const companiesArray = companiesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
    
                const schoolsQuery = query(
                    collection(db, "schools"),
                    where("verified", "==", false)
                );
                const schoolsSnapshot = await getDocs(schoolsQuery);
                const schoolsArray = schoolsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
    
                setUnverifiedCompanies(companiesArray);
                setUnverifiedSchools(schoolsArray);
            } catch (error) {
                console.error("Error fetching unverified companies or schools:", error);
            }
        }
    
        fetchUnverifiedCompaniesAndSchools();
    }, []);
    

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
                const docsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                setUnverifiedUsers(docsArray); 
            } catch (error) {
                console.error("Error fetching alumni users:", error);
            }
        }

        fetchUnverifiedUsers(); 
    }, []); 

    useEffect(() => {
        async function fetchReportedUsers() {
            try {
                const q = query(collection(db, "users"), where("reported", "==", true)); 
                const querySnapshot = await getDocs(q);
                const docsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                setReportedUsers(docsArray); 
            } catch (error) {
                console.error("Error fetching reported users:", error);
            }
        }

        fetchReportedUsers(); 
    }, []); 

    const updateVerifiedStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { verified: !currentStatus });

            setUnverifiedUsers((prevStudents) =>
                prevStudents.filter(student => student.id !== userId) 
            );
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    const resetReportedStatus = async (userId: string, reportedStatus: boolean) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { reported: !reportedStatus });

            setReportedUsers((prevStudents) =>
                prevStudents.filter(student => student.id !== userId) 
            );
        } catch (error) {
            console.error("Error updating reported status:", error);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
    
        const filtered = unverifiedUsers.filter(user => {
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
    
    const updateEntityVerifiedStatus = async (
        collectionName: string,
        docId: string,
        currentStatus: boolean,
        setEntities: React.Dispatch<React.SetStateAction<{ id: string; data: any }[]>>
    ) => {
        try {
            const ref = doc(db, collectionName, docId);
            await updateDoc(ref, { verified: !currentStatus });
    
            setEntities(prev => prev.filter(e => e.id !== docId));
        } catch (error) {
            console.error(`Error updating verification status for ${collectionName}:`, error);
        }
    };
    

    return (
        <>
            <div className="text-center">
                        <SearchBar
                            query={searchQuery}
                            onSearch={handleSearch}
                            searchCategory={searchCategory}
                            onCategoryChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                            setSearchCategory(event.target.value);
                            }}
                        />
                        </div>

            <h1 className="text-center mt-4">Admin</h1>
            
            <div className="d-flex flex-wrap justify-content-center">
                {(searchQuery ? filteredUsers : unverifiedUsers).map((doc) => (
                    <div key={doc.id} className="text-center p-3">
                        <UserDisplay 
                        user={doc} 
                        isAdmin={isAdmin} 
                        updateVerifiedStatus={() => updateVerifiedStatus(doc.data.userUID, doc.data.verified)} 
                        Dashboard={3}
                        />
                    </div>
                ))}
            </div>
            {unverifiedCompanies.length > 0 && (
                <>
            <h2 className="text-center mt-4">Unverified Companies</h2>
            <div className="d-flex flex-wrap justify-content-center">
                {unverifiedCompanies.map((doc) => (
                    <div key={doc.id} className="text-center p-3 border rounded m-2">
                        <img
                        key={doc.id}
                        src={doc.data.picture}
                        alt={`Company ${doc.id}`}
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: 8,
                            margin: "10px"
                        }}
                        />
                        <button 
                            className="btn btn-success"
                            onClick={() => updateEntityVerifiedStatus("companies", doc.id, doc.data.verified, setUnverifiedCompanies)}
                        >
                            Verify
                        </button>
                    </div>
                ))}
            </div>
            </>
            )}

            {unverifiedSchools.length > 0 && (
                <>
                <h2 className="text-center mt-4">Unverified Schools</h2>
                <div className="d-flex flex-wrap justify-content-center">
                    {unverifiedSchools.map((doc) => (
                        <div key={doc.id} className="text-center p-3 border rounded m-2">
                            <img
                            key={doc.id}
                            src={doc.data.picture}
                            alt={`Company ${doc.id}`}
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: 8,
                                margin: "10px"
                            }}
                            />
                            <button 
                                className="btn btn-success"
                                onClick={() => updateEntityVerifiedStatus("schools", doc.id, doc.data.verified, setUnverifiedSchools)}
                            >
                                Verify
                            </button>
                        </div>
                    ))}
                </div>
                </>
            )}
            
            {reportedUsers.length > 0 && (
                <>
                <h2 className="text-center mt-4">Reported Users</h2>
                <div className="d-flex flex-wrap justify-content-center">
                    {reportedUsers.map((doc) => (
                        <div key={doc.id} className="text-center p-3">
                            <UserDisplay 
                            user={doc} 
                            isAdmin={isAdmin} 
                            updateVerifiedStatus={() => updateVerifiedStatus(doc.data.userUID, doc.data.verified)} 
                            resetReportedStatus={() => resetReportedStatus(doc.data.userUID, doc.data.reported)}
                            Dashboard={3}
                            />
                        </div>
                    ))}
                </div>
                </>
            )}

        </>
    );
}
