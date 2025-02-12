import React, { useState } from "react";
import { Card, Button, Alert, CardBody } from "react-bootstrap";
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    async function handleLogout() {
        setError('')

        try {
            await logout()
            navigate("/login")
        } catch {
            setError('Failed to log out.')
        }
    }


    return (
        <>
        <Card>
            <CardBody>
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>
                Email:
            </strong>
            {currentUser.email}
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
            </Link>
            <Link to="add-details" className="btn btn-primary w-100 mt-3">
            Add Details
            </Link>
            </CardBody>
        </Card>
        <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>Log Out</Button>
        </div>
        </>
    )
}

