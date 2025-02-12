import React, { useState } from "react";
// @ts-ignore
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";

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
      <h1>Showing Data</h1>
      <button onClick={fetchAll}>Fetch All Docs</button>

      {/* Display Firestore Data */}
      <ul>
        {allDocs.map((doc) => (
          <li key={doc.id}>
            <strong>ID:</strong> {doc.id} <br />
            <strong>Data:</strong> {JSON.stringify(doc.data)}
          </li>
        ))}
      </ul>
    </div>
  );
}
