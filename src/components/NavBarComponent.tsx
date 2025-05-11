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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 
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

    async function handleLogout() {
      try {
        await logout();
        navigate("/login");
      } catch {
        console.error('Failed to log out.');
      }
    }
    

  // Don't render the navbar if no user is logged in
  // if (!currentUser) {
  //   return null;  // You can return any fallback content here, like a login button or a message.
  // }

  return (
    <Navbar bg="#4A90E2" data-bs-theme="dark" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/">Berry Bubble</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/currentStudents">Current Students</Nav.Link>
            <Nav.Link href="/alumni">Alumni</Nav.Link>
            <Nav.Link href="/network">Network</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            {isAdmin && <Nav.Link href="/admin">Admin</Nav.Link>}
          </Nav>
          <Nav className="ms-auto d-flex align-items-center">
          {currentUser ? (
              <NavDropdown title="My Profile" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/update-profile" state={{ userUID: currentUser.uid }}>
                  Update Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">
                Sign In
              </Nav.Link>
            )}

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
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default NavBarComponent;
