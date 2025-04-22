import { useEffect, useState } from 'react';
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
// @ts-ignore
import { db } from "../firebase"; 
import CompanyPictureUpload from './CompanyPictureUpload';
import SchoolPictureUpload from './SchoolPictureUpload';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Network() {
  const [schoolImages, setSchoolImages] = useState<string[]>([]);
  const [companyImages, setCompanyImages] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

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

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerStyle: React.CSSProperties = {
    backgroundColor: "var(--background-light)",
    minHeight: "100vh",
    width: "100%",
    padding: isMobile ? "1rem" : "2rem 4rem",
    fontFamily: "'Segoe UI', sans-serif",
    boxSizing: "border-box",
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: isMobile ? "1.5rem" : "2.5rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    border: "1px solid var(--neutral-gray)",
    color: "var(--text-dark)",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(80px, 1fr))" : "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "20px",
    justifyItems: "center",
  };

  const imageStyle: React.CSSProperties = {
    width: isMobile ? "80px" : "100px",
    height: isMobile ? "80px" : "100px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{
        textAlign: "center",
        fontWeight: 700,
        fontSize: isMobile ? "2rem" : "2.5rem",
        color: "var(--primary-blue)",
        marginBottom: "2rem"
      }}>
        Berry Network
      </h1>

      <div style={sectionStyle}>
        <h2 className="text-center">Graduate Schools</h2>
        <div style={gridStyle}>
          {schoolImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`School ${index}`}
              style={imageStyle}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 className="text-center">Companies</h2>
        <div style={gridStyle}>
          {companyImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Company ${index}`}
              style={imageStyle}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ))}
        </div>
      </div>

      <div style={{
        ...sectionStyle,
        backgroundColor: "var(--primary-blue)",
        color: "white",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Upload Your School or Company</h2>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h5 style={{ textAlign: "center", marginBottom: "0.5rem", color: "white" }}>School</h5>
            <SchoolPictureUpload />
          </div>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h5 style={{ textAlign: "center", marginBottom: "0.5rem", color: "white" }}>Company</h5>
            <CompanyPictureUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
