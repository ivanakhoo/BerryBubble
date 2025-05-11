import { Navigate, Outlet } from 'react-router-dom'
// @ts-ignore
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute() {
    const { currentUser } = useAuth();
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
}