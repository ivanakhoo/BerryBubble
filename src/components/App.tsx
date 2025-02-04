import React from "react";
import Signup from "./SignUp";
import { Container } from "react-bootstrap";
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Signup />
        </div>
      </Container>
    </AuthProvider>
  );
};

export default App;