import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase"; 
import { Link } from "react-router-dom";
import ProjectPictureUpload from "./ProjectPictureUpload";

interface ProjectsProps {
  userUID: string;
  isAdmin: boolean;
  currentUserUID: string;
}

interface Project {
    UserUID: string;
    ProjectName: string;
    CoverPicture?: string;
    Summary: string;
    Technologies: string[];
  }

const Projects: React.FC<ProjectsProps> = ({ userUID, isAdmin, currentUserUID }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userUID) return;

      try {
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where("UserUID", "==", userUID));
        const querySnapshot = await getDocs(q);
        const projectsList: Project[] = [];
        querySnapshot.forEach((doc) => {
          projectsList.push({ UserUID: doc.id, ...doc.data() } as Project);
        });
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [userUID]);

  const handleDeleteProject = async (projectName: string, userUID: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where("ProjectName", "==", projectName), where("UserUID", "==", userUID));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          alert("Project not found.");
          return;
        }

        const docToDelete = querySnapshot.docs[0]; 
        await deleteDoc(doc(db, "projects", docToDelete.id));
  
        setProjects(projects.filter(project => project.ProjectName !== projectName || project.UserUID !== userUID));
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project.");
      }
    }
  };
  return (
    <div className="mt-4">
      <h4>Projects</h4>
      {(isAdmin || currentUserUID === userUID) && (
      <Link to="/add-project" state={{ userUID: userUID }}>
                                <Button variant="dark" className="mt-2">Add Project</Button>
                            </Link>
                        )}
      {projects.length > 0 ? (
        <div>
          {projects.map((project) => (
            <Card key={project.ProjectName + project.UserUID} className="mb-3">
              <h5>{project.ProjectName}</h5>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {project.CoverPicture && (<img 
                  src={project.CoverPicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                  alt="Profile" 
                  style={{
                    width: "150px", 
                    height: "150px", 
                    borderRadius: "50%", 
                    objectFit: "cover",
                    border: "3px solid #ddd" 
                  }} 
                />)}
              </div>
              {(isAdmin || currentUserUID === project.UserUID) && (    
                <div>
                  <ProjectPictureUpload projectName = {project.ProjectName}/>
                  <Link to="/add-project" state={{ projectName: project.ProjectName, userUID: userUID }}>
                              <Button variant="dark" className="mt-2">Edit Project</Button>
                              </Link>
                              <Button 
                    variant="danger" 
                    className="mt-2 ms-2" 
                    onClick={() => handleDeleteProject(project.ProjectName, project.UserUID,)}
                  >
                    Delete Project
                  </Button>
                </div>         
                            )}

              <p>{project.Summary}</p>
              {project?.Technologies && project.Technologies.length > 0 && (
                <>
                  <p><strong>Technologies:</strong></p>
                  <ul>
                    {project.Technologies.map((tech: string, index: number) => (
                      <li key={index}>{tech}</li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

export default Projects;
