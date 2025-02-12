import React, { useState } from "react";
// @ts-ignore
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';

export default function AddDetails() {
  // State to store fetched Firestore documents
  const [allDocs, setAllDocs] = useState<{ id: string; data: any }[]>([]);

  async function fetchAll() {
    const querySnapshot = await getDocs(collection(db, "users"));
    const docsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setAllDocs(docsArray); // Update state
  }

  return (
    <div>
      <h1 className="text-center">Showing Data</h1>
      <button className="btn btn-primary w-100 mt-3" onClick={fetchAll}>Fetch All Docs</button>

      {/* Display Firestore Data */}
      <ul>
        {allDocs.map((doc) => (
          <li key={doc.id}>
            <strong>ID:</strong> {doc.id} <br />
            <strong>Data:</strong> {JSON.stringify(doc.data)}
            <h1>{doc.data.Bio}</h1>
          </li>
        ))}
      </ul>
      <Link to="/" className="btn btn-primary w-100 mt-3">
            Back to Dashboard
            </Link>
    </div>
  );
}
