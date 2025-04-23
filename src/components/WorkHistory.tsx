import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase";
import { Link } from "react-router-dom";
import WorkHistoryPictureUpload from "./WorkHistoryPictureUpload";
import 'bootstrap-icons/font/bootstrap-icons.css';

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

  const handleDeleteWorkHistory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "history", id));
      setWorkHistory((prev) => prev.filter((history) => history.id !== id));
    } catch (error) {
      console.error("Error deleting work history:", error);
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-center mt-4">Work History</h1>

      {(isAdmin || currentUserUID === userUID) && (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <Link to="/add-history" state={{ userUID }}>
            <Button variant="dark" className="mt-2">Add Work History</Button>
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

              {/* Admin Actions */}
              {(isAdmin || currentUserUID === entry.UserUID) && (
                <div className="mt-4 d-flex flex-column align-items-start gap-2">
                  <WorkHistoryPictureUpload companyID={entry.id} />

                  <Link
                    to="/add-history"
                    state={{ companyID: entry.id, userUID }}
                    className="w-100"
                  >
                    <Button variant="dark" className="w-100">
                      Edit Work History
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={() => handleDeleteWorkHistory(entry.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
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
