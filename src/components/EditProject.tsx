import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
// @ts-ignore
import { db, auth } from "../firebase";
import { Form, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";

const ProjectEditForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
    const projectName = location.state?.projectName; 
  
  const summaryRef = useRef<HTMLInputElement>(null);
  const projectNameRef = useRef<HTMLInputElement>(null);
  const technologiesRef = useRef<HTMLInputElement>(null);

  interface Project {
        CoverPicture?: string;
        ProjectName: string;
        Summary?: string;
        Technologies?: Array<string>;
        UserUID: string;
        }
  
    const [project, setProject] = useState<Project | null>(null);

useEffect(() => {
        const fetchProject = async () => {
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where("ProjectName", "==", projectName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("No matching project found.");
        }
        const projectDoc = querySnapshot.docs[0];
        setProject(projectDoc.data() as Project);
        };

    fetchProject();
    }, [projectName]);

  async function handleProjectUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const promises = [];
    setLoading(true);
    setError("");

    try {
      const projectsRef = collection(db, "projects");
      const q = query(projectsRef, where("ProjectName", "==", projectName));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No matching project found.");
      }
      
      const projectDoc = querySnapshot.docs[0];
      
      if (summaryRef.current?.value) {
        promises.push(updateDoc(projectDoc.ref, { Summary: summaryRef.current.value }));
      }

      if (projectNameRef.current?.value) {
        promises.push(updateDoc(projectDoc.ref, { ProjectName: projectNameRef.current.value }));
      }

      if (technologiesRef.current?.value) {
        const techArray = technologiesRef.current.value.split(",").map(tech => tech.trim());
        promises.push(updateDoc(projectDoc.ref, { Technologies: techArray }));
    }
    
      
      await Promise.all(promises);
      navigate("/");
    } catch (err) {
      setError("Failed to update project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleProjectUpdate}>
      {error && <div className="alert alert-danger">{error}</div>}

      <FormGroup id="projectName">
        <FormLabel>Project Name</FormLabel>
        <FormControl type="text" ref={projectNameRef} required defaultValue={project?.ProjectName} placeholder="Enter new project name" />
      </FormGroup>

      <FormGroup id="summary">
        <FormLabel>Summary</FormLabel>
        <FormControl type="text" ref={summaryRef} defaultValue={project?.Summary} placeholder="Enter new summary" />
      </FormGroup>

      <FormGroup id="Technologies">
        <FormLabel>Technologies</FormLabel>
        <FormControl type="text" ref={technologiesRef} defaultValue={project?.Technologies} placeholder="Enter new technologies" />
      </FormGroup>

      <Button disabled={loading} className="w-100 mt-2" type="submit">
        Save Changes
      </Button>
    </Form>
  );
};

export default ProjectEditForm;
