import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
// @ts-ignore
import { db } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';

const NavBarComponent: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string>("");
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  useEffect(() => {
    if (!currentUser) {
      // Reset profile picture when the user is logged out
      setProfilePic("");
      return;
    }

    // Fetch the user's profile picture from Firebase
    const fetchProfilePic = async () => {
      const userDocRef = doc(db, "users", currentUser.uid); // Replace with actual UID logic
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData && userData.profilePic) {
          setProfilePic(userData.profilePic);
        }
      }
    };

    fetchProfilePic();
  }, [currentUser]);

  async function handleLogout() {
    setError('');

    try {
      await logout();
      navigate("/login");
    } catch {
      setError('Failed to log out.');
    }
  }

  // Don't render the navbar if no user is logged in
  if (!currentUser) {
    return null;  // You can return any fallback content here, like a login button or a message.
  }

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/">Berry Bubble</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          {/* TODO */}
          <Nav.Link href="#current">Current Students</Nav.Link>
          {/* TODO */}
          <Nav.Link href="#alumni">Alumni</Nav.Link>
        </Nav>
        <Nav className="ms-auto d-flex align-items-center">
          {/* Profile Dropdown */}
          <NavDropdown
            title="My Profile"
            id="navbarScrollingDropdown"
          >
            <NavDropdown.Item as={Link} to="/update-profile">
              Update Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
            <Nav.Link>
              <img
                src={profilePic || defaultProfilePic}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #ddd"
                }}
              />
            </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBarComponent;
