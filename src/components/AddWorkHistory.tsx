import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase";
import { Form, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";

const WorkAddForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const companyID = location.state?.companyID;
  const userUID = location.state?.userUID;

  interface History {
    CompanyName: string;
    EndDate: string;
    StartDate: string;
    Role: string;
    picture?: string;
    id: string;
    UserUID: string;
    Description?: string;
  }

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      try {
        if (!companyID) return;
        const projectDoc = await getDoc(doc(db, "history", companyID));

        if (!isMounted) return;
        if (!projectDoc.exists()) {
          setError("No matching work history found.");
          return;
        }

        const projectData = projectDoc.data() as History;

        setCompanyName(projectData.CompanyName);
        setStartDate(projectData.StartDate);
        setEndDate(projectData.EndDate);
        setRole(projectData.Role);
        setDescription(projectData.Description || "");
      } catch (err) {
        if (isMounted) setError("Failed to fetch project data.");
      }
    };

    fetchProject();
    return () => {
      isMounted = false;
    };
  }, [companyID]);

  const handleWorkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!companyName.trim() || !startDate.trim() || !endDate.trim() || !role.trim()) {
      setError("All fields must be filled.");
      setLoading(false);
      return;
    }

    try {
      if (companyID) {
        // Update existing entry
        const projectRef = doc(db, "history", companyID);
        await updateDoc(projectRef, {
          CompanyName: companyName,
          StartDate: startDate,
          EndDate: endDate,
          Role: role,
          Description: description
        });
      } else {
        const projectRef = doc(collection(db, "history")); 
        const customCompanyID = projectRef.id;

        const newProject: History = {
        CompanyName: companyName,
        StartDate: startDate,
        EndDate: endDate,
        Role: role,
        picture: "",
        id: customCompanyID,
        UserUID: userUID,
        Description: description
        };

        await setDoc(projectRef, newProject);
            }

      navigate("/details", { state: { userUID: userUID } });
    } catch (err) {
      console.error("Project submission failed:", err);
      setError("Failed to create or update project.");
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString()).reverse();

  return  (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Form
          onSubmit={handleWorkSubmit}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            color: 'white',
          }}
        >
          <h1 className="text-center mb-4">{companyID ? "Edit Work History" : "Add Work History"}</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <FormGroup className="mb-3">
            <FormLabel>Company Name</FormLabel>
            <FormControl
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              required
              maxLength={20}
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Role</FormLabel>
            <FormControl
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter role"
              required
              maxLength={24}
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Description</FormLabel>
            <FormControl
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="(Optional) Enter description (250 character limit)"
              maxLength={250}
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Start Year</FormLabel>
            <Form.Select value={startDate} onChange={(e) => setStartDate(e.target.value)} required>
              <option value="">Select start year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </FormGroup>


          <FormGroup className="mb-3">
            <FormLabel>End Year</FormLabel>
            <Form.Select value={endDate} onChange={(e) => setEndDate(e.target.value)} required>
              <option value="">Select end year or 'Present'</option>
              <option value="Present">Present</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </FormGroup>


          <Button disabled={loading} className="w-100 mt-2" type="submit">
            {companyID ? "Save Changes" : "Create Work History"}
          </Button>

          <Link to="/details" state={{ userUID: userUID }}>
            <Button variant="dark" className="w-100 mt-2">Back to Details</Button>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default WorkAddForm;
