import React from "react";
import Signup from "./SignUp";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import NavBarComponent from "./NavBarComponent";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import Details from "./Details";
import CurrentStudentsDashboard from "./CurrentStudentsDashboard";
import AlumniDashboard from "./AlumniDashboard";
import Admin from "./Admin";
import AdminRoute from "./AdminRoute";
import Unauthorized from "./Unauthorized";
import Verification from "./Verification";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NavBarComponent /> {/* Add Navbar here */}
        <div
          className="w-100"
          style={{
            paddingTop: "70px", // Adjust this based on the height of your navbar
            minHeight: "100vh",
            background: "linear-gradient(135deg, #1d3c6a, #3e6b8c, #000000)", // Lighter blue to black gradient
            color: "white", // Text contrast color
            backgroundSize: "400% 400%", // Creates the flowy effect
            animation: "gradientFlow 10s ease infinite", // Smooth gradient animation
          }}
        >
          <Container className="d-flex align-items-center justify-content-center">
            <div className="w-100" style={{ maxWidth: "400px" }}>
              <Routes>
                <Route path="/" element={<PrivateRoute />}>
                  <Route index element={<Dashboard />} />
                </Route>
                <Route path="/update-profile" element={<PrivateRoute />}>
                  <Route index element={<UpdateProfile />} />
                </Route>
                <Route path="/details" element={<PrivateRoute />}>
                  <Route index element={<Details />} />
                </Route>
                <Route path="/currentStudents" element={<PrivateRoute />}>
                  <Route index element={<CurrentStudentsDashboard />} />
                </Route>
                <Route path="/alumni" element={<PrivateRoute />}>
                  <Route index element={<AlumniDashboard />} />
                </Route>
                <Route path="/admin" element={<AdminRoute />}>
                  <Route index element={<Admin />} />
                </Route>
                <Route path="/unauthorized" element={<PrivateRoute />}>
                  <Route index element={<Unauthorized />} />
                </Route>
                <Route path="/verification" element={<Verification />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </div>
          </Container>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
