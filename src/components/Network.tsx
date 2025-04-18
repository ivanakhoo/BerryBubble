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
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#0A0F2C",
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box", 
    padding: isMobile ? "1rem" : "0",
    overflowX: "hidden",    
  };

  const sectionStyle: React.CSSProperties = {
    width: "100%",
    background: "linear-gradient(135deg, #0A0F2C, #0D122F)",
    color: "#F4F7FB",
    borderRadius: isMobile ? "12px" : "0",
    boxShadow: isMobile ? "0 4px 20px rgba(0, 240, 255, 0.2)" : "none",
    padding: isMobile ? "1.5rem" : "3rem 5rem",
    marginBottom: "2rem",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(80px, 1fr))" : "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "16px",
    justifyItems: "center",
    width: "100%",
  };

  const imageStyle: React.CSSProperties = {
    width: isMobile ? "80px" : "100px",
    height: isMobile ? "80px" : "100px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    transition: "transform 0.2s ease-in-out",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", fontWeight: "bold", fontSize: isMobile ? "2rem" : "2.5rem", color: "#00F0FF", textShadow: "0 0 8px #00F0FF" }}>
        🌐 Berry Network
      </h1>

      <div style={sectionStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🎓 Graduate Schools</h2>
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
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>💼 Companies</h2>
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

      <div
        style={{
          ...sectionStyle,
          background: "linear-gradient(135deg, #1E2A78, #3F8EF4)",
          color: "#F4F7FB",
          boxShadow: "0 4px 15px rgba(63, 142, 244, 0.3)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>🚀 Upload Your School or Company</h2>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h5 style={{ textAlign: "center", marginBottom: "0.5rem" }}>School</h5>
            <SchoolPictureUpload />
          </div>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h5 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Company</h5>
            <CompanyPictureUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
