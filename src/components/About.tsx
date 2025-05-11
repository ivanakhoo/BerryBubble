import { useEffect, useState } from 'react';
// @ts-ignore
import { useAuth } from '../contexts/AuthContext';
import { reload } from "firebase/auth";
// @ts-ignore
import { db } from "../firebase"; 
import { doc, updateDoc } from 'firebase/firestore';

export default function About() {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const { currentUser } = useAuth();

  useEffect(() => {
    const reVerify = async () => {
      try {
        if (currentUser) {
          await reload(currentUser);
          if (currentUser.emailVerified) {
              await updateDoc(doc(db, "users", currentUser.uid), {
                  emailVerified: true,
              });
          }
      }
      } catch (error) {
        console.error("Error reverifying:", error);
      }
    };

    reVerify();

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

  return (
    <div style={containerStyle}>
  <div style={sectionStyle}>
    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      <img 
        src="/src/assets/images/ivanpic.png"
        alt="Ivan Khoo"
        style={{
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)"
        }}
      />
      <h2 style={{ marginTop: "1rem", fontWeight: 600 }}>Ivan Khoo</h2>
      <p style={{ color: "#666" }}>Founder · Class of 2025</p>
    </div>

    <p style={{ marginBottom: "1rem" }}>
      Berry Bubble began as an idea inspired by a childhood friend’s project—a directory for Georgia Tech’s Computer Science students, which
      I found both inspiring and genuinely helpful. As a Math and Computer Science major at a still-growing school and program, 
      I realized how valuable something like this could be for Berry’s Math and CS community. 
      Throughout my time at Berry, I often found myself sifting through LinkedIn profiles (for an embarassing amount of time) in efforts to connect with Math and CS alumni and get ideas and clarity on the different paths I could take with my education.
    </p>

    <p style={{ marginBottom: "1rem" }}>
      So, for my senior project, I created <strong>Berry Bubble</strong>—a directory of current students and alumni where users can showcase their projects, 
      share experiences, and tell a bit of their story, while making it easy to connect through other platforms like LinkedIn, Email, and GitHub. 
      Having personally benefited from the advice, support, and genuine care of Berry alumni, I wanted to create a space that fosters those same kinds of meaningful connections.
    </p>

    <p style={{ marginBottom: "1rem" }}>
      This project is my way of giving back to two programs that have profoundly changed my life. I'm extremely proud and grateful for the opportunity 
      to help bridge the gap between students and alumni, and I’d love to chat about the project, my Berry experience, future feature ideas, or anything in between!
      Thanks for checking it out!
    </p>

    <div style={{ marginTop: "2rem"}}>
      <p>Sincerely,</p>
      <p style={{ fontWeight: 600}}>Ivan Khoo</p>
    </div>
  </div>
</div>

  );
}
