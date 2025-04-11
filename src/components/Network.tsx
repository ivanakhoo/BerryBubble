// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
// @ts-ignore
import { db } from "../firebase"; 
import CompanyPictureUpload from './CompanyPictureUpload';
import SchoolPictureUpload from './SchoolPictureUpload';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Network() {
  const [schoolImages, setSchoolImages] = useState<string[]>([]);
  const [companyImages, setCompanyImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const schoolQuery = query(collection(db, "schools"), where("verified", "==", true));
        const schoolSnapshot = await getDocs(schoolQuery);
        const schoolPics = schoolSnapshot.docs
          .map(doc => doc.data().picture)
          .filter((url): url is string => typeof url === "string");
        setSchoolImages(schoolPics);
  
        const companyQuery = query(collection(db, "companies"), where("verified", "==", true));
        const companySnapshot = await getDocs(companyQuery);
        const companyPics = companySnapshot.docs
          .map(doc => doc.data().picture)
          .filter((url): url is string => typeof url === "string");
        setCompanyImages(companyPics);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
  
    fetchImages();
  }, []);
  

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Network</h1>

      <h2 style={{ textAlign: "center" }}>Graduate Schools</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: "10px",
          justifyItems: "center",
          padding: "0 10px",
        }}
      >
        {schoolImages.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`School ${index}`}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ))}
      </div>


      <h2 style={{ textAlign: "center" }}>Companies</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: "10px",
          justifyItems: "center",
          padding: "0 10px",
        }}
      >
        {companyImages.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Company ${index}`}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ))}
      </div>


        <div style={{ textAlign: "center" }}>
            <h1 style={{ textAlign: "center" }}>Upload Your School Or Company!</h1>
            <h4 style={{ textAlign: "center" }}>School</h4>
        <SchoolPictureUpload />
        <h4 style={{ textAlign: "center" }}>Company</h4>
        <CompanyPictureUpload />
        </div>
    </>
  );
}
