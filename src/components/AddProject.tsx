import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase";
import { Form, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";

const ProjectAddForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [techError, setTechError] = useState(false);
  
  const [projectName, setProjectName] = useState("");
  const [summary, setSummary] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [projectLink, setProjectLink] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const projectID = location.state?.projectID;
  const userUID = location.state?.userUID;

  interface Project {
    ProjectName: string;
    Summary?: string;
    Technologies?: string[];
    ProjectLink?: string;
  }

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      try {
        if (!projectID) return;
        const projectsRef = collection(db, "projects");
        // make the userUID check as well for the query
        const q = query(projectsRef, where("id", "==", projectID), where("UserUID", "==", userUID));
        const querySnapshot = await getDocs(q);

        if (!isMounted) return;
        if (querySnapshot.empty) {
          setError("No matching project found.");
          return;
        }

        const projectDoc = querySnapshot.docs[0];
        const projectData = projectDoc.data() as Project;

        setProjectName(projectData.ProjectName || "");
        setSummary(projectData.Summary || "");
        setTechnologies(projectData.Technologies || []);
        setProjectLink(projectData.ProjectLink || "");
      } catch (err) {
        if (isMounted) setError("Failed to fetch project data.");
      }
    };

    fetchProject();
    return () => {
      isMounted = false;
    };
  }, [projectID]);

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTechError(false);

    if (!projectName.trim() || !summary.trim() || technologies.some((tech) => tech.trim() === "")) {
      setError("All fields must be filled.");
      setLoading(false);
      return;
    }

    try {
  
      if (projectID) {
        const projectRef = doc(db, "projects", projectID);
        await updateDoc(projectRef, {
          ProjectName: projectName,
          Summary: summary,
          Technologies: technologies,
          ProjectLink: projectLink
        });
      } else {
        const projectRef = doc(collection(db, "projects"));
        const customProjectId = projectRef.id;

        const newProject = {
          ProjectName: projectName,
          Summary: summary,
          Technologies: technologies,
          UserUID: userUID,
          CoverPicture: "",
          id: customProjectId, 
          ProjectLink: projectLink,
        };

        await setDoc(projectRef, newProject);
      }
  
      navigate("/details", { state: { userUID: userUID } }); 
    } catch (err) {
      console.error("Project submission failed:", err);
      alert(err);
      setError("Failed to create or update project.");
    } finally {
      setLoading(false);
    }
  };

  const handleTechnologyChange = (index: number, value: string) => {
    const newTechnologies = [...technologies];
    newTechnologies[index] = value;
    setTechnologies(newTechnologies);
  };

  const addTechnology = () => {
    setTechnologies([...technologies, ""]); 
  };

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  return (
    <Form onSubmit={handleProjectSubmit}>
      <h1>{projectID ? "Edit Project" : "Add Project"}</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <FormGroup>
        <FormLabel>Project Name</FormLabel>
        <FormControl
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Summary</FormLabel>
        <FormControl
          as="textarea"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter project summary"
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Project Link</FormLabel>
        <FormControl
          type="text"
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
          placeholder="Enter project link"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Technologies</FormLabel>
        {technologies.map((tech, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <FormControl
              type="text"
              value={tech}
              onChange={(e) => handleTechnologyChange(index, e.target.value)}
              placeholder="Enter technology"
              className={`me-2 ${techError && tech.trim() === "" ? "border-danger" : ""}`}
              required
            />
            <Button variant="danger" onClick={() => removeTechnology(index)}>Remove</Button>
          </div>
        ))}
        {techError && <small className="text-danger">All technology fields must be filled.</small>}
        <br />
        <Button variant="secondary" onClick={addTechnology} className="mt-2">+ Add Technology</Button>
      </FormGroup>

      <Button disabled={loading} className="w-100 mt-2" type="submit">
        {projectID ? "Save Changes" : "Create Project"}
      </Button>
      <Link to="/details" state={{ userUID: userUID }}>
                                <Button variant="dark" className="mt-2">Back to Details</Button>
                            </Link>
    </Form>
  );
};

export default ProjectAddForm;
