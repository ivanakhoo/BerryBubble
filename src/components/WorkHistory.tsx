import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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

        const sortedList = projectsList.sort((a, b) => {
          return new Date(b.EndDate).getTime() - new Date(a.EndDate).getTime();
        });

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
    <>
      {workHistory.length > 0 && (
        <>
          <h2 className="text-center">Work History</h2>
          {(isAdmin || currentUserUID === userUID) && (
      <div style={{ marginBottom: '10px' }}>
      <Link to="/add-history" state={{ userUID: userUID }}>
        <Button variant="dark" className="mt-2">Add Work History</Button>
      </Link>
    </div>
                        )}
          {workHistory.map((history, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              {history.picture && (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                  <img
                    src={history.picture}
                    alt="companyPicture"
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
              <p><strong>Company:</strong> {history.CompanyName}</p>
              <p><strong>Role:</strong> {history.Role}</p>
              <p><strong>Start Date:</strong> {history.StartDate}</p>
              <p><strong>End Date:</strong> {history.EndDate}</p>

              {(isAdmin || currentUserUID === history.UserUID) && (
                <div className="mt-4 d-flex flex-column align-items-start gap-2">
                  <WorkHistoryPictureUpload companyID={history.id} />

                  <Link
                    to="/add-history"
                    state={{ companyID: history.id, userUID: userUID }}
                    className="w-100"
                  >
                    <Button variant="dark" className="w-100">
                      Edit Work History
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={() => handleDeleteWorkHistory(history.id)}
                  >
                    Delete Project
                  </Button>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default WorkHistory;
