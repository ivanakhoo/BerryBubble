import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase"; 
import { Link } from "react-router-dom";
import ProjectPictureUpload from "./ProjectPictureUpload";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Dropdown } from "react-bootstrap";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

  const handleDeleteProject = async (id: string, userUID: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where("id", "==", id), where("UserUID", "==", userUID));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          alert("Project not found.");
          return;
        }

        const docToDelete = querySnapshot.docs[0]; 
        await deleteDoc(doc(db, "projects", docToDelete.id));

        const userRef = collection(db, "users");
        const u = query(userRef, where("userUID", "==", userUID));
        const querySnapshot2 = await getDocs(u);

        if (!querySnapshot2.empty) {
          const userDoc = querySnapshot2.docs[0];
          const userData = userDoc.data();

          if (userData.FavoriteProject === id) {
            await updateDoc(userDoc.ref, { FavoriteProject: "" });
            console.log("FavoriteProject field cleared.");
          }
        }
  
        setProjects(projects.filter(project => project.id !== id || project.UserUID !== userUID));
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project.");
      }
    }
  };

  const handleProjectPictureUpdate = (projectId: string, newUrl: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId ? { ...p, CoverPicture: newUrl } : p
      )
    );
  };

  const CustomToggle = forwardRef(({ onClick }: any, ref: any) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{
        all: "unset", 
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
      }}
    >
      <i className="bi bi-three-dots-vertical" style={{ fontSize: "1.2rem", color: "#2E3A59" }}></i>
    </button>
  ));
  


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
      <h1 className="text-center mt-4">Projects</h1>
      {(isAdmin || currentUserUID === userUID) && (
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
      <Link to="/add-project" state={{ userUID: userUID }}>
        <Button variant="dark" className="mt-2">Add Project</Button>
      </Link>
    </div>
                        )}
      {projects.length > 0 ? (
        <div>
          {projects.map((project) => (
            
            <Card
              key={project.id + project.UserUID}
              style={{
                width: '360px',
                minHeight: '200px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                margin: '0 auto',
              }}
              className="mb-4 text-center text-white p-3"
            >
            
              {/* Favorite Star - Top Left */}
              <Button
                variant="link"
                onClick={isAdmin ? () => handleFavoriteToggle(project.id) : undefined}
                style={{
                  position: "absolute",
                  top: "6px",
                  left: "12px",
                  fontSize: "1.75rem",
                  color: favoriteProject === project.id ? "#ffc107" : "#ccc",
                  textDecoration: "none",
                  zIndex: 2,
                  cursor: isAdmin ? "pointer" : "not-allowed",
                  opacity: isAdmin ? 1 : 0.5,
                }}
                disabled={!(isAdmin || currentUserUID === userUID)}
              >
                {favoriteProject === project.id ? "★" : "☆"}
              </Button>
            
              {/* Dropdown - Top Right */}
              {(isAdmin || currentUserUID === project.UserUID) && (
                <Dropdown style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
                  <Dropdown.Toggle as={CustomToggle} />
            
                  <Dropdown.Menu>
                    <Dropdown.Item as="div">
                      <ProjectPictureUpload
                        id={project.id}
                        onUploadComplete={(url) => handleProjectPictureUpdate(project.id, url)}
                      />
                    </Dropdown.Item>
            
                    <Dropdown.Item
                      onClick={() =>
                        navigate("/add-project", {
                          state: { projectID: project.id, userUID: userUID },
                        })
                      }
                    >
                      <i className="bi bi-pencil-square me-2 text-primary" /> Edit Project
                    </Dropdown.Item>
            
                    <Dropdown.Item
                      onClick={() => handleDeleteProject(project.id, project.UserUID)}
                    >
                      <i className="bi bi-trash me-2 text-danger" /> Delete Project
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            
              {/* Project Name */}
              <h4 className="text-center mb-3">{project.ProjectName}</h4>
            
              {/* Project Image */}
              {project.CoverPicture && (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                  <img
                    src={project.CoverPicture}
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
