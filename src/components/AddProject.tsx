import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
// @ts-ignore
import { db, auth } from "../firebase";
import { Form, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";

const ProjectAddForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const userUID = location.state?.userUID; 

  const projectNameRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLInputElement>(null);
  const technologiesRef = useRef<HTMLInputElement>(null);

  async function handleProjectSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!projectNameRef.current?.value) {
        throw new Error("Project name is required.");
      }

      const newProject = {
        ProjectName: projectNameRef.current.value,
        Summary: summaryRef.current?.value || "",
        Technologies: technologiesRef.current?.value.split(",").map(tech => tech.trim()) || [],
        UserUID: userUID,
        CoverPicture: "", // Optional, can be updated later
      };

      await addDoc(collection(db, "projects"), newProject);

      navigate("/"); // Navigate after successful creation
    } catch (err) {
      setError("Failed to create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleProjectSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <h1>Add Project</h1>
      <FormGroup id="projectName">
        <FormLabel>Project Name</FormLabel>
        <FormControl type="text" ref={projectNameRef} required placeholder="Enter project name" />
      </FormGroup>

      <FormGroup id="summary">
        <FormLabel>Summary</FormLabel>
        <FormControl type="text" ref={summaryRef} placeholder="Enter project summary" />
      </FormGroup>

      <FormGroup id="Technologies">
        <FormLabel>Technologies</FormLabel>
        <FormControl type="text" ref={technologiesRef} placeholder="Enter technologies (comma-separated)" />
      </FormGroup>

      <Button disabled={loading} className="w-100 mt-2" type="submit">
        Create Project
      </Button>
    </Form>
  );
};

export default ProjectAddForm;
