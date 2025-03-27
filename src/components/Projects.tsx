import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { collection, query, where, getDocs } from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase"; 
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

  return (
    <div className="mt-4">
      <h4>Projects</h4>
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
                <ProjectPictureUpload projectName={project.ProjectName} />
              )}
              <p>{project.Summary}</p>
              <p><strong>Technologies:</strong></p>
              <ul>
                {Array.isArray(project.Technologies) && project.Technologies.map((tech: string, index: number) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
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
