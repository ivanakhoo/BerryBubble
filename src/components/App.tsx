import React from "react";
import Signup from "./SignUp";
import Dashboard from "./Dashboard";
import Login from "./Login"
import ForgotPassword from "./ForgotPassword"
import PrivateRoute from "./PrivateRoute"
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
const App: React.FC = () => {
  return (
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<PrivateRoute />}>
                  <Route index element={<Dashboard />}></Route>
                </Route>
                <Route path="/signup" element={<Signup />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/forgot-password" element={<ForgotPassword />}/>
              </Routes>
            </AuthProvider>
          </Router>
        </div>
      </Container>
  );
};

export default App;