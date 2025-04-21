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
      } catch (err) {
        if (isMounted) setError("Failed to fetch project data.");
      }
    };

    fetchProject();
    return () => {
      isMounted = false;
    };
  }, [companyID]);

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
          Role: role
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

  return (
    <Form onSubmit={handleProjectSubmit}>
      <h1>{companyID ? "Edit Work History" : "Add Work History"}</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <FormGroup className="mb-3">
        <FormLabel>Company Name</FormLabel>
        <FormControl
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          required
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
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>Start Date</FormLabel>
        <FormControl
          type="text"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Enter start date"
          required
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>End Date</FormLabel>
        <FormControl
          type="text"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Enter end date (e.g. Present)"
          required
        />
      </FormGroup>

      <Button disabled={loading} className="w-100 mt-2" type="submit">
        {companyID ? "Save Changes" : "Create Work History"}
      </Button>

      <Link to="/details" state={{ userUID: userUID }}>
        <Button variant="dark" className="mt-2 w-100">Back to Details</Button>
      </Link>
    </Form>
  );
};

export default WorkAddForm;
