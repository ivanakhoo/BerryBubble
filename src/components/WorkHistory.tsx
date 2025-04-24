import { forwardRef, useEffect, useState } from "react";
import { Button, Card, Dropdown } from "react-bootstrap";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase";
import { Link } from "react-router-dom";
import WorkHistoryPictureUpload from "./WorkHistoryPictureUpload";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";

interface History {
  UserUID: string;
  StartDate: string;
  EndDate: string;
  CompanyName: string;
  Role: string;
  picture: string;
  id: string;
  Description?: string;
}

interface HistoryProps {
  userUID: string;
  isAdmin: boolean;
  currentUserUID: string;
}

const WorkHistory: React.FC<HistoryProps> = ({ userUID, isAdmin, currentUserUID }) => {
  const [workHistory, setWorkHistory] = useState<History[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWork = async () => {
      if (!userUID) return;
      try {
        const projectsRef = collection(db, "history");
        const q = query(projectsRef, where("UserUID", "==", userUID));
        const querySnapshot = await getDocs(q);
        const projectsList: History[] = [];

        querySnapshot.forEach((docSnap) => {
          projectsList.push({ id: docSnap.id, ...(docSnap.data() as Omit<History, "id">) });
        });

        const sortedList = projectsList.sort((a, b) =>
          new Date(b.EndDate).getTime() - new Date(a.EndDate).getTime()
        );

        setWorkHistory(sortedList);
      } catch (error) {
        console.error("Error fetching work history:", error);
      }
    };

    fetchWork();
  }, [userUID]);

  const handleWorkPictureUpdate = (companyId: string, newUrl: string) => {
    setWorkHistory(prev =>
      prev.map(p =>
        p.id === companyId ? { ...p, picture: newUrl } : p
      )
    );
  };

  const handleDeleteWorkHistory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "history", id));
      setWorkHistory((prev) => prev.filter((history) => history.id !== id));
    } catch (error) {
      console.error("Error deleting work history:", error);
    }
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

  return (
    <div className="mt-4">
      <h1 className="text-center mt-4">Experience</h1>

      {(isAdmin || currentUserUID === userUID) && (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <Link to="/add-history" state={{ userUID }}>
            <Button variant="dark" className="mt-2">Add Experience</Button>
          </Link>
        </div>
      )}

      {workHistory.length > 0 ? (
        <div>
          {workHistory.map((entry) => (
            <Card
            key={entry.id}
            style={{
              width: '100%',
              maxWidth: '360px',
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
            {/* Dropdown for Admin Actions */}
            {(isAdmin || currentUserUID === entry.UserUID) && (
              <Dropdown style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
                <Dropdown.Toggle as={CustomToggle} />
          
                <Dropdown.Menu>
                <Dropdown.Item as="div">
                  <WorkHistoryPictureUpload companyID={entry.id} 
                  onUploadComplete={(url) => handleWorkPictureUpdate(entry.id, url)}/>
                </Dropdown.Item>

          
                  <Dropdown.Item
                    onClick={() =>
                      navigate("/add-history", {
                        state: { companyID: entry.id, userUID },
                      })
                    }
                  >
                    <i className="bi bi-pencil-square me-2 text-primary" /> Edit Experience
                  </Dropdown.Item>
          
                  <Dropdown.Item
                    onClick={() => handleDeleteWorkHistory(entry.id)}
                  >
                    <i className="bi bi-trash me-2 text-danger" /> Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          
            {/* Image */}
            {entry.picture && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <img
                  src={entry.picture}
                  alt="Company"
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
          
            {/* Company + Role */}
            <h3 className="text-muted mb-2">{entry.CompanyName}</h3>
            <h4 className="text-muted mb-3">{entry.Role}</h4>
          
            <p>{entry.Description}</p>
          
            {/* Dates */}
            <p className="mb-1">
              <i className="bi bi-calendar3" /> {entry.StartDate} – {entry.EndDate}
            </p>
          </Card>
          ))}
        </div>
      ) : (
        <p className="text-center">No work history available.</p>
      )}
    </div>
  );
};

export default WorkHistory;
