import { Navigate, Outlet } from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from "react";
// @ts-ignore
import { db } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default function AdminRoute() {
    const { currentUser } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 

    useEffect(() => {
        const fetchAdmin = async () => {
            if (!currentUser?.uid) {
                setIsAdmin(false);
                return;
            }

            try {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data() as { adminFlag?: boolean };
                    setIsAdmin(data.adminFlag ?? false);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
            }
        };

        fetchAdmin();
    }, []);

    if (isAdmin === null) return <p>Loading...</p>;

    return isAdmin ? <Outlet /> : <Navigate to="/login" />;
}
