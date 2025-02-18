import React from "react";
import Signup from "./SignUp";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import NavBarComponent from "./NavBarComponent";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";

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