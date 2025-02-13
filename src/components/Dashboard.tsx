import React, { useState, useEffect } from "react";
import { Card, Button, Alert, CardBody } from "react-bootstrap";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
    const [error, setError] = useState("");
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

    // Fetch Firestore data when the component is mounted
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
                    <strong>Email:</strong>
                    {currentUser.email}
                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                        Update Profile
                    </Link>
                    <Link to="add-details" className="btn btn-primary w-100 mt-3">
                        Add Details
                    </Link>
                    <Link to="profile-picture-upload" className="btn btn-primary w-100 mt-3">
                        Profile Picture Upload
                    </Link>
                    <Link to="profile-picture-display" className="btn btn-primary w-100 mt-3">
                        Profile Picture Display
                    </Link>
                </CardBody>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div>

            {/* Automatically display fetched Firestore documents */}
            <h1 className="text-center mt-4">All other user data</h1>
            <ul>
                {allDocs.map((doc) => (
                <li key={doc.id}> {/* Add a unique key here */}
                <h2>Welcome, {doc.data.DisplayName}, Class of {doc.data.GradYear}!</h2>
                <br />
                <h3>{doc.data.FirstName}'s Bio: {doc.data.Bio}</h3>
                </li>
                ))}
            </ul>

        </>
    );
}
