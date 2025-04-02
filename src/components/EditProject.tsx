import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase";
import { Form, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";

const ProjectEditForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [techError, setTechError] = useState(false);
  
  const [projectName, setProjectName] = useState("");
  const [summary, setSummary] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const projectNameFromState = location.state?.projectName;

  interface Project {
    ProjectName: string;
    Summary?: string;
    Technologies?: string[];
  }

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      try {
        if (!projectNameFromState) return;
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where("ProjectName", "==", projectNameFromState));
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
      } catch (err) {
        if (isMounted) setError("Failed to fetch project data.");
      }
    };

    fetchProject();
    return () => {
      isMounted = false;
    };
  }, [projectNameFromState]);

  const handleProjectUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTechError(false);

    // Validation: No empty fields
    if (!projectName.trim() || !summary.trim() || technologies.some((tech) => tech.trim() === "")) {
      setError("All fields must be filled.");
      setLoading(false);
      return;
    }

    try {
      const projectsRef = collection(db, "projects");
      const q = query(projectsRef, where("ProjectName", "==", projectNameFromState));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No matching project found.");
      }

      const projectDoc = querySnapshot.docs[0];
      await updateDoc(projectDoc.ref, {
        ProjectName: projectName,
        Summary: summary,
        Technologies: technologies,
      });

      navigate("/");
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update project.");
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
    setTechnologies([...technologies, ""]); // Add an empty field for users to fill in
  };

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  return (
    <Form onSubmit={handleProjectUpdate}>
      <h1>Edit Project</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <FormGroup>
        <FormLabel>Project Name</FormLabel>
        <FormControl
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter new project name"
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Summary</FormLabel>
        <FormControl
          as="textarea"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter new summary"
          required
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
        <Button variant="secondary" onClick={addTechnology} className="mt-2">+ Add Technology</Button>
      </FormGroup>

      <Button disabled={loading} className="w-100 mt-2" type="submit">
        Save Changes
      </Button>
    </Form>
  );
};

export default ProjectEditForm;
