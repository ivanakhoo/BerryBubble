import React, { useEffect, useRef, useState } from "react";
import { Form, Button, FormLabel, FormGroup, FormControl, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
// @ts-ignore
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ProfilePictureUpload from "./ProfilePictureUpload";
import Sidebar from "./Sidebar";
import Projects from "./Projects";
import WorkHistory from "./WorkHistory";
import { reload } from "firebase/auth";

export default function UpdateProfile() {
    const [selectedSection, setSelectedSection] = useState<string>('account'); // State to track selected section
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLTextAreaElement>(null); 
    const cardDescRef = useRef<HTMLTextAreaElement>(null); 
    const gradYearRef = useRef<HTMLSelectElement>(null);
    const firstRef = useRef<HTMLInputElement>(null); 
    const lastRef = useRef<HTMLInputElement>(null); 
    const displayRef = useRef<HTMLInputElement>(null); 
    const gitHubRef = useRef<HTMLInputElement>(null); 
    const linkedInRef = useRef<HTMLInputElement>(null); 
    const jobTitleRef = useRef<HTMLInputElement>(null); 
    const companyRef = useRef<HTMLInputElement>(null); 
    const [accountMessage, setAccountMessage] = useState("");
    const { upJobTitle, upCompany, currentUser, upEmail, upPassword, upBio, upCardDesc, upGradYear, upFirstName, upLastName, upDisplayName, upGitHub, upLinkedIn } = useAuth();
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [profilePic, setProfilePic] = useState<string>("");


    const location = useLocation();
    const userUID = location.state?.userUID;
    const Dashboard = location.state?.Dashboard;

    const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    interface User {
        Bio?: string;
        DisplayName?: string;
        FirstName?: string;
        LastName?: string;
        GitHub?: string;
        LinkedIn?: string;
        GradYear?: string;
        adminFlag?: boolean;
        createdAt?: string;
        email?: string;
        profilePic?: string;
        userUID?: string;
        JobTitle?: string;
        Company?: string;
        FavoriteProject?: string;
        CardDescription?: string;
      }

    const [user, setUser] = useState<User | null>(null);

    const renderDashboardButton = () => {
        switch (Dashboard) {
          case 0:
            return (
              <Link to="/details" state={{ userUID: userUID }}>
                <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Details</Button>
              </Link>
            );
          case 1:
            return (
              <Link to="/currentStudents">
                <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          case 2:
            return (
              <Link to="/alumni">
                <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          case 3:
            return (
              <Link to="/admin">
                <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          case 4:
            return (
              <Link to="/">
                <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Dashboard</Button>
              </Link>
            );
          default:
            return (
                <Link to="/details" state={{ userUID: userUID }}>
                  <Button style={{ backgroundColor: "var(--text-dark)", color: "white", border: "1px solid #ccc" }} className="mt-2">Back to Details</Button>
                </Link>
              );
        }
      };

    useEffect(() => {
        const fetchUser = async () => {
        if (!userUID) return;
        await reload(currentUser); 
                        if (currentUser.emailVerified) {
                            await updateDoc(doc(db, "users", currentUser.uid), {
                            emailVerified: true,
                            });
                        }
        const userRef = doc(db, "users", userUID); 
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setUser(userSnap.data());
            const data = userSnap.data() as {profilePic?: string, GradYear: string};
            if (data.profilePic) {
                setProfilePic(data.profilePic);
            } 
            if (gradYearRef.current && data.GradYear) {
                gradYearRef.current.value = data.GradYear;
              }
        } else {
            console.log("No such user found!");
        }
        };

    fetchUser();
    }, [userUID]);


    function handleAccountSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const promises = [];
        setLoading(true);
        setError("");

        const gitHubURL = gitHubRef.current?.value || "";
        const linkedInURL = linkedInRef.current?.value || "";

        const githubRegex = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/;
        const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
        const gradYearRegex = /^\d{4}$/;

        if (gitHubURL && !githubRegex.test(gitHubURL)) {
            setError("Please enter a valid GitHub URL.");
            setLoading(false);
            return;
        }

        if (linkedInURL && !linkedinRegex.test(linkedInURL)) {
            setError("Please enter a valid LinkedIn URL.");
            setLoading(false);
            return;
        }

        const gradYear = gradYearRef.current?.value;

        if (gradYear && !gradYearRegex.test(gradYear)) {
            setError("Please enter a valid class year.");
            setLoading(false);
            return;
        }

        if (bioRef.current?.value) {
            promises.push(upBio(bioRef.current?.value, user)); 
        }

        if (cardDescRef.current?.value) {
            promises.push(upCardDesc(cardDescRef.current?.value, user)); 
        }

        if (gradYearRef.current?.value) {
            promises.push(upGradYear(gradYearRef.current?.value, user)); 
        }

        if (firstRef.current?.value) {
            promises.push(upFirstName(firstRef.current?.value, user)); 
        }

        if (lastRef.current?.value) {
            promises.push(upLastName(lastRef.current?.value, user)); 
        }

        if (displayRef.current?.value) {
            promises.push(upDisplayName(displayRef.current?.value, user)); 
        }

        if (gitHubURL) {
            promises.push(upGitHub(gitHubURL, user)); 
        }
        
        if (linkedInURL) {
            promises.push(upLinkedIn(linkedInURL, user)); 
        }

        if (jobTitleRef.current?.value) {
            promises.push(upJobTitle(jobTitleRef.current?.value, user)); 
        }

        if (companyRef.current?.value) {
            promises.push(upCompany(companyRef.current?.value, user)); 
        }

        Promise.all(promises)
            .then(() => {
                // navigate("/details", { state: { userUID: userUID } }); 
                setAccountMessage("Successfully saved changes!")
            })
            .catch(() => {
                setError("Failed to update account.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            return setError("Passwords do not match.");
        }

        const promises = [];
        setLoading(true);
        setError("");

        if (emailRef.current?.value !== user?.email) {
            promises.push(
                upEmail(emailRef.current?.value, user).then(() => {
                    alert("Check your new email for a verification link.");
                })
            );
        }

        if (passwordRef.current?.value) {
            promises.push(upPassword(passwordRef.current?.value, user));
        }

        Promise.all(promises)
            .catch(() => {
                setError("Failed to update password.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className="flex flex-col md:flex-row">
          <Sidebar selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
          
          {/* Main content container */}
          <div style={{ flex: 1, padding: '20px' }}>

              {/* Conditionally render form based on selected section */}
              {selectedSection === 'account' && (
                <div className="d-flex justify-content-center">
  <div className="w-100" style={{ maxWidth: "600px" }}>
  <h1 className="text-center mb-4">Account Details</h1>
    {/* Profile Picture Upload Section */}
    <div className="text-center mb-3">
                  <img 
                      src={profilePic || defaultProfilePic} 
                      alt="Profile" 
                      style={{
                        width: "150px", 
                        height: "150px", 
                        borderRadius: "50%", 
                        objectFit: "cover",
                        border: "3px solid #ddd",
                        margin: "15px"
                      }} 
                  />
                  <ProfilePictureUpload UserUID={userUID} onUploadComplete={(url) => setProfilePic(url)} />
              </div>
                  <Form onSubmit={handleAccountSubmit}>
                      <FormGroup id="firstName">
                          <FormLabel>First Name</FormLabel>
                          <FormControl type="text" ref={firstRef} required maxLength={20} defaultValue={user?.FirstName} placeholder="Enter your first name." />
                      </FormGroup>

                      <FormGroup id="lastName">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl type="text" ref={lastRef} required maxLength={20} defaultValue={user?.LastName} placeholder="Enter your last name." />
                      </FormGroup>

                      <FormGroup id="displayName">
                          <FormLabel>Display Name</FormLabel>
                          <FormControl type="text" ref={displayRef} required maxLength={30} defaultValue={user?.DisplayName} placeholder="Enter your preferred display name." />
                      </FormGroup>

                      <FormGroup id="carddesc">
                          <FormLabel>Card Description</FormLabel>
                          <FormControl as="textarea" ref={cardDescRef} maxLength={150} defaultValue={user?.CardDescription} placeholder="Enter your card description (150 character limit)." />
                      </FormGroup>

                      <FormGroup id="bio">
                          <FormLabel>Bio</FormLabel>
                          <FormControl as="textarea" ref={bioRef} maxLength={500} defaultValue={user?.Bio} placeholder="Enter your bio." />
                      </FormGroup>

                     <FormGroup id="gradYear">
                        <FormLabel>Graduation Year</FormLabel>
                        <Form.Select ref={gradYearRef} required defaultValue={user?.GradYear || ""}>
                            <option value="">Select your graduation year</option>
                            {Array.from(
                            { length: new Date().getFullYear() + 4 - 1950 + 1 },
                            (_, i) => (new Date().getFullYear() + 4 - i).toString()
                            ).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                            ))}
                        </Form.Select>
                        </FormGroup>

                      <FormGroup id="JobTitle">
                          <FormLabel>Job Title</FormLabel>
                          <FormControl type="text" ref={jobTitleRef} maxLength={30} defaultValue={user?.JobTitle} placeholder="Enter your current job title." />
                      </FormGroup>

                      <FormGroup id="Company">
                          <FormLabel>Current Company</FormLabel>
                          <FormControl type="text" ref={companyRef} maxLength={30} defaultValue={user?.Company} placeholder="Enter your current company." />
                      </FormGroup>

                      <FormGroup id="LinkedIn">
                          <FormLabel>LinkedIn URL</FormLabel>
                          <FormControl type="text" ref={linkedInRef} defaultValue={user?.LinkedIn} placeholder="Enter your LinkedIn URL." />
                      </FormGroup>

                      <FormGroup id="GitHub">
                          <FormLabel>GitHub URL</FormLabel>
                          <FormControl type="text" ref={gitHubRef} defaultValue={user?.GitHub} placeholder="Enter your GitHub URL." />
                      </FormGroup>

                      <Button
                    disabled={loading}
                    className="w-100 mt-2"
                    type="submit"
                    style={{ backgroundColor: "#4A90E2", color: "white", border: "1px solid #ccc" }}
                    >
                    Save
                    </Button>
                  
                  </Form>
                  <br />
                  {error && <Alert variant="danger">{error}</Alert>}
                  {accountMessage && <Alert variant="success">{accountMessage}</Alert>}
                  <div className="text-center">
                    {renderDashboardButton()}
                  </div>
                  </div>
                  </div>
              )}

              {selectedSection === 'password' && (
                <div className="d-flex justify-content-center">
  <div className="w-100" style={{ maxWidth: "600px" }}>
  <h1 className="text-center mb-4">Change Credentials</h1>
    {/* Profile Picture Upload Section */}
    <div className="text-center mb-3">
                  <img 
                      src={profilePic || defaultProfilePic} 
                      alt="Profile" 
                      style={{
                        width: "150px", 
                        height: "150px", 
                        borderRadius: "50%", 
                        objectFit: "cover",
                        border: "3px solid #ddd",
                        margin: "15px"
                      }} 
                  />
                  <ProfilePictureUpload UserUID={userUID} onUploadComplete={(url) => setProfilePic(url)} />
              </div>
                  <Form onSubmit={handlePasswordSubmit}>

                      <FormGroup id="email">
                          <FormLabel>Email</FormLabel>
                          <FormControl type="email" ref={emailRef} required defaultValue={user?.email} />
                      </FormGroup>

                      <FormGroup id="password">
                          <FormLabel>Password</FormLabel>
                          <FormControl type="password" ref={passwordRef} placeholder="Leave blank to keep the same." />
                      </FormGroup>

                      <FormGroup id="password-confirm">
                          <FormLabel>Password Confirmation</FormLabel>
                          <FormControl type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same." />
                      </FormGroup>

                      <Button
                          disabled={loading}
                          className="w-100 mt-2"
                          type="submit"
                      >
                          Save
                      </Button>
                  </Form>
                  <div className="text-center">
                    {renderDashboardButton()}
                  </div>
                  </div>
                  </div>
              )}

              {selectedSection === 'projects' && (
                  <div>
                    <h1 className="text-center mb-4">Update Experience</h1>
                      <Projects userUID={userUID} isAdmin={true} currentUserUID={currentUser.uid} /> 

                      <WorkHistory userUID={userUID} isAdmin={true} currentUserUID={currentUser.uid}></WorkHistory>

                      <div className="text-center">
                    {renderDashboardButton()}
                  </div>
                  </div>
              )}
          </div>
      </div>
    );
}

