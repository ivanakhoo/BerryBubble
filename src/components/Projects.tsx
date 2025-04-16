import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase"; 
import { Link } from "react-router-dom";
import ProjectPictureUpload from "./ProjectPictureUpload";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    id: string;
    ProjectLink?: string;
  }

const Projects: React.FC<ProjectsProps> = ({ userUID, isAdmin, currentUserUID }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [favoriteProject, setFavoriteProject] = useState<string | null>(null); // Store the FavoriteProject

  useEffect(() => {
    const fetchUserFavorite = async () => {
      if (!userUID) return;
      
      try {
        const userDoc = doc(db, "users", userUID); 
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setFavoriteProject(userData?.FavoriteProject || null);
        }
      } catch (error) {
        console.error("Error fetching user's favorite project:", error);
      }
    };

    fetchUserFavorite();
  }, [userUID]);
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


  const handleFavoriteToggle = async (projectId: string) => {
    if (!userUID) return;

    try {
      const userDoc = doc(db, "users", userUID);
      await updateDoc(userDoc, {
        FavoriteProject: projectId,
      });
      setFavoriteProject(projectId); 
    } catch (error) {
      console.error("Error updating favorite project:", error);
    }
  };
  
  return (
    <div className="mt-4">
      <h4>Projects</h4>
      {(isAdmin || currentUserUID === userUID) && (
      <div style={{ marginBottom: '10px' }}>
      <Link to="/add-project" state={{ userUID: userUID }}>
        <Button variant="dark" className="mt-2">Add Project</Button>
      </Link>
    </div>
                        )}
      {projects.length > 0 ? (
        <div>
          {projects.map((project) => (
            <Card
            key={project.ProjectName + project.UserUID}
            className="mb-4 p-4 shadow rounded border border-light position-relative mx-auto"
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              maxWidth: "500px", 
            }}
          >
            {/* Favorite Star */}
            <Button
              variant="link"
              onClick={isAdmin ? () => handleFavoriteToggle(project.id) : undefined}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                fontSize: "1.75rem",
                color: favoriteProject === project.id ? "#ffc107" : "#ccc",
                textDecoration: "none",
                zIndex: 1,
                cursor: isAdmin ? "pointer" : "not-allowed",
                opacity: isAdmin ? 1 : 0.5,
              }}
              disabled={!isAdmin || currentUserUID !== userUID}
            >
              {favoriteProject === project.id ? "★" : "☆"}
            </Button>

          
            {/* Project Name */}
            <h4 className="text-center mb-3">{project.ProjectName}</h4>
          
            {/* Project Image */}
            {project.CoverPicture && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <img
                  src={
                    project.CoverPicture ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="Project"
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #e2e8f0",
                  }}
                />
              </div>
            )}
          
            {/* Summary */}
            <p className="text-muted">{project.Summary}</p>

            {project.ProjectLink && (
              <a
                href={project.ProjectLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Project"
                style={{ textDecoration: 'none', color: 'inherit', marginLeft: '8px' }}
              >
                <i className="bi bi-link" style={{ fontSize: '1.3rem' }}></i>
              </a>
            )}
          
            {/* Technologies */}
            {project?.Technologies && project.Technologies.length > 0 && (
              <>
                <p className="fw-bold mt-3 mb-2">Technologies:</p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {project.Technologies.map((tech: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#f1f5f9",
                        color: "#1e293b",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        fontFamily: "monospace",
                        border: "1px solid #cbd5e1",
                        transition: "0.2s",
                        cursor: "default",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </>
            )}
          
            {/* Admin Tools */}
            {(isAdmin || currentUserUID === project.UserUID) && (
              <div className="mt-4 d-flex flex-column align-items-start gap-2">
                <ProjectPictureUpload id={project.id} />
          
                <Link
                  to="/add-project"
                  state={{ projectID: project.id, userUID: userUID }}
                  className="w-100"
                >
                  <Button variant="dark" className="w-100">
                    Edit Project
                  </Button>
                </Link>
          
                <Button
                  variant="danger"
                  className="w-100"
                  onClick={() => handleDeleteProject(project.ProjectName, project.UserUID)}
                >
                  Delete Project
                </Button>
              </div>
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
