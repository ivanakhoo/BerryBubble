import React from "react";
import Signup from "./SignUp";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import NavBarComponent from "./NavBarComponent";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// @ts-ignore
import { AuthProvider } from "../contexts/AuthContext";
import Details from "./Details";
import CurrentStudentsDashboard from "./CurrentStudentsDashboard";
import AlumniDashboard from "./AlumniDashboard";
import Admin from "./Admin";
import AdminRoute from "./AdminRoute";
import Unauthorized from "./Unauthorized";
import Verification from "./Verification";
import AddProject from "./AddProject";
import Network from "./Network";
import AddWorkHistory from "./AddWorkHistory";

const AppRoutes: React.FC = () => {
  const location = useLocation();

  // Routes that should take up the full screen width
  const fullScreenRoutes = [
    "/",
    "/network",
    "/admin",
    "/currentStudents",
    "/alumni",
    "/update-profile",
    "/add-project",
    "/add-history",
    "/details",
  ];

  const isFullScreen = fullScreenRoutes.includes(location.pathname);

  return (
    <div
      className="w-100"
      style={{
        paddingTop: "70px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A0F2C, #0D122F)",
        color: "white",
        backgroundSize: "400% 400%",
        animation: "gradientFlow 10s ease infinite",
      }}
      
    >
      {isFullScreen ? (
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/network" element={<PrivateRoute />}>
            <Route index element={<Network />} />
          </Route>
          <Route path="/currentStudents" element={<PrivateRoute />}>
            <Route index element={<CurrentStudentsDashboard />} />
          </Route>
          <Route path="/alumni" element={<PrivateRoute />}>
            <Route index element={<AlumniDashboard />} />
          </Route>
          <Route path="/update-profile" element={<PrivateRoute />}>
            <Route index element={<UpdateProfile />} />
          </Route>
          <Route path="/add-project" element={<PrivateRoute />}>
            <Route index element={<AddProject />} />
          </Route>
          <Route path="/add-history" element={<PrivateRoute />}>
            <Route index element={<AddWorkHistory />} />
          </Route>
          <Route path="/details" element={<PrivateRoute />}>
            <Route index element={<Details />} />
          </Route>
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<Admin />} />
          </Route>
          <Route path="/unauthorized" element={<PrivateRoute />}>
            <Route index element={<Unauthorized />} />
          </Route>
        </Routes>
      ) : (
        <Container className="d-flex align-items-center justify-content-center">
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verification" element={<Verification />} />
            </Routes>
          </div>
        </Container>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NavBarComponent />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
