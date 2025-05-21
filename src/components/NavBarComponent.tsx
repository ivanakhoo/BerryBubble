import React, { useEffect, useState, useRef } from 'react';
import { Container, Nav, Navbar, NavDropdown, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
// @ts-ignore
import { db } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';
import Collapse from 'bootstrap/js/dist/collapse';

const NavBarComponent: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string>("");
  const { currentUser, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 
  const navigate = useNavigate();
  const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const collapseRef = useRef<HTMLDivElement | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const handleHelpClose = () => setShowHelp(false);
  const handleHelpShow = () => setShowHelp(true);


  const collapseMenu = () => {
    if (collapseRef.current) {
      const bsCollapse = Collapse.getInstance(collapseRef.current) || new Collapse(collapseRef.current, { toggle: false });
      bsCollapse.hide();
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setProfilePic("");
      return;
    }

    const fetchProfilePic = async () => {
      const userDocRef = doc(db, "users", currentUser.uid);
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

  return (
    <Navbar bg="#4A90E2" data-bs-theme="dark" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/">Berry Bubble</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" ref={collapseRef}>
          <Nav className="me-auto">
            <Nav.Link href="/" onClick={collapseMenu}>Home</Nav.Link>
            <Nav.Link href="/currentStudents" onClick={collapseMenu}>Current Students</Nav.Link>
            <Nav.Link href="/alumni" onClick={collapseMenu}>Alumni</Nav.Link>
            <Nav.Link href="/network" onClick={collapseMenu}>Network</Nav.Link>
            <Nav.Link href="/about" onClick={collapseMenu}>About</Nav.Link>
            {isAdmin && <Nav.Link href="/admin" onClick={collapseMenu}>Admin</Nav.Link>}
          </Nav>
          <Nav className="ms-auto d-flex align-items-center">
            {currentUser ? (
              <NavDropdown title="My Profile" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/update-profile" state={{ userUID: currentUser.uid }} onClick={collapseMenu}>
                  Update Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleHelpShow}>
                  Help
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => { handleLogout(); collapseMenu(); }}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" onClick={collapseMenu}>
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
      <Modal show={showHelp} onHide={handleHelpClose} centered>
  <Modal.Header closeButton>
    <Modal.Title>Don't see your profile?</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Users must be email verified and admin verified before their profiles appear on the directories. Please email <a href="mailto:ivanakhoo@gmail.com">ivanakhoo@gmail.com</a> if you have any questions or concerns. Thank you!
</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleHelpClose}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </Navbar>
  );
};

export default NavBarComponent;
